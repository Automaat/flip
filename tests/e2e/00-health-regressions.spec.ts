import { test, expect, type APIRequestContext } from "@playwright/test";
import postgres from "postgres";

const pg = postgres(process.env.DATABASE_URL!, { max: 1 });
const fixtureDecks: string[] = [];
const fixtureNotes: string[] = [];
let savedSettings: Record<string, unknown>;

test.beforeEach(async ({ request }) => {
  savedSettings = await (await request.get("/api/settings")).json();
  await request.put("/api/settings", { data: { newCardsPerDay: 200, retention: 0.9 } });
});

test.afterEach(async ({ request }) => {
  await request.put("/api/settings", { data: savedSettings });
  if (fixtureDecks.length) await pg`delete from decks where id in ${pg(fixtureDecks)}`;
  if (fixtureNotes.length) await pg`delete from notes where id in ${pg(fixtureNotes)}`;
  fixtureDecks.length = 0;
  fixtureNotes.length = 0;
});

test.afterAll(async () => { await pg.end(); });

async function fixture(fields: Record<string, string> = { spanish: "prueba", english: "test" }) {
  const [deck] = await pg`insert into decks (name) values ('Health regression fixture') returning id`;
  const [note] = await pg`insert into notes (note_type, fields) values ('vocab', ${pg.json(fields)}) returning id`;
  fixtureDecks.push(deck.id);
  fixtureNotes.push(note.id);
  const [card] = await pg`insert into cards (note_id, deck_id, due) values (${note.id}, ${deck.id}, now() - interval '1 day') returning id`;
  return { deckId: deck.id as string, noteId: note.id as string, cardId: card.id as string };
}

async function rate(request: APIRequestContext, cardId: string, expectedReps: number) {
  return request.post("/api/review/rate", { data: { cardId, expectedReps, rating: "good", durationMs: 1000 } });
}

test("learning progress survives persistence and graduates on the next due review", async ({ request }) => {
  const { cardId } = await fixture();
  expect((await rate(request, cardId, 0)).ok()).toBeTruthy();
  const [learning] = await pg`select state, learning_steps from cards where id = ${cardId}`;
  expect(learning.state).toBe("learning");
  expect(learning.learning_steps).toBe(1);
  await pg`update cards set due = now(), last_review = now() - interval '10 minutes' where id = ${cardId}`;
  const graduated = await rate(request, cardId, 1);
  expect(graduated.ok()).toBeTruthy();
  expect((await graduated.json()).state).toBe("review");
});

test("concurrent and retried ratings advance the card exactly once", async ({ request }) => {
  const { cardId } = await fixture();
  const responses = await Promise.all([rate(request, cardId, 0), rate(request, cardId, 0), rate(request, cardId, 0)]);
  expect(responses.map((r) => r.status()).toSorted()).toEqual([200, 409, 409]);
  expect((await rate(request, cardId, 0)).status()).toBe(409);
  const [card] = await pg`select reps from cards where id = ${cardId}`;
  const [logs] = await pg`select count(*)::int as n from review_log where card_id = ${cardId}`;
  expect(card.reps).toBe(1);
  expect(logs.n).toBe(1);
});

test("rating buttons and keyboard are locked during a pending save", async ({ page }) => {
  const { deckId, cardId } = await fixture();
  let release!: () => void;
  const gate = new Promise<void>((resolve) => { release = resolve; });
  let submissions = 0;
  await page.route("**/api/review/rate", async (route) => {
    submissions++;
    await gate;
    await route.continue();
  });
  try {
    await page.goto(`/review?deck=${deckId}`);
    await page.getByRole("button", { name: /reveal/i }).click();
    await page.getByRole("button", { name: "Good" }).click();
    await expect(page.getByRole("button", { name: "Good" })).toBeDisabled();
    await page.keyboard.press("3");
    expect(submissions).toBe(1);
    release();
    await expect(page.getByRole("button", { name: "Good" })).not.toBeVisible();
    const [logs] = await pg`select count(*)::int as n from review_log where card_id = ${cardId}`;
    expect(logs.n).toBe(1);
  } finally { release(); }
});

test("quota conflict refresh allows retry when the same card remains mounted", async ({ page, request }) => {
  const { deckId, cardId } = await fixture();
  let attempts = 0;
  await page.route("**/api/review/rate", async (route) => {
    attempts++;
    if (attempts > 1) { await route.continue(); return; }
    const response = await route.fetch();
    expect(response.status()).toBe(409);
    await request.put("/api/settings", { data: { newCardsPerDay: 200 } });
    await route.fulfill({ response });
  });
  await page.goto(`/review?deck=${deckId}`);
  await page.getByRole("button", { name: /reveal/i }).click();
  await request.put("/api/settings", { data: { newCardsPerDay: 0 } });
  await page.getByRole("button", { name: "Good" }).click();
  await expect(page.getByRole("button", { name: "Good" })).toBeEnabled();
  await expect(page.getByRole("link", { name: "End session" })).toBeVisible();
  await page.getByRole("button", { name: "Good" }).click();
  await expect(page.getByRole("button", { name: "Good" })).not.toBeVisible();
  const [card] = await pg`select reps from cards where id = ${cardId}`;
  const [logs] = await pg`select count(*)::int as n from review_log where card_id = ${cardId}`;
  expect(card.reps).toBe(1);
  expect(logs.n).toBe(1);
});

test("zero quota excludes new cards from both entry points and rating; due reviews remain available", async ({ page, request }) => {
  const { deckId, cardId } = await fixture();
  await request.put("/api/settings", { data: { newCardsPerDay: 0 } });
  await page.goto(`/review?deck=${deckId}`);
  await expect(page.getByRole("heading", { name: "All done" })).toBeVisible();
  const next = await (await request.get("/api/review/next")).json();
  expect(next.card?.state).not.toBe("new");
  expect((await rate(request, cardId, 0)).status()).toBe(409);
  await pg`update cards set state = 'learning', reps = 1, learning_steps = 1, stability = 2, difficulty = 5, last_review = now() - interval '10 minutes' where id = ${cardId}`;
  await page.reload();
  await expect(page.getByRole("button", { name: /reveal/i })).toBeVisible();
  expect((await rate(request, cardId, 1)).ok()).toBeTruthy();
});

test("saved retention changes actual scheduled intervals", async ({ request }) => {
  const intervals: number[] = [];
  for (const retention of [0.8, 0.95]) {
    const { cardId } = await fixture();
    await pg`update cards set state = 'review', stability = 100, difficulty = 5, reps = 20, last_review = now() - interval '30 days' where id = ${cardId}`;
    await request.put("/api/settings", { data: { retention } });
    const res = await rate(request, cardId, 20);
    expect(res.ok()).toBeTruthy();
    intervals.push((await res.json()).scheduledDays);
  }
  expect(intervals[0]).toBeGreaterThan(intervals[1]! * 4);
});

test("immersion persists after save and rejects out-of-range values", async ({ request }) => {
  for (const immersionPercent of [0, 50, 100]) {
    const updated = await request.put("/api/settings", { data: { immersionPercent } });
    expect(updated.ok()).toBeTruthy();
    expect((await updated.json()).immersionPercent).toBe(immersionPercent);
    expect((await (await request.get("/api/settings")).json()).immersionPercent).toBe(immersionPercent);
  }
  for (const immersionPercent of [-1, 101, 5.5]) {
    expect((await request.put("/api/settings", { data: { immersionPercent } })).status()).toBe(400);
  }
});

for (const [endpoint, name, data] of [
  ["/api/gender/import", "Gender Exceptions", undefined],
  ["/api/false-friends/import", "False Friends", undefined],
  ["/api/cognates/unlock", "Cognates: tion-cion", { ruleId: "tion-cion" }],
] as const) {
  test(`concurrent ${name} imports create one complete deck`, async ({ request }) => {
    const before = await pg`select id from decks where name = ${name}`;
    const responses = await Promise.all(Array.from({ length: 3 }, () => request.post(endpoint, { data })));
    const bodies = await Promise.all(responses.map((r) => r.json()));
    if (!before.length) {
      fixtureDecks.push(bodies[0].deckId);
      const noteIds = await pg`select note_id from cards where deck_id = ${bodies[0].deckId}`;
      fixtureNotes.push(...noteIds.map((r) => r.note_id));
    }
    expect(responses.every((r) => r.ok())).toBeTruthy();
    expect(new Set(bodies.map((b) => b.deckId)).size).toBe(1);
    const decks = await pg`select id from decks where name = ${name}`;
    expect(decks.length).toBe(1);
    const [total] = await pg`select count(*)::int as n from cards where deck_id = ${bodies[0].deckId}`;
    expect(total.n).toBeGreaterThan(0);
    expect(bodies.reduce((n, b) => n + b.cardsCreated, 0)).toBe(before.length ? 0 : total.n);
  });
}

test("Reader shows validation and network errors and recovers on the next read", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/reader");
  await page.getByRole("textbox").fill("x".repeat(20_001));
  await page.getByRole("button", { name: "Read", exact: true }).click();
  await expect(page.locator("main").getByRole("alert")).toHaveText(/20,000/);
  await page.route("**/api/reader/analyze", (route) => route.abort());
  await page.getByRole("textbox").fill("La temporada.");
  await page.getByRole("button", { name: "Read", exact: true }).click();
  await expect(page.locator("main").getByRole("alert")).toHaveText(/connection/);
  await page.unroute("**/api/reader/analyze");
  await page.getByRole("button", { name: "Read", exact: true }).click();
  await expect(page.locator("article")).toBeVisible();
  await expect(page.locator("main").getByRole("alert")).not.toBeVisible();
  expect(errors).toEqual([]);
});

test("Reader recognizes article-prefixed nouns without losing accents or ñ", async ({ request }) => {
  const { cardId } = await fixture({ spanish: "la temporada", english: "season", gender: "f" });
  await pg`update cards set state = 'learning' where id = ${cardId}`;
  const year = await fixture({ spanish: "el año", english: "year", gender: "m" });
  await pg`update cards set state = 'review' where id = ${year.cardId}`;
  const res = await request.post("/api/reader/analyze", { data: { text: "La temporada del año. Ano." } });
  expect(res.ok()).toBeTruthy();
  const body = await res.json();
  expect(body.familiarity.temporada).toBe("learning");
  expect(body.familiarity.año).toBe("known");
  expect(body.familiarity.ano).toBe("unknown");
});

test("Pronounce hydrates consistently with speech support and handles denial", async ({ page }) => {
  const { noteId } = await fixture();
  await pg`update notes set fields = fields || ${pg.json({ example: "Una prueba.", audio: { example: "/fixture.mp3" } })} where id = ${noteId}`;
  await page.addInitScript(() => {
    class Recognition {
      listeners = new Map<string, (event: { error?: string }) => void>();
      addEventListener(type: string, listener: (event: { error?: string }) => void) { this.listeners.set(type, listener); }
      start() { this.listeners.get("error")?.({ error: "not-allowed" }); this.listeners.get("end")?.({}); }
      stop() {}
    }
    Object.assign(window, { SpeechRecognition: Recognition });
  });
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/pronounce");
  await expect(page.getByRole("button", { name: /Record/ })).toBeEnabled();
  await page.getByRole("button", { name: /Record/ }).click();
  await expect(page.getByText("speech error: not-allowed")).toBeVisible();
  await expect(page.getByRole("button", { name: /Record/ })).toBeEnabled();
  expect(errors).toEqual([]);
});

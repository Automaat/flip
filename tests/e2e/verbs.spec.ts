import { test, expect, type Page } from "@playwright/test";
import { conjugate } from "../../src/lib/conjugate";
import { TENSE_LABELS, type Person, type Tense } from "../../src/data/verbs";

test("verbs page renders conjugation table", async ({ page }) => {
  await page.goto("/verbs");
  await expect(page.getByRole("heading", { name: "Verbs" })).toBeVisible();
  await expect(page.getByText("ser", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("soy", { exact: true })).toBeVisible();
});

test("import API creates verb deck (present)", async ({ request }) => {
  const res = await request.post("/api/verbs/import", { data: { tense: "present" } });
  expect(res.ok()).toBeTruthy();
  const body = await res.json();
  expect(body.ok).toBe(true);
  expect(body.deckId).toBeTruthy();
  if (!body.alreadyImported) {
    expect(body.cardsCreated).toBe(84);
  }
});

test("import API creates verb deck (preterite)", async ({ request }) => {
  const res = await request.post("/api/verbs/import", { data: { tense: "preterite" } });
  expect(res.ok()).toBeTruthy();
  const body = await res.json();
  expect(body.ok).toBe(true);
  expect(body.tense).toBe("preterite");
  if (!body.alreadyImported) {
    expect(body.cardsCreated).toBe(84);
  }
});

test("verbs preterite tab shows preterite forms", async ({ page }) => {
  await page.goto("/verbs?tense=preterite");
  await expect(page.getByText("fui", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("tuvo", { exact: true })).toBeVisible();
});

test("import API creates verb deck (imperfect)", async ({ request }) => {
  const res = await request.post("/api/verbs/import", { data: { tense: "imperfect" } });
  expect(res.ok()).toBeTruthy();
  const body = await res.json();
  expect(body.ok).toBe(true);
  expect(body.tense).toBe("imperfect");
});

test("verbs imperfect tab shows imperfect forms", async ({ page }) => {
  await page.goto("/verbs?tense=imperfect");
  await expect(page.getByText("era", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("tenía", { exact: true }).first()).toBeVisible();
});

test("home page links to verbs", async ({ page }) => {
  await page.goto("/");
  const link = page.getByRole("link", { name: "Verbs" });
  await expect(link).toBeVisible();
  await link.click();
  await expect(page.getByRole("heading", { name: "Verbs" })).toBeVisible();
});

test("perfecto tab shows haber + participle", async ({ page }) => {
  await page.goto("/verbs?tense=perfect");
  await expect(page.getByRole("link", { name: "Perfecto", exact: true })).toHaveAttribute("aria-current", "page");
  await expect(page.getByText("he hecho", { exact: true })).toBeVisible();
  await expect(page.getByText("habéis ido", { exact: true })).toBeVisible();
});

test("regular group shows vosotros forms", async ({ page }) => {
  await page.goto("/verbs?group=regular&tense=preterite");
  await expect(page.getByRole("columnheader", { name: "vosotros" })).toBeVisible();
  await expect(page.getByText("hablasteis", { exact: true })).toBeVisible();
});

test("import API creates regular perfect deck", async ({ request }) => {
  const res = await request.post("/api/verbs/import", {
    data: { tense: "perfect", group: "regular" },
  });
  expect(res.ok()).toBeTruthy();
  const body = await res.json();
  expect(body.group).toBe("regular");
  expect(body.tense).toBe("perfect");
  if (!body.alreadyImported) {
    expect(body.cardsCreated).toBeGreaterThan(0);
  }
});

test("import API rejects malformed JSON", async ({ request }) => {
  const res = await request.post("/api/verbs/import", {
    headers: { "content-type": "application/json" },
    data: "{bad json",
  });
  expect(res.status()).toBe(400);
});

test("parallel imports create a single complete deck", async ({ request }) => {
  const responses = await Promise.all(
    Array.from({ length: 5 }, () =>
      request.post("/api/verbs/import", { data: { tense: "imperfect", group: "regular" } }),
    ),
  );
  const bodies = await Promise.all(responses.map((r) => r.json()));
  expect(new Set(bodies.map((b) => b.deckId)).size).toBe(1);
  const created = bodies.reduce((sum, b) => sum + b.cardsCreated, 0);
  expect([0, 18 * 6]).toContain(created);
});

test("import API rejects unknown tense", async ({ request }) => {
  const res = await request.post("/api/verbs/import", { data: { tense: "future" } });
  expect(res.status()).toBe(400);
});

const tenseByLabel = Object.fromEntries(
  Object.entries(TENSE_LABELS).map(([t, label]) => [label, t as Tense]),
);

async function expectedForm(page: Page): Promise<string> {
  const infinitive = (await page.getByTestId("drill-prompt").textContent())!.trim();
  const person = (await page.getByTestId("drill-person").textContent())!.trim() as Person;
  const label = (await page.getByTestId("drill-tense").textContent())!.trim();
  return conjugate(infinitive, tenseByLabel[label]!, person);
}

test("drill grades wrong, correct and accent-less answers", async ({ page }) => {
  await page.clock.install();
  await page.goto("/verbs");
  await page.getByRole("link", { name: "Conjugation drill →" }).click();
  await expect(page.getByRole("heading", { name: "Conjugation drill" })).toBeVisible();
  await page.getByRole("button", { name: /^Start/ }).click();
  const input = page.getByLabel("conjugated form");

  await input.fill("zzz");
  await input.press("Enter");
  await expect(page.getByRole("status")).toContainText("✗");
  await expect(page.getByTestId("drill-score")).toHaveText("0 / 1");
  await page.clock.fastForward(1000);
  await page.getByRole("button", { name: "Next", exact: true }).click();

  await input.fill(await expectedForm(page));
  await input.press("Enter");
  await expect(page.getByRole("status")).toHaveText("✓ Correct");
  await expect(page.getByTestId("drill-score")).toHaveText("1 / 2");
  await page.clock.fastForward(1000);
  await input.press("Enter");

  const answer = await expectedForm(page);
  const stripped = answer.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const hasAccent = stripped !== answer;
  await input.fill(stripped);
  await input.press("Enter");
  await expect(page.getByRole("status")).toContainText(hasAccent ? "Almost" : "Correct");
  await expect(page.getByTestId("drill-score")).toHaveText(hasAccent ? "1 / 3" : "2 / 3");
});

test("drill double-tap on Check keeps the correction visible", async ({ page }) => {
  await page.clock.install();
  await page.goto("/verbs/drill");
  await page.getByRole("button", { name: /^Start/ }).click();
  const input = page.getByLabel("conjugated form");
  const prompt = await page.getByTestId("drill-prompt").textContent();

  await input.fill("zzz");
  await input.press("Enter");
  await input.press("Enter");
  await expect(page.getByRole("status")).toContainText("✗");
  await expect(page.getByTestId("drill-prompt")).toHaveText(prompt!);
});

test("drill start is disabled with no tense selected", async ({ page }) => {
  await page.goto("/verbs/drill");
  for (const label of ["Presente", "Indefinido", "Perfecto"]) {
    await page.getByRole("button", { name: label, exact: true }).click();
  }
  await expect(page.getByRole("button", { name: "Pick a tense and a verb group" })).toBeDisabled();
});

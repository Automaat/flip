import { test, expect } from "@playwright/test";

test("/api/reader/analyze returns tokens + familiarity map", async ({ request }) => {
  const res = await request.post("/api/reader/analyze", {
    data: { text: "Hola mundo." },
  });
  expect(res.ok()).toBeTruthy();
  const body = await res.json();
  expect(Array.isArray(body.tokens)).toBe(true);
  const words = body.tokens.filter((t: { word: string | null }) => t.word).map((t: { word: string }) => t.word);
  expect(words).toContain("hola");
  expect(body.familiarity.hola).toMatch(/known|learning|unknown/);
});

test("/api/reader/analyze rejects empty input", async ({ request }) => {
  const res = await request.post("/api/reader/analyze", { data: { text: "" } });
  expect(res.status()).toBe(400);
});

test("/api/reader/add inserts a card", async ({ request }) => {
  const res = await request.post("/api/reader/add", {
    data: { spanish: "manzana", english: "apple", context: "Como una manzana." },
  });
  expect(res.ok()).toBeTruthy();
  const body = await res.json();
  expect(body.ok).toBe(true);
  expect(body.deckId).toBeTruthy();
});

test("reader page analyzes sample and color-codes words", async ({ page }) => {
  await page.goto("/reader");
  await expect(page.getByRole("heading", { name: "Reader" })).toBeVisible();
  await page.getByRole("button", { name: /read/i }).click();
  // After analyze, a rendered <article> with words should appear; legend dot for 'known' visible.
  await expect(page.getByText("known", { exact: true })).toBeVisible();
});

test("home links to Reader", async ({ page }) => {
  await page.goto("/");
  const link = page.getByRole("link", { name: "Reader" });
  await expect(link).toBeVisible();
  await link.click();
  await expect(page.getByRole("heading", { name: "Reader" })).toBeVisible();
});

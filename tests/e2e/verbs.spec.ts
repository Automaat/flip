import { test, expect } from "@playwright/test";

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
    expect(body.cardsCreated).toBe(70);
  }
});

test("import API creates verb deck (preterite)", async ({ request }) => {
  const res = await request.post("/api/verbs/import", { data: { tense: "preterite" } });
  expect(res.ok()).toBeTruthy();
  const body = await res.json();
  expect(body.ok).toBe(true);
  expect(body.tense).toBe("preterite");
  if (!body.alreadyImported) {
    expect(body.cardsCreated).toBe(70);
  }
});

test("verbs preterite tab shows preterite forms", async ({ page }) => {
  await page.goto("/verbs?tense=preterite");
  await expect(page.getByText("fui", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("tuvo", { exact: true })).toBeVisible();
});

test("home page links to verbs", async ({ page }) => {
  await page.goto("/");
  const link = page.getByRole("link", { name: "Verbs" });
  await expect(link).toBeVisible();
  await link.click();
  await expect(page.getByRole("heading", { name: "Verbs" })).toBeVisible();
});

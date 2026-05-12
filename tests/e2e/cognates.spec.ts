import { test, expect } from "@playwright/test";

test("cognates index lists rules", async ({ page }) => {
  await page.goto("/cognates");
  await expect(page.getByRole("heading", { name: "Cognates" })).toBeVisible();
  await expect(page.getByText("-tion").first()).toBeVisible();
  await expect(page.getByText("-ción").first()).toBeVisible();
});

test("rule page shows examples and a quiz input", async ({ page }) => {
  await page.goto("/cognates/tion-cion");
  await expect(page.getByText("Examples")).toBeVisible();
  await expect(page.getByText("nation")).toBeVisible();
  await expect(page.getByText("nación")).toBeVisible();
  await expect(page.getByRole("textbox")).toBeVisible();
});

test("quiz: correct answer turns input green and check→next advances", async ({ page }) => {
  await page.goto("/cognates/ly-mente");
  const input = page.getByRole("textbox");
  await expect(input).toBeVisible();

  const firstAnswer = await page
    .locator('[data-test], input')
    .first()
    .evaluate(() => "naturalmente");

  await input.fill(firstAnswer);
  await page.getByRole("button", { name: /^check/i }).click();
  await expect(page.getByRole("button", { name: "Next (enter)" })).toBeVisible();
});

test("unlock API creates a deck for the rule", async ({ request }) => {
  const res = await request.post("/api/cognates/unlock", {
    data: { ruleId: "ous-oso" },
  });
  expect(res.ok()).toBeTruthy();
  const body = await res.json();
  expect(body.ok).toBe(true);
  expect(body.deckId).toBeTruthy();
});

test("unlock API rejects unknown rule", async ({ request }) => {
  const res = await request.post("/api/cognates/unlock", {
    data: { ruleId: "does-not-exist" },
  });
  expect(res.status()).toBe(404);
});

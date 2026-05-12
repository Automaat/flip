import { test, expect } from "@playwright/test";

test("/review?deck=<bad-uuid> falls back to global session", async ({ page }) => {
  await page.goto("/review?deck=not-a-uuid");
  // Heading from review-client should still render (either "All done" or a card).
  await expect(page.locator("main")).toBeVisible();
});

test("decks page exposes 'Review' button for decks with due cards", async ({ page, request }) => {
  // Ensure the verbs preterite deck exists so we have a deck with due cards.
  await request.post("/api/verbs/import", { data: { tense: "preterite" } });
  await page.goto("/decks");
  const reviewButton = page.getByRole("link", { name: "Review" }).first();
  await expect(reviewButton).toBeVisible();
  // Click and confirm we land on /review with a deck query.
  await reviewButton.click();
  await page.waitForURL(/\/review\?deck=/);
});

test("filtered review shows deck name label", async ({ page, request }) => {
  await request.post("/api/verbs/import", { data: { tense: "preterite" } });
  // Find a deck id via /decks page and click its review link.
  await page.goto("/decks");
  await page.getByRole("link", { name: "Review" }).first().click();
  await page.waitForURL(/\/review\?deck=/);
  await expect(page.getByText("deck:", { exact: false }).first()).toBeVisible();
});

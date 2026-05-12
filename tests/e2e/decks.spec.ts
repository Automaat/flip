import { test, expect } from "@playwright/test";

test("decks page lists at least one deck or shows empty hint", async ({ page }) => {
  await page.goto("/decks");
  await expect(page.getByRole("heading", { name: "Decks" })).toBeVisible();
  // Either deck rows OR the empty-state hint.
  const totalText = page.getByText(/cards total/);
  await expect(totalText).toBeVisible();
});

test("decks page shows seeded 'Top 20 Spanish' deck", async ({ page }) => {
  await page.goto("/decks");
  // Seed creates this deck in CI's e2e setup.
  await expect(page.getByText("Top 20 Spanish")).toBeVisible();
  // Stat labels visible
  await expect(page.getByText("total", { exact: true }).first()).toBeVisible();
});

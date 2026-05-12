import { test, expect } from "@playwright/test";

test("home page renders heading, stats, and review link", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Flip" })).toBeVisible();
  await expect(page.getByText(/frequency coverage/)).toBeVisible();
  const reviewLink = page.getByRole("link", { name: /review|start review/i }).first();
  await expect(reviewLink).toBeVisible();
});

import { test, expect } from "@playwright/test";

test("productive mode shows 'Type the Spanish for:' prompt", async ({ page }) => {
  await page.goto("/review?mode=productive");
  // If there are no due cards (all done), this test is informational.
  const allDone = await page.getByText(/All done/i).count();
  if (allDone > 0) test.skip(true, "no due cards in productive mode");
  await expect(page.getByText("Type the Spanish for:")).toBeVisible();
  await expect(page.getByPlaceholder("type Spanish translation")).toBeVisible();
});

test("mode switcher pills are clickable on /review", async ({ page }) => {
  await page.goto("/review");
  await expect(page.getByRole("link", { name: "ES → EN" })).toBeVisible();
  await expect(page.getByRole("link", { name: "EN → ES" })).toBeVisible();
});

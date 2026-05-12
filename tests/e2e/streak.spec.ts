import { test, expect } from "@playwright/test";

test("home shows streak flame + day count", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByLabel("streak")).toBeVisible();
  await expect(page.getByText(/day(s)?/).first()).toBeVisible();
});

import { test, expect } from "@playwright/test";

test("pronounce page renders + home links to it", async ({ page }) => {
  await page.goto("/");
  const link = page.getByRole("link", { name: "Pronounce" });
  await expect(link).toBeVisible();
  await link.click();
  await expect(page.getByRole("heading", { name: "Pronounce" })).toBeVisible();
  // Either a record button (supported in chromium) or "Unsupported".
  const button = page.getByRole("button", { name: /record|unsupported/i });
  await expect(button).toBeVisible();
});

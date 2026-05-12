import { test, expect } from "@playwright/test";

test("translate page renders English prompt + input", async ({ page }) => {
  await page.goto("/translate");
  await expect(page.getByRole("heading", { name: "Translate" })).toBeVisible();
});

test("home links to Translate", async ({ page }) => {
  await page.goto("/");
  const link = page.getByRole("link", { name: "Translate" });
  await expect(link).toBeVisible();
  await link.click();
  await expect(page.getByRole("heading", { name: "Translate" })).toBeVisible();
});

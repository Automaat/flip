import { test, expect } from "@playwright/test";

test("stats page renders headline + key sections", async ({ page }) => {
  await page.goto("/stats");
  await expect(page.getByRole("heading", { name: "Stats" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "30-day activity" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Cards by state" })).toBeVisible();
  // Stat labels visible
  await expect(page.getByText("streak", { exact: true })).toBeVisible();
  await expect(page.getByText("accuracy", { exact: true })).toBeVisible();
});

test("home links to Stats", async ({ page }) => {
  await page.goto("/");
  const link = page.getByRole("link", { name: "Stats" });
  await expect(link).toBeVisible();
  await link.click();
  await expect(page.getByRole("heading", { name: "Stats" })).toBeVisible();
});

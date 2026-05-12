import { test, expect } from "@playwright/test";

test("leeches page renders heading + threshold links", async ({ page }) => {
  await page.goto("/leeches");
  await expect(page.getByRole("heading", { name: "Leeches" })).toBeVisible();
  // Threshold links 4/6/8/12
  for (const t of ["≥ 4", "≥ 6", "≥ 8", "≥ 12"]) {
    await expect(page.getByRole("link", { name: t })).toBeVisible();
  }
});

test("leeches page accepts ?n= override", async ({ page }) => {
  await page.goto("/leeches?n=2");
  await expect(page.getByText(/failed 2\+/)).toBeVisible();
});

test("leeches page falls back to default on bad ?n=", async ({ page }) => {
  await page.goto("/leeches?n=garbage");
  await expect(page.getByText(/failed 8\+/)).toBeVisible();
});

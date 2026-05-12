import { test, expect } from "@playwright/test";

test("home shows frequency coverage header", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("frequency coverage")).toBeVisible();
});

test("when vocab is imported, band labels appear", async ({ page, request }) => {
  const v = await request.get("/api/health"); // smoke
  expect(v.ok()).toBeTruthy();
  await page.goto("/");
  const coverageLabel = page.getByText("frequency coverage");
  await expect(coverageLabel).toBeVisible();
  // Only assert band start labels if the page actually rendered them
  // (e.g. import-vocab has populated the table).
  const has1 = await page.getByText("1", { exact: true }).first().count();
  if (has1 === 0) test.skip(true, "vocabulary table empty — run pnpm db:import-vocab");
  for (const label of ["1", "1001"]) {
    await expect(page.getByText(label, { exact: true }).first()).toBeVisible();
  }
});

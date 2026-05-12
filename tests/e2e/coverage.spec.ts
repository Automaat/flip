import { test, expect } from "@playwright/test";

test("home shows frequency coverage with band bars", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("frequency coverage")).toBeVisible();
  // 5 bands (1-5000) → 5 starting labels: 1, 1001, 2001, 3001, 4001
  const startLabels = ["1", "1001", "2001", "3001", "4001"];
  for (const label of startLabels) {
    await expect(page.getByText(label, { exact: true }).first()).toBeVisible();
  }
});

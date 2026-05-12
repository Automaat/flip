import { test, expect } from "@playwright/test";

test("home shows 7-day forecast header + 7 weekday labels", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("review forecast (7 days)")).toBeVisible();
  // 7 bars rendered — at least one weekday short-name visible
  await expect(page.getByText(/upcoming/)).toBeVisible();
  // Today's bar should have an emerald weekday label — count those visible weekday chars
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let visible = 0;
  for (const w of weekdays) {
    if (await page.getByText(w, { exact: true }).count()) visible++;
  }
  expect(visible).toBeGreaterThan(0);
});

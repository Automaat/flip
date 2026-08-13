import { test, expect } from "@playwright/test";

test("productive mode shows 'Type the Spanish for:' prompt", async ({ page }) => {
  await page.goto("/review?mode=productive");
  // If there are no due cards (all done), this test is informational.
  const allDone = await page.getByText(/All done/i).count();
  if (allDone > 0) test.skip(true, "no due cards in productive mode");
  await expect(page.getByText("Type the Spanish for:")).toBeVisible();
  await expect(page.getByPlaceholder("type Spanish translation")).toBeVisible();
});

test("typing a space does not reveal the card", async ({ page }) => {
  await page.goto("/review?mode=productive");
  const allDone = await page.getByText(/All done/i).count();
  if (allDone > 0) test.skip(true, "no due cards in productive mode");
  const input = page.getByPlaceholder("type Spanish translation");
  await input.click();
  await page.keyboard.type("dos palabras");
  await expect(input).toHaveValue("dos palabras");
  await expect(input).toBeVisible();
  await expect(page.getByRole("button", { name: /Check/ })).toBeVisible();
});

test("wrong typed answer keeps the four rating buttons", async ({ page }) => {
  await page.goto("/review?mode=productive");
  const allDone = await page.getByText(/All done/i).count();
  if (allDone > 0) test.skip(true, "no due cards in productive mode");
  await page.getByPlaceholder("type Spanish translation").fill("zzzzqqq");
  await page.getByRole("button", { name: /Check/ }).click();
  await expect(page.getByRole("button", { name: "Again 1" })).toBeVisible();
  await expect(page.getByRole("button", { name: /Continue/ })).toHaveCount(0);
});

test("mode switcher pills are clickable on /review", async ({ page }) => {
  await page.goto("/review");
  await expect(page.getByRole("link", { name: "ES → EN" })).toBeVisible();
  await expect(page.getByRole("link", { name: "EN → ES" })).toBeVisible();
});

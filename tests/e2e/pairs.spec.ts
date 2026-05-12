import { test, expect } from "@playwright/test";

test("pairs API returns a playable item", async ({ request }) => {
  const res = await request.get("/api/pairs/next");
  expect(res.ok()).toBeTruthy();
  const body = await res.json();
  expect(body.audioUrl.startsWith("/audio/")).toBe(true);
  expect(["a", "b"]).toContain(body.correct);
  expect(body.a.spanish).toBeTruthy();
  expect(body.b.spanish).toBeTruthy();
});

test("pairs page renders 2 word choices + replay button", async ({ page }) => {
  await page.goto("/pairs");
  await expect(page.getByRole("heading", { name: "Minimal Pairs" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Replay" })).toBeVisible();
  const buttons = page.locator("button:has(div.font-semibold)");
  await expect(buttons).toHaveCount(2);
});

test("clicking a choice reveals correctness + Next button", async ({ page }) => {
  await page.goto("/pairs");
  const buttons = page.locator("button:has(div.font-semibold)");
  await buttons.first().click();
  await expect(page.getByRole("button", { name: "Next", exact: true })).toBeVisible();
});

test("home links to Pairs", async ({ page }) => {
  await page.goto("/");
  const link = page.getByRole("link", { name: "Pairs" });
  await expect(link).toBeVisible();
  await link.click();
  await expect(page.getByRole("heading", { name: "Minimal Pairs" })).toBeVisible();
});

import { test, expect } from "@playwright/test";

test("etymology page renders root families", async ({ page }) => {
  await page.goto("/etymology");
  await expect(page.getByRole("heading", { name: "Etymology" })).toBeVisible();
  await expect(page.getByText("aqua", { exact: false }).first()).toBeVisible();
  await expect(page.getByText("water", { exact: false }).first()).toBeVisible();
  await expect(page.getByText("agua", { exact: false }).first()).toBeVisible();
});

test("home links to Etymology", async ({ page }) => {
  await page.goto("/");
  const link = page.getByRole("link", { name: "Etymology" });
  await expect(link).toBeVisible();
  await link.click();
  await expect(page.getByRole("heading", { name: "Etymology" })).toBeVisible();
});

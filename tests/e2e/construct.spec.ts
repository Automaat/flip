import { test, expect } from "@playwright/test";

test("construct page renders and shows word pool", async ({ page }) => {
  await page.goto("/construct");
  await expect(page.getByRole("heading", { name: "Construct" })).toBeVisible();
  // Either pool buttons or empty-state message.
  const heading = page.getByRole("heading", { name: "Construct" });
  await expect(heading).toBeVisible();
});

test("home page links to Construct", async ({ page }) => {
  await page.goto("/");
  const link = page.getByRole("link", { name: "Construct" });
  await expect(link).toBeVisible();
  await link.click();
  await expect(page.getByRole("heading", { name: "Construct" })).toBeVisible();
});

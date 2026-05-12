import { test, expect } from "@playwright/test";

test("gender page lists rules and exceptions", async ({ page }) => {
  await page.goto("/gender");
  await expect(page.getByRole("heading", { name: "Gender" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Rules" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Exceptions" })).toBeVisible();
  await expect(page.getByText("problema", { exact: false }).first()).toBeVisible();
});

test("import API creates Gender Exceptions deck", async ({ request }) => {
  const res = await request.post("/api/gender/import");
  expect(res.ok()).toBeTruthy();
  const body = await res.json();
  expect(body.ok).toBe(true);
  expect(body.deckId).toBeTruthy();
});

test("home links to Gender", async ({ page }) => {
  await page.goto("/");
  const link = page.getByRole("link", { name: "Gender" });
  await expect(link).toBeVisible();
  await link.click();
  await expect(page.getByRole("heading", { name: "Gender" })).toBeVisible();
});

import { test, expect } from "@playwright/test";

test("false-friends page renders entries", async ({ page }) => {
  await page.goto("/false-friends");
  await expect(page.getByRole("heading", { name: "False Friends" })).toBeVisible();
  await expect(page.getByText("embarazada", { exact: false }).first()).toBeVisible();
  await expect(page.getByText("pregnant", { exact: false }).first()).toBeVisible();
});

test("import API creates deck + cards", async ({ request }) => {
  const res = await request.post("/api/false-friends/import");
  expect(res.ok()).toBeTruthy();
  const body = await res.json();
  expect(body.ok).toBe(true);
  expect(body.deckId).toBeTruthy();
  if (!body.alreadyImported) {
    expect(body.cardsCreated).toBeGreaterThan(0);
  }
});

test("home page links to false-friends", async ({ page }) => {
  await page.goto("/");
  const link = page.getByRole("link", { name: "False friends" });
  await expect(link).toBeVisible();
  await link.click();
  await expect(page.getByRole("heading", { name: "False Friends" })).toBeVisible();
});

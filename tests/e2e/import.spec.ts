import { test, expect } from "@playwright/test";

test("/api/content/fetch rejects malformed URL", async ({ request }) => {
  const res = await request.post("/api/content/fetch", { data: { url: "not-a-url" } });
  expect(res.status()).toBe(400);
});

test("import page renders + home links to it", async ({ page }) => {
  await page.goto("/");
  const link = page.getByRole("link", { name: "Import" });
  await expect(link).toBeVisible();
  await link.click();
  await expect(page.getByRole("heading", { name: "Import" })).toBeVisible();
  await expect(page.getByRole("button", { name: /^fetch$/i })).toBeVisible();
});

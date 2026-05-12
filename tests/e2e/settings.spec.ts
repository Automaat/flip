import { test, expect } from "@playwright/test";

test("/api/settings GET returns defaults", async ({ request }) => {
  const res = await request.get("/api/settings");
  expect(res.ok()).toBeTruthy();
  const body = await res.json();
  expect(typeof body.newCardsPerDay).toBe("number");
  expect(typeof body.retention).toBe("number");
  expect(body.region).toMatch(/^(latam|spain)$/);
});

test("/api/settings PUT updates values", async ({ request }) => {
  const r1 = await request.put("/api/settings", {
    data: { newCardsPerDay: 30, region: "spain", voiceId: "es-ES-ElviraNeural" },
  });
  expect(r1.ok()).toBeTruthy();
  const body = await r1.json();
  expect(body.newCardsPerDay).toBe(30);
  expect(body.region).toBe("spain");

  // Restore defaults so other tests aren't affected.
  await request.put("/api/settings", {
    data: { newCardsPerDay: 20, region: "latam", voiceId: "es-MX-DaliaNeural" },
  });
});

test("/api/settings rejects invalid values", async ({ request }) => {
  const res = await request.put("/api/settings", {
    data: { newCardsPerDay: -1, retention: 2 },
  });
  expect(res.status()).toBe(400);
});

test("settings page renders the form and home links to it", async ({ page }) => {
  await page.goto("/");
  const link = page.getByRole("link", { name: "Settings" });
  await expect(link).toBeVisible();
  await link.click();
  await expect(page.getByRole("heading", { name: "Settings" })).toBeVisible();
  await expect(page.getByRole("button", { name: /save/i })).toBeVisible();
});

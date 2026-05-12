import { test, expect } from "@playwright/test";

test("/api/tutor/chat requires ANTHROPIC_API_KEY", async ({ request }) => {
  const res = await request.post("/api/tutor/chat", {
    data: {
      level: "A1",
      messages: [{ role: "user", content: "Hola" }],
    },
  });
  expect([200, 503]).toContain(res.status());
});

test("/api/tutor/chat rejects malformed input", async ({ request }) => {
  const res = await request.post("/api/tutor/chat", { data: { messages: [] } });
  expect(res.status()).toBe(400);
});

test("tutor page renders + home links to it", async ({ page }) => {
  await page.goto("/");
  const link = page.getByRole("link", { name: "Tutor" });
  await expect(link).toBeVisible();
  await link.click();
  await expect(page.getByRole("heading", { name: "Tutor" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Send" })).toBeVisible();
});

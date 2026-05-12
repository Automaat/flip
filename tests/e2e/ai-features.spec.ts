import { test, expect } from "@playwright/test";

test.describe("AI endpoints gate on ANTHROPIC_API_KEY", () => {
  test("/api/stories/generate", async ({ request }) => {
    const res = await request.post("/api/stories/generate", {
      data: { topic: "a walk", level: "A1" },
    });
    expect([200, 503]).toContain(res.status());
  });

  test("/api/write/evaluate", async ({ request }) => {
    const res = await request.post("/api/write/evaluate", {
      data: { text: "Yo soy de México.", level: "A1" },
    });
    expect([200, 503]).toContain(res.status());
  });

  test("/api/examples", async ({ request }) => {
    const res = await request.post("/api/examples", {
      data: { spanish: "perro", level: "A1" },
    });
    expect([200, 503]).toContain(res.status());
  });
});

test("home links to /stories and /write", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("link", { name: "Stories" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Write" })).toBeVisible();
});

test("stories page renders", async ({ page }) => {
  await page.goto("/stories");
  await expect(page.getByRole("heading", { name: "Stories" })).toBeVisible();
  await expect(page.getByRole("button", { name: /generate/i })).toBeVisible();
});

test("write page renders", async ({ page }) => {
  await page.goto("/write");
  await expect(page.getByRole("heading", { name: "Write" })).toBeVisible();
  await expect(page.getByRole("button", { name: /get feedback/i })).toBeVisible();
});

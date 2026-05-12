import { test, expect } from "@playwright/test";

test("/api/dictate/next returns 200 (item may be null when no audio yet)", async ({ request }) => {
  const res = await request.get("/api/dictate/next");
  expect(res.ok()).toBeTruthy();
  const body = await res.json();
  if (body.item) {
    expect(body.item.audioUrl.startsWith("/audio/")).toBe(true);
    expect(body.item.expected.length).toBeGreaterThan(0);
  }
});

test("dictate page renders, accepts input, scores answer", async ({ page, request }) => {
  // Get an expected answer via the API so we can type the correct sentence.
  const res = await request.get("/api/dictate/next");
  const body = await res.json();
  test.skip(!body.item, "no audio notes yet");

  await page.goto("/dictate");
  const input = page.getByPlaceholder("type what you hear");
  await expect(input).toBeVisible();
  await input.fill(body.item.expected);
  await page.getByRole("button", { name: /^check/i }).click();
  await expect(page.getByText(/expected/).first()).toBeVisible();
  await expect(page.getByRole("button", { name: "Next", exact: true })).toBeVisible();
});

test("home page links to dictate", async ({ page }) => {
  await page.goto("/");
  const link = page.getByRole("link", { name: "Dictate" });
  await expect(link).toBeVisible();
  await link.click();
  await expect(page.getByRole("heading", { name: "Dictation" })).toBeVisible();
});

import { test, expect, type APIRequestContext } from "@playwright/test";

async function fetchCardId(request: APIRequestContext): Promise<string | null> {
  const res = await request.get("/api/review/next");
  expect(res.ok()).toBeTruthy();
  const data = await res.json();
  return data.card?.id ?? null;
}

test("review API serves a card and accepts a rating", async ({ request }) => {
  const id = await fetchCardId(request);
  if (!id) test.skip(true, "no due cards");
  const res = await request.post("/api/review/rate", {
    data: { cardId: id!, rating: "good", durationMs: 1234 },
  });
  expect(res.ok()).toBeTruthy();
  const body = await res.json();
  expect(body.ok).toBe(true);
  expect(["new", "learning", "review", "relearning"]).toContain(body.state);
});

test("review API rejects invalid rating", async ({ request }) => {
  const id = await fetchCardId(request);
  if (!id) test.skip(true, "no due cards");
  const res = await request.post("/api/review/rate", {
    data: { cardId: id!, rating: "bogus", durationMs: 1 },
  });
  expect(res.status()).toBe(400);
});

test("review page lets user reveal and rate", async ({ page, request }) => {
  const id = await fetchCardId(request);
  if (!id) test.skip(true, "no due cards");
  await page.goto("/review");
  const reveal = page.getByRole("button", { name: /reveal/i });
  await expect(reveal).toBeVisible();
  await reveal.click();
  await page.getByRole("button", { name: "Good" }).click();
  await expect(page.getByText(/state|new|learning|review|All done/i).first()).toBeVisible();
});

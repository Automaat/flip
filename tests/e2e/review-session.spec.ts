import { test, expect, type APIRequestContext, type Page } from "@playwright/test";

async function hasDueCard(request: APIRequestContext): Promise<boolean> {
  const res = await request.get("/api/review/next");
  expect(res.ok()).toBeTruthy();
  return Boolean((await res.json()).card);
}

async function rateGood(page: Page) {
  await page.getByRole("button", { name: /reveal/i }).click();
  await page.getByRole("button", { name: "Good" }).click();
  const done = page.getByRole("button", { name: "Done" });
  const nextReveal = page.getByRole("button", { name: /reveal/i });
  const allDone = page.getByRole("heading", { name: "All done" });
  await expect(done.or(nextReveal).or(allDone)).toBeVisible();
  if (await done.isVisible()) await done.click();
  await expect(nextReveal.or(allDone)).toBeVisible();
}

test("review stamps a session start in the URL", async ({ page }) => {
  await page.goto("/review?mode=receptive");
  await expect(page).toHaveURL(/[?&]since=/);
});

test("end session after two cards shows a saved summary", async ({ page, request }) => {
  test.skip(!(await hasDueCard(request)), "no due cards");
  await page.goto("/review");
  await rateGood(page);
  if (await page.getByRole("heading", { name: "All done" }).isVisible()) {
    await page.getByRole("link", { name: "See session summary" }).click();
    await expect(page.getByTestId("summary-cards")).toHaveText("1");
    return;
  }
  await rateGood(page);

  const end = page.getByRole("link", { name: "End session" }).or(
    page.getByRole("link", { name: "See session summary" }),
  );
  await end.click();
  await expect(page.getByRole("heading", { name: "Session saved" })).toBeVisible();
  await expect(page.getByTestId("summary-cards")).toHaveText("2");
  await expect(page.getByRole("list", { name: "words" }).getByRole("listitem")).toHaveCount(2);
  await expect(page.getByText(/back (later today|tomorrow|in a few days)/).first()).toBeVisible();

  await page.getByRole("link", { name: "Continue practising" }).click();
  await expect(page).toHaveURL(/\/review\?/);
  await expect(page).not.toHaveURL(/summary/);
});

test("ending a session before rating anything shows an empty summary", async ({ page }) => {
  await page.goto("/review");
  await expect(page).toHaveURL(/since=/);
  const end = page.getByRole("link", { name: "End session" }).or(
    page.getByRole("link", { name: "See session summary" }),
  );
  await end.click();
  await expect(page.getByTestId("summary-empty")).toBeVisible();
});

test("summary without a session start is empty, not an error", async ({ page }) => {
  await page.goto("/review/summary?since=garbage");
  await expect(page.getByRole("heading", { name: "Session saved" })).toBeVisible();
  await expect(page.getByTestId("summary-empty")).toBeVisible();
});

test("mode switch keeps the session start", async ({ page, request }) => {
  test.skip(!(await hasDueCard(request)), "no due cards");
  await page.goto("/review");
  await expect(page).toHaveURL(/since=/);
  const since = new URL(page.url()).searchParams.get("since");
  await page.getByRole("link", { name: "EN → ES" }).click();
  await expect(page).toHaveURL(/mode=productive/);
  expect(new URL(page.url()).searchParams.get("since")).toBe(since);
});

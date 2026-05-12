import { test, expect } from "@playwright/test";

test("pronounce page renders + home links to it", async ({ page }) => {
  await page.goto("/");
  const link = page.getByRole("link", { name: "Pronounce" });
  await expect(link).toBeVisible();
  await link.click();
  await expect(page.getByRole("heading", { name: "Pronounce" })).toBeVisible();
  // Either a record button (audio notes exist) or the empty-state hint
  // (CI doesn't run audio:gen, so notes have no audio.example).
  const button = page.getByRole("button", { name: /record|unsupported/i });
  const emptyHint = page.getByText(/no audio sentences/i);
  await expect(button.or(emptyHint)).toBeVisible();
});

import { test, expect } from "@playwright/test";

test("manifest.webmanifest serves valid JSON with required keys", async ({ request }) => {
  const res = await request.get("/manifest.webmanifest");
  expect(res.ok()).toBeTruthy();
  const m = await res.json();
  expect(m.name).toContain("Flip");
  expect(m.short_name).toBe("Flip");
  expect(m.start_url).toBe("/");
  expect(m.display).toBe("standalone");
  expect(Array.isArray(m.icons)).toBe(true);
  expect(m.icons.length).toBeGreaterThanOrEqual(4);
  const purposes = new Set(m.icons.map((i: { purpose?: string }) => i.purpose));
  expect(purposes.has("maskable")).toBe(true);
  expect(Array.isArray(m.shortcuts)).toBe(true);
});

test("service worker only caches build-immutable assets", async ({ request }) => {
  const res = await request.get("/sw.js");
  expect(res.ok()).toBeTruthy();
  const src = await res.text();
  expect(src).toContain("networkFirst");
  // cacheFirst must be reachable only through the static-asset check, so RSC
  // payloads cannot be replayed from cache.
  expect(src).toMatch(/if \(isStaticAsset\(url\)\) \{\s*event\.respondWith\(cacheFirst\(req\)\);/);
  expect(src).toContain("/_next/static/");
});

test.describe("PWA icons", () => {
  for (const file of [
    "/icon-192.png",
    "/icon-512.png",
    "/icon-maskable-192.png",
    "/icon-maskable-512.png",
    "/apple-touch-icon.png",
    "/icon.svg",
  ]) {
    test(`${file} responds 200 with image content-type`, async ({ request }) => {
      const res = await request.get(file);
      expect(res.ok()).toBeTruthy();
      const ct = res.headers()["content-type"] ?? "";
      expect(ct.startsWith("image/")).toBe(true);
    });
  }
});

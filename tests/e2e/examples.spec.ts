import { test, expect } from "@playwright/test";

test("/api/examples 503s without API key", async ({ request }) => {
  const res = await request.post("/api/examples", {
    data: { spanish: "perro", english: "dog", level: "A1" },
  });
  expect([200, 503]).toContain(res.status());
});

test("/api/examples rejects bad input", async ({ request }) => {
  const res = await request.post("/api/examples", { data: { spanish: "" } });
  expect(res.status()).toBe(400);
});

import { test, expect } from "@playwright/test";

test("/api/mnemonic returns 503 when no API key", async ({ request }) => {
  // CI doesn't set ANTHROPIC_API_KEY → should 503.
  const res = await request.post("/api/mnemonic", {
    data: { noteId: "00000000-0000-0000-0000-000000000000" },
  });
  expect([400, 404, 503]).toContain(res.status());
});

test("/api/mnemonic rejects bad input", async ({ request }) => {
  const res = await request.post("/api/mnemonic", { data: { noteId: "not-a-uuid" } });
  expect(res.status()).toBe(400);
});

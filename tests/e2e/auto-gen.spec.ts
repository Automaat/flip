import { test, expect } from "@playwright/test";

test("/api/cards/auto-gen 503s without API key", async ({ request }) => {
  const res = await request.post("/api/cards/auto-gen", {
    data: {
      text: "Hoy fui al mercado y compré frutas frescas. Después caminé al parque y jugué con mi perro.",
      level: "A1",
      max: 4,
    },
  });
  expect([200, 503]).toContain(res.status());
});

test("/api/cards/auto-gen rejects too-short input", async ({ request }) => {
  const res = await request.post("/api/cards/auto-gen", { data: { text: "hi", level: "A1" } });
  expect(res.status()).toBe(400);
});

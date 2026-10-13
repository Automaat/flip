import { randomUUID } from "node:crypto";
import { test, expect } from "@playwright/test";
import { eq } from "drizzle-orm";
import { db } from "../../src/db/client";
import { cards, decks, notes, reviewLog } from "../../src/db/schema";

const examples = [
  { spanish: "el año", gender: "m", shown: "el año", article: "el", answer: "año", correct: true },
  { spanish: "la cabeza", gender: "f", shown: "la cabeza", article: "la", answer: "cabeza", correct: true },
  { spanish: "los zapatos", gender: "m", shown: "los zapatos", article: "los", answer: "zapatos", correct: true },
  { spanish: "las gafas", gender: "f", shown: "las gafas", article: "las", answer: "las gafas", correct: true },
  { spanish: "el agua", gender: "f", shown: "el agua", article: "el", answer: "agua", correct: true },
  { spanish: "el aula", gender: "f", shown: "el aula", article: "el", answer: "el aula", correct: true },
  { spanish: "agua", gender: "f", shown: "el agua", article: "el", answer: "el agua", correct: true },
  { spanish: "las gafas", gender: "f", shown: "las gafas", article: "las", answer: "la gafas", correct: false },
  { spanish: "el año", gender: "m", shown: "el año", article: "el", answer: "ano", correct: false },
  { spanish: "el año pasado", shown: "el año pasado", answer: "año pasado", correct: false },
  { spanish: "la semana va bien", shown: "la semana va bien", answer: "semana va bien", correct: false },
  { spanish: "una vez", shown: "una vez", answer: "vez", correct: false },
] as const;

for (const [index, example] of examples.entries()) {
  test(`vocabulary review ${index + 1}: ${example.spanish} / ${example.answer}`, async ({ page }) => {
    const deckId = randomUUID();
    const noteId = randomUUID();
    const cardId = randomUUID();
    await db.transaction(async (tx) => {
      await tx.insert(decks).values({ id: deckId, name: `Vocabulary regression ${deckId}` });
      await tx.insert(notes).values({
        id: noteId, noteType: "vocab",
        fields: { spanish: example.spanish, english: "fixture translation", ...("gender" in example ? { gender: example.gender } : {}) },
      });
      await tx.insert(cards).values({
        id: cardId, noteId, deckId, state: "review", reps: 2,
        due: new Date("2000-01-01T00:00:00Z"), stability: 2, difficulty: 5,
      });
    });
    try {
      const before = await db.select().from(cards).where(eq(cards.id, cardId));
      await page.goto(`/review?deck=${deckId}`);
      const word = page.locator(".text-5xl");
      await expect(word).toHaveText(example.shown);
      if ("article" in example) {
        const article = word.locator("span");
        await expect(article).toHaveText(`${example.article} `);
        await expect(article).toHaveClass(example.gender === "m" ? "text-sky-500" : "text-rose-500");
      }
      await page.getByRole("link", { name: "EN → ES" }).click();
      await page.getByPlaceholder("type Spanish translation").fill(example.answer);
      await page.getByRole("button", { name: "Check (enter)" }).click();
      await expect(word).toHaveText(example.shown);
      await expect(page.getByText(`${example.correct ? "✓" : "✗"} you typed: ${example.answer}`, { exact: true })).toBeVisible();
      expect(await db.select().from(cards).where(eq(cards.id, cardId))).toEqual(before);
      expect(await db.select().from(reviewLog).where(eq(reviewLog.cardId, cardId))).toHaveLength(0);
      await page.getByRole("button", { name: "Continue (enter)" }).click();
      await expect(page.getByRole("heading", { name: "All done" })).toBeVisible();
      const logs = await db.select().from(reviewLog).where(eq(reviewLog.cardId, cardId));
      expect(logs).toHaveLength(1);
      expect(logs[0]!.rating).toBe(example.correct ? "good" : "again");
    } finally {
      await db.delete(notes).where(eq(notes.id, noteId));
      await db.delete(decks).where(eq(decks.id, deckId));
    }
  });
}

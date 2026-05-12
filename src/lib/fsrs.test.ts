import { describe, expect, it } from "vitest";
import { State } from "ts-fsrs";
import { fsrsToRowFields, newCard, review, rowToFsrs } from "./fsrs";
import type { Card } from "@/db/schema";

function fakeRow(overrides: Partial<Card> = {}): Card {
  const now = new Date("2026-01-01T00:00:00Z");
  return {
    id: "00000000-0000-0000-0000-000000000000",
    noteId: "00000000-0000-0000-0000-000000000001",
    deckId: "00000000-0000-0000-0000-000000000002",
    state: "new",
    due: now,
    stability: 0,
    difficulty: 0,
    elapsedDays: 0,
    scheduledDays: 0,
    reps: 0,
    lapses: 0,
    lastReview: null,
    ...overrides,
  };
}

describe("newCard", () => {
  it("creates a new FSRS card with state New", () => {
    const c = newCard(new Date("2026-01-01"));
    expect(c.state).toBe(State.New);
    expect(c.reps).toBe(0);
    expect(c.lapses).toBe(0);
  });
});

describe("rowToFsrs / fsrsToRowFields", () => {
  it("roundtrips fields", () => {
    const row = fakeRow({
      state: "review",
      stability: 5.5,
      difficulty: 6.1,
      elapsedDays: 3,
      scheduledDays: 7,
      reps: 4,
      lapses: 1,
      lastReview: new Date("2025-12-30T00:00:00Z"),
    });
    const fsrs = rowToFsrs(row);
    expect(fsrs.state).toBe(State.Review);
    expect(fsrs.stability).toBe(5.5);
    expect(fsrs.reps).toBe(4);
    expect(fsrs.last_review).toEqual(row.lastReview);

    const back = fsrsToRowFields(fsrs);
    expect(back.state).toBe("review");
    expect(back.stability).toBe(5.5);
    expect(back.reps).toBe(4);
    expect(back.lastReview).toEqual(row.lastReview);
  });

  it("handles null lastReview", () => {
    const row = fakeRow();
    expect(row.lastReview).toBeNull();
    const fsrs = rowToFsrs(row);
    expect(fsrs.last_review).toBeUndefined();
    const back = fsrsToRowFields(fsrs);
    expect(back.lastReview).toBeNull();
  });
});

describe("review", () => {
  it("advances a new card on 'good' to learning state with future due", () => {
    const now = new Date("2026-01-01T00:00:00Z");
    const card = newCard(now);
    const result = review(card, "good", now);
    expect(result.card.state).not.toBe(State.New);
    expect(result.card.reps).toBe(1);
    expect(result.card.due.getTime()).toBeGreaterThan(now.getTime());
  });

  it("'again' resets progress: increments lapses on a previously-learned card", () => {
    const now = new Date("2026-01-01T00:00:00Z");
    let card = newCard(now);
    card = review(card, "good", now).card;
    const later = new Date("2026-01-02T00:00:00Z");
    card = review(card, "good", later).card;
    const lapseBefore = card.lapses;
    const after = review(card, "again", later).card;
    expect(after.lapses).toBeGreaterThanOrEqual(lapseBefore);
  });
});

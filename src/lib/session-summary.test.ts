import { describe, expect, it } from "vitest";
import {
  formatDuration,
  MAX_SESSION_MS,
  parseSince,
  returnBucket,
  summarizeSession,
  type SessionLogRow,
} from "./session-summary";

const NOW = new Date(2026, 9, 3, 18, 0, 0);
const at = (h: number, m = 0, dayOffset = 0) => new Date(2026, 9, 3 + dayOffset, h, m, 0);

function row(over: Partial<SessionLogRow>): SessionLogRow {
  return {
    cardId: "c1",
    rating: "good",
    reviewTimeMs: 1000,
    reviewedAt: at(17),
    due: at(9, 0, 3),
    word: "la casa",
    english: "house",
    ...over,
  };
}

describe("parseSince", () => {
  it("accepts a recent ISO timestamp", () => {
    expect(parseSince(at(17).toISOString(), NOW)).toEqual(at(17));
  });

  it.each([
    ["missing", undefined],
    ["garbage", "not-a-date"],
    ["future", at(19).toISOString()],
    ["too old", new Date(NOW.getTime() - MAX_SESSION_MS - 1).toISOString()],
  ])("rejects %s", (_label, raw) => {
    expect(parseSince(raw, NOW)).toBeNull();
  });
});

describe("returnBucket", () => {
  it.each([
    [at(18, 10), "today"],
    [at(23, 59), "today"],
    [at(0, 0, 1), "tomorrow"],
    [at(23, 0, 1), "tomorrow"],
    [at(0, 0, 2), "later"],
    [at(10), "today"],
  ])("%s → %s", (due, bucket) => {
    expect(returnBucket(due, NOW)).toBe(bucket);
  });
});

describe("summarizeSession", () => {
  it("is empty for no rows", () => {
    expect(summarizeSession([], NOW)).toEqual({
      reviews: 0,
      byRating: { again: 0, hard: 0, good: 0, easy: 0 },
      totalMs: 0,
      words: [],
      returns: { today: 0, tomorrow: 0, later: 0 },
    });
  });

  it("counts every review but lists each card once with its latest rating", () => {
    const due = at(18, 10);
    const s = summarizeSession(
      [
        row({ rating: "again", reviewedAt: at(17, 0), due }),
        row({ cardId: "c2", word: "el perro", english: "dog", reviewedAt: at(17, 1) }),
        row({ rating: "good", reviewedAt: at(17, 5), due }),
      ],
      NOW,
    );
    expect(s.reviews).toBe(3);
    expect(s.byRating).toEqual({ again: 1, hard: 0, good: 2, easy: 0 });
    expect(s.totalMs).toBe(3000);
    expect(s.words.map((w) => [w.word, w.lastRating, w.misses, w.returns])).toEqual([
      ["el perro", "good", 0, "later"],
      ["la casa", "good", 1, "today"],
    ]);
    expect(s.returns).toEqual({ today: 1, tomorrow: 0, later: 1 });
  });

  it("does not depend on row order", () => {
    const rows = [
      row({ rating: "good", reviewedAt: at(17, 5) }),
      row({ rating: "again", reviewedAt: at(17, 0) }),
    ];
    const [w] = summarizeSession(rows, NOW).words;
    expect(w!.lastRating).toBe("good");
    expect(w!.misses).toBe(1);
  });
});

describe("formatDuration", () => {
  it.each([
    [0, "0s"],
    [45_400, "45s"],
    [120_000, "2 min"],
    [125_000, "2 min 5s"],
  ])("%d ms → %s", (ms, text) => {
    expect(formatDuration(ms)).toBe(text);
  });
});

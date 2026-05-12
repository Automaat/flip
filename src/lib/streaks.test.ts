import { describe, expect, it } from "vitest";
import { computeStreak, dayKey, distinctDays } from "./streaks";

const D = (s: string) => new Date(s);

describe("dayKey", () => {
  it("formats as YYYY-MM-DD in local time", () => {
    const d = new Date(2026, 0, 5, 12, 30, 0); // Jan 5 2026 local
    expect(dayKey(d)).toBe("2026-01-05");
  });
});

describe("distinctDays", () => {
  it("dedupes timestamps within the same calendar day", () => {
    const days = distinctDays([
      "2026-01-01T08:00:00",
      "2026-01-01T20:00:00",
      "2026-01-02T08:00:00",
    ]);
    expect(days.size).toBe(2);
  });
});

describe("computeStreak", () => {
  it("empty history → zero", () => {
    const r = computeStreak([], D("2026-01-10T12:00:00"));
    expect(r).toEqual({ current: 0, longest: 0, reviewedToday: false });
  });

  it("only today → 1", () => {
    const now = D("2026-01-10T20:00:00");
    const r = computeStreak([D("2026-01-10T08:00:00")], now);
    expect(r.current).toBe(1);
    expect(r.longest).toBe(1);
    expect(r.reviewedToday).toBe(true);
  });

  it("yesterday only → current = 1 (not broken yet)", () => {
    const now = D("2026-01-10T08:00:00");
    const r = computeStreak([D("2026-01-09T19:00:00")], now);
    expect(r.current).toBe(1);
    expect(r.reviewedToday).toBe(false);
  });

  it("two days ago only → current = 0 (broken)", () => {
    const now = D("2026-01-10T08:00:00");
    const r = computeStreak([D("2026-01-08T19:00:00")], now);
    expect(r.current).toBe(0);
    expect(r.longest).toBe(1);
  });

  it("3-day consecutive run ending today", () => {
    const now = D("2026-01-10T20:00:00");
    const r = computeStreak(
      [
        D("2026-01-08T08:00:00"),
        D("2026-01-09T08:00:00"),
        D("2026-01-10T08:00:00"),
      ],
      now,
    );
    expect(r.current).toBe(3);
    expect(r.longest).toBe(3);
  });

  it("gap breaks the run; longest remembers prior streak", () => {
    const now = D("2026-01-10T20:00:00");
    const r = computeStreak(
      [
        // 4-day streak Jan 1-4
        D("2026-01-01"),
        D("2026-01-02"),
        D("2026-01-03"),
        D("2026-01-04"),
        // gap
        D("2026-01-09"),
        D("2026-01-10"),
      ],
      now,
    );
    expect(r.current).toBe(2);
    expect(r.longest).toBe(4);
  });

  it("multiple reviews on a single day count as one", () => {
    const now = D("2026-01-10T20:00:00");
    const r = computeStreak(
      [
        D("2026-01-10T07:00:00"),
        D("2026-01-10T12:00:00"),
        D("2026-01-10T18:00:00"),
      ],
      now,
    );
    expect(r.current).toBe(1);
    expect(r.longest).toBe(1);
  });
});

import { describe, expect, it } from "vitest";
import { accuracy, dailyReviews } from "./stats-agg";

const NOW = new Date("2026-03-10T12:00:00");

describe("dailyReviews", () => {
  it("returns N consecutive day buckets ending today", () => {
    const out = dailyReviews([], NOW, 7);
    expect(out).toHaveLength(7);
    expect(out[6]!.date).toBe("2026-03-10");
    expect(out[0]!.date).toBe("2026-03-04");
  });

  it("counts reviews into the right day", () => {
    const out = dailyReviews(
      [
        { reviewedAt: new Date("2026-03-10T08:00:00"), rating: "good" },
        { reviewedAt: new Date("2026-03-10T20:00:00"), rating: "again" },
        { reviewedAt: new Date("2026-03-09T08:00:00"), rating: "easy" },
        { reviewedAt: new Date("2026-02-01T08:00:00"), rating: "good" }, // outside
      ],
      NOW,
      7,
    );
    expect(out[6]!.count).toBe(2);
    expect(out[6]!.good).toBe(1);
    expect(out[6]!.again).toBe(1);
    expect(out[5]!.count).toBe(1);
    expect(out[5]!.good).toBe(1);
  });

  it("accepts ISO string dates", () => {
    const out = dailyReviews(
      [{ reviewedAt: "2026-03-10T08:00:00", rating: "good" }],
      NOW,
      7,
    );
    expect(out[6]!.count).toBe(1);
  });
});

describe("accuracy", () => {
  it("empty → 0", () => {
    expect(accuracy([])).toBe(0);
  });
  it("only good/easy → 100", () => {
    expect(
      accuracy([
        { reviewedAt: new Date(), rating: "good" },
        { reviewedAt: new Date(), rating: "easy" },
      ]),
    ).toBe(100);
  });
  it("mix: 3 good + 1 again = 75", () => {
    expect(
      accuracy([
        { reviewedAt: new Date(), rating: "good" },
        { reviewedAt: new Date(), rating: "good" },
        { reviewedAt: new Date(), rating: "good" },
        { reviewedAt: new Date(), rating: "again" },
      ]),
    ).toBe(75);
  });
});

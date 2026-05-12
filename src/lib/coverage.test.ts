import { describe, expect, it } from "vitest";
import { bandCoverage } from "./coverage";

describe("bandCoverage", () => {
  it("empty input → all zeros, correct band layout", () => {
    const c = bandCoverage([], 3000);
    expect(c.totalKnown).toBe(0);
    expect(c.bands).toHaveLength(3);
    expect(c.bands[0]).toMatchObject({ band: "1–1000", total: 1000, covered: 0, percent: 0 });
    expect(c.bands[2]).toMatchObject({ band: "2001–3000", total: 1000 });
  });

  it("counts knowns within each band", () => {
    const ranks = [1, 5, 100, 1000, 1001, 1500];
    const c = bandCoverage(ranks, 2000);
    expect(c.totalKnown).toBe(6);
    expect(c.bands[0]).toMatchObject({ covered: 4, total: 1000 });
    expect(c.bands[1]).toMatchObject({ covered: 2, total: 1000 });
  });

  it("dedupes repeated ranks", () => {
    const c = bandCoverage([5, 5, 5, 10], 100);
    expect(c.totalKnown).toBe(2);
  });

  it("custom band size", () => {
    const c = bandCoverage([1, 2, 3, 6], 6, 3);
    expect(c.bands).toHaveLength(2);
    expect(c.bands[0]).toMatchObject({ band: "1–3", covered: 3 });
    expect(c.bands[1]).toMatchObject({ band: "4–6", covered: 1 });
  });

  it("handles totals not divisible by size", () => {
    const c = bandCoverage([], 1500);
    expect(c.bands).toHaveLength(2);
    expect(c.bands[1]).toMatchObject({ band: "1001–1500", total: 500 });
  });
});

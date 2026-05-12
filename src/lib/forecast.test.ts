import { describe, expect, it } from "vitest";
import { forecast } from "./forecast";

const NOW = new Date("2026-03-10T14:00:00");

describe("forecast", () => {
  it("returns 7 buckets by default starting today", () => {
    const f = forecast([], NOW);
    expect(f).toHaveLength(7);
    expect(f[0]!.isToday).toBe(true);
    expect(f[0]!.date).toBe("2026-03-10");
    expect(f[6]!.date).toBe("2026-03-16");
  });

  it("places due-later cards in their day bucket", () => {
    const f = forecast(
      [
        new Date("2026-03-10T20:00:00"), // today
        new Date("2026-03-11T08:00:00"), // tomorrow
        new Date("2026-03-13T08:00:00"), // friday
        new Date("2026-03-15T08:00:00"), // sunday
        new Date("2026-03-25T08:00:00"), // outside horizon
      ],
      NOW,
    );
    expect(f[0]!.count).toBe(1); // today
    expect(f[1]!.count).toBe(1); // 03-11
    expect(f[3]!.count).toBe(1); // 03-13
    expect(f[5]!.count).toBe(1); // 03-15
    expect(f.reduce((a, b) => a + b.count, 0)).toBe(4);
  });

  it("collapses overdue cards into today's bucket", () => {
    const f = forecast(
      [
        new Date("2026-03-05T10:00:00"),
        new Date("2026-03-08T10:00:00"),
        new Date("2026-03-09T10:00:00"),
      ],
      NOW,
    );
    expect(f[0]!.count).toBe(3);
  });

  it("custom days parameter", () => {
    const f = forecast([], NOW, 3);
    expect(f).toHaveLength(3);
  });
});

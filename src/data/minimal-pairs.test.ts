import { describe, expect, it } from "vitest";
import { MINIMAL_PAIRS } from "./minimal-pairs";

describe("MINIMAL_PAIRS", () => {
  it("has at least 10 entries", () => {
    expect(MINIMAL_PAIRS.length).toBeGreaterThanOrEqual(10);
  });

  it("covers the headline contrasts (r/rr, ñ/n)", () => {
    const contrasts = new Set(MINIMAL_PAIRS.map((p) => p.contrast));
    expect([...contrasts].some((c) => c.includes("r vs rr"))).toBe(true);
    expect([...contrasts].some((c) => c.includes("ñ vs n"))).toBe(true);
  });

  it("each pair has a and b distinct", () => {
    for (const p of MINIMAL_PAIRS) {
      expect(p.a.spanish).not.toBe(p.b.spanish);
      expect(p.a.english).toBeTruthy();
      expect(p.b.english).toBeTruthy();
    }
  });

  it("includes the canonical pero/perro and año/ano traps", () => {
    const flat = MINIMAL_PAIRS.flatMap((p) => [p.a.spanish, p.b.spanish]);
    expect(flat).toContain("pero");
    expect(flat).toContain("perro");
    expect(flat).toContain("año");
    expect(flat).toContain("ano");
  });
});

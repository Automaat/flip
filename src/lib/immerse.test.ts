import { describe, expect, it } from "vitest";
import { immerse } from "./immerse";

describe("immerse", () => {
  it("returns English when percent is 0", () => {
    expect(immerse("Review", 0)).toBe("Review");
  });
  it("returns Spanish when percent is 100", () => {
    expect(immerse("Review", 100)).toBe("Repaso");
  });
  it("returns English for unknown labels regardless", () => {
    expect(immerse("Probably-Not-In-Map", 100)).toBe("Probably-Not-In-Map");
  });
  it("is deterministic for the same (label, percent)", () => {
    expect(immerse("Verbs", 50)).toBe(immerse("Verbs", 50));
  });
  it("most labels flip at 100%", () => {
    const labels = ["Review", "Verbs", "Reader", "Stories"];
    for (const l of labels) {
      expect(immerse(l, 100)).not.toBe(l);
    }
  });
});

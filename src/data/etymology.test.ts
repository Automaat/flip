import { describe, expect, it } from "vitest";
import { findRoot, ROOTS } from "./etymology";

describe("ROOTS", () => {
  it("has at least 20 entries", () => {
    expect(ROOTS.length).toBeGreaterThanOrEqual(20);
  });

  it("ids are unique", () => {
    const ids = ROOTS.map((r) => r.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every root has at least 3 Spanish derivatives and 3 English ones", () => {
    for (const r of ROOTS) {
      expect(r.spanish.length, `${r.id} spanish`).toBeGreaterThanOrEqual(3);
      expect(r.english.length, `${r.id} english`).toBeGreaterThanOrEqual(3);
    }
  });

  it("origin is Latin or Greek", () => {
    for (const r of ROOTS) {
      expect(["Latin", "Greek"]).toContain(r.origin);
    }
  });
});

describe("findRoot", () => {
  it("returns root for known id", () => {
    expect(findRoot("aqua")?.meaning).toBe("water");
  });
  it("returns undefined for unknown id", () => {
    expect(findRoot("nope")).toBeUndefined();
  });
});

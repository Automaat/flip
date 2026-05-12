import { describe, expect, it } from "vitest";
import { GENDER_EXCEPTIONS, GENDER_RULES } from "./gender-exceptions";

describe("GENDER_RULES", () => {
  it("has the core six rules", () => {
    expect(GENDER_RULES.length).toBeGreaterThanOrEqual(6);
    const ids = GENDER_RULES.map((r) => r.id);
    expect(ids).toContain("ends-o");
    expect(ids).toContain("ends-a");
    expect(ids).toContain("greek-ma");
  });

  it("every rule has examples", () => {
    for (const r of GENDER_RULES) {
      expect(r.examples.length, r.id).toBeGreaterThan(0);
    }
  });
});

describe("GENDER_EXCEPTIONS", () => {
  it("contains the canonical Greek traps", () => {
    const ids = GENDER_EXCEPTIONS.map((e) => e.spanish);
    expect(ids).toContain("problema");
    expect(ids).toContain("sistema");
    expect(ids).toContain("tema");
  });

  it("contains -o feminine exceptions", () => {
    const o = GENDER_EXCEPTIONS.filter((e) => e.spanish.endsWith("o"));
    expect(o.some((e) => e.spanish === "mano" && e.gender === "f")).toBe(true);
    expect(o.some((e) => e.spanish === "foto" && e.gender === "f")).toBe(true);
  });

  it("every entry has all fields populated", () => {
    for (const e of GENDER_EXCEPTIONS) {
      expect(e.spanish).toBeTruthy();
      expect(e.english).toBeTruthy();
      expect(["m", "f"]).toContain(e.gender);
      expect(e.trickReason).toBeTruthy();
      expect(e.example).toBeTruthy();
      expect(e.exampleEnglish).toBeTruthy();
    }
  });

  it("example mentions the Spanish word (2-char stem match)", () => {
    for (const e of GENDER_EXCEPTIONS) {
      const stem = e.spanish.toLowerCase().slice(0, 2);
      expect(e.example.toLowerCase().includes(stem), `${e.spanish}: '${stem}' not in example`).toBe(
        true,
      );
    }
  });
});

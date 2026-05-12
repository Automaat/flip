import { describe, expect, it } from "vitest";
import { FALSE_FRIENDS, UNIQUE_FALSE_FRIENDS } from "./false-friends";

describe("FALSE_FRIENDS", () => {
  it("has at least 40 entries", () => {
    expect(FALSE_FRIENDS.length).toBeGreaterThanOrEqual(40);
  });

  it("every entry has all required fields populated", () => {
    for (const f of FALSE_FRIENDS) {
      expect(f.spanish, "spanish").toBeTruthy();
      expect(f.englishTrap, `${f.spanish} englishTrap`).toBeTruthy();
      expect(f.englishReal, `${f.spanish} englishReal`).toBeTruthy();
      expect(f.example, `${f.spanish} example`).toBeTruthy();
      expect(f.exampleEnglish, `${f.spanish} exampleEnglish`).toBeTruthy();
    }
  });

  it("example references the Spanish word (first 2 chars of stem)", () => {
    for (const f of FALSE_FRIENDS) {
      const ex = f.example.toLowerCase();
      // Verbs change stems (e→ie, o→ue), so we only check the first 2 chars.
      const stem = f.spanish.toLowerCase().slice(0, 2);
      expect(ex.includes(stem), `${f.spanish}: stem '${stem}' missing in '${f.example}'`).toBe(
        true,
      );
    }
  });
});

describe("UNIQUE_FALSE_FRIENDS", () => {
  it("has no duplicate Spanish entries", () => {
    const words = UNIQUE_FALSE_FRIENDS.map((f) => f.spanish);
    expect(new Set(words).size).toBe(words.length);
  });

  it("is shorter than or equal to FALSE_FRIENDS (duplicates removed)", () => {
    expect(UNIQUE_FALSE_FRIENDS.length).toBeLessThanOrEqual(FALSE_FRIENDS.length);
  });
});

import { describe, expect, it } from "vitest";
import { IRREGULAR_VERBS_PRESENT, PERSONS, buildClozeCards } from "./verbs";

describe("IRREGULAR_VERBS_PRESENT", () => {
  it("has the 14 essential irregulars", () => {
    const expected = [
      "ser", "estar", "ir", "tener", "hacer", "poder", "querer",
      "saber", "decir", "venir", "dar", "ver", "poner", "salir",
    ];
    expect(IRREGULAR_VERBS_PRESENT.map((v) => v.infinitive).toSorted()).toEqual(expected.toSorted());
  });

  it("every verb has all 5 person forms", () => {
    for (const v of IRREGULAR_VERBS_PRESENT) {
      for (const p of PERSONS) {
        expect(v.forms[p], `${v.infinitive} missing ${p}`).toBeTruthy();
      }
    }
  });

  it("every verb has examples for all persons", () => {
    for (const v of IRREGULAR_VERBS_PRESENT) {
      for (const p of PERSONS) {
        expect(v.exampleByPerson[p], `${v.infinitive} missing example for ${p}`).toBeTruthy();
      }
    }
  });

  it("each example contains the conjugated form", () => {
    for (const v of IRREGULAR_VERBS_PRESENT) {
      for (const p of PERSONS) {
        const form = v.forms[p];
        const ex = v.exampleByPerson[p]!.es.toLowerCase();
        expect(ex.includes(form.toLowerCase()), `${v.infinitive}/${p}: '${form}' not in '${ex}'`).toBe(true);
      }
    }
  });
});

describe("buildClozeCards", () => {
  const cards = buildClozeCards();

  it("produces one card per (verb, person) — 14 × 5 = 70", () => {
    expect(cards.length).toBe(14 * 5);
  });

  it("each card has ___ in the sentence", () => {
    for (const c of cards) expect(c.sentence).toContain("___");
  });

  it("each card has a non-empty answer that does NOT appear verbatim in the sentence", () => {
    for (const c of cards) {
      expect(c.answer).toBeTruthy();
      expect(c.sentence.toLowerCase().includes(c.answer.toLowerCase())).toBe(false);
    }
  });
});

import { describe, expect, it } from "vitest";
import {
  IRREGULAR_VERBS_PRESENT,
  IRREGULAR_VERBS_PRETERITE,
  PERSONS,
  buildClozeCards,
} from "./verbs";

const TABLES = {
  present: IRREGULAR_VERBS_PRESENT,
  preterite: IRREGULAR_VERBS_PRETERITE,
};

const EXPECTED_INFINITIVES = [
  "ser", "estar", "ir", "tener", "hacer", "poder", "querer",
  "saber", "decir", "venir", "dar", "ver", "poner", "salir",
];

describe.each(Object.entries(TABLES))("%s verbs", (tenseName, table) => {
  it("has the 14 essential irregulars", () => {
    expect(table.map((v) => v.infinitive).toSorted()).toEqual(EXPECTED_INFINITIVES.toSorted());
  });

  it("every verb has all 5 person forms", () => {
    for (const v of table) {
      for (const p of PERSONS) {
        expect(v.forms[p], `${v.infinitive} missing ${p} (${tenseName})`).toBeTruthy();
      }
    }
  });

  it("every verb has examples for all persons", () => {
    for (const v of table) {
      for (const p of PERSONS) {
        expect(
          v.exampleByPerson[p],
          `${v.infinitive} missing example for ${p} (${tenseName})`,
        ).toBeTruthy();
      }
    }
  });

  it("each example contains the conjugated form", () => {
    for (const v of table) {
      for (const p of PERSONS) {
        const form = v.forms[p];
        const ex = v.exampleByPerson[p]!.es.toLowerCase();
        expect(
          ex.includes(form.toLowerCase()),
          `${v.infinitive}/${p} (${tenseName}): '${form}' not in '${ex}'`,
        ).toBe(true);
      }
    }
  });
});

describe("buildClozeCards", () => {
  it("present default → 14 × 5 = 70", () => {
    expect(buildClozeCards().length).toBe(14 * 5);
  });

  it("preterite explicit → 14 × 5 = 70", () => {
    expect(buildClozeCards(IRREGULAR_VERBS_PRETERITE).length).toBe(14 * 5);
  });

  it("present cards have tense='present'", () => {
    const cards = buildClozeCards();
    expect(cards.every((c) => c.tense === "present")).toBe(true);
  });

  it("preterite cards have tense='preterite'", () => {
    const cards = buildClozeCards(IRREGULAR_VERBS_PRETERITE);
    expect(cards.every((c) => c.tense === "preterite")).toBe(true);
  });

  it("each card has ___ in the sentence and answer not in sentence", () => {
    for (const c of buildClozeCards(IRREGULAR_VERBS_PRETERITE)) {
      expect(c.sentence).toContain("___");
      expect(c.sentence.toLowerCase().includes(c.answer.toLowerCase())).toBe(false);
    }
  });
});

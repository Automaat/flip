import { describe, expect, it } from "vitest";
import {
  IRREGULAR_VERBS_IMPERFECT,
  IRREGULAR_VERBS_PRESENT,
  IRREGULAR_VERBS_PRETERITE,
  PERSONS,
  buildClozeCards,
  missingClozes,
  type Person,
} from "./verbs";

/** Hand-written examples cover the LATAM persons; vosotros falls back to a pronoun prompt. */
const EXAMPLE_PERSONS: Person[] = PERSONS.filter((p) => p !== "vosotros");

const TABLES = {
  present: IRREGULAR_VERBS_PRESENT,
  preterite: IRREGULAR_VERBS_PRETERITE,
  imperfect: IRREGULAR_VERBS_IMPERFECT,
};

const EXPECTED_INFINITIVES = [
  "ser", "estar", "ir", "tener", "hacer", "poder", "querer",
  "saber", "decir", "venir", "dar", "ver", "poner", "salir",
];

describe.each(Object.entries(TABLES))("%s verbs", (tenseName, table) => {
  it("has the 14 essential irregulars", () => {
    expect(table.map((v) => v.infinitive).toSorted()).toEqual(EXPECTED_INFINITIVES.toSorted());
  });

  it("every verb has all 6 person forms", () => {
    for (const v of table) {
      for (const p of PERSONS) {
        expect(v.forms[p], `${v.infinitive} missing ${p} (${tenseName})`).toBeTruthy();
      }
    }
  });

  it("every verb has examples for all LATAM persons", () => {
    for (const v of table) {
      for (const p of EXAMPLE_PERSONS) {
        expect(
          v.exampleByPerson[p],
          `${v.infinitive} missing example for ${p} (${tenseName})`,
        ).toBeTruthy();
      }
    }
  });

  it("each example contains the conjugated form", () => {
    for (const v of table) {
      for (const p of EXAMPLE_PERSONS) {
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
  it("present default → 14 × 6 = 84", () => {
    expect(buildClozeCards().length).toBe(14 * 6);
  });

  it("preterite explicit → 14 × 6 = 84", () => {
    expect(buildClozeCards(IRREGULAR_VERBS_PRETERITE).length).toBe(14 * 6);
  });

  it("present cards have tense='present'", () => {
    const cards = buildClozeCards();
    expect(cards.every((c) => c.tense === "present")).toBe(true);
  });

  it("preterite cards have tense='preterite'", () => {
    const cards = buildClozeCards(IRREGULAR_VERBS_PRETERITE);
    expect(cards.every((c) => c.tense === "preterite")).toBe(true);
  });

  it("imperfect cards have tense='imperfect' and count to 84", () => {
    const cards = buildClozeCards(IRREGULAR_VERBS_IMPERFECT);
    expect(cards.length).toBe(84);
    expect(cards.every((c) => c.tense === "imperfect")).toBe(true);
  });

  it("each card has ___ in the sentence and answer not in sentence", () => {
    for (const c of buildClozeCards(IRREGULAR_VERBS_PRETERITE)) {
      expect(c.sentence).toContain("___");
      expect(c.sentence.toLowerCase().includes(c.answer.toLowerCase())).toBe(false);
    }
  });

  it("vosotros without an example becomes a pronoun prompt", () => {
    const vos = buildClozeCards().find((c) => c.infinitive === "ser" && c.person === "vosotros")!;
    expect(vos.sentence).toBe("vosotros ___");
    expect(vos.answer).toBe("sois");
    expect(vos.sentenceEnglish).toBe("");
  });
});

describe("missingClozes", () => {
  const all = buildClozeCards();

  it("returns everything for an empty deck", () => {
    expect(missingClozes(all, [])).toHaveLength(all.length);
  });

  it("tops up only vosotros for a legacy 5-person deck", () => {
    const legacy = all.filter((c) => c.person !== "vosotros");
    const missing = missingClozes(all, legacy);
    expect(missing).toHaveLength(14);
    expect(missing.every((c) => c.person === "vosotros")).toBe(true);
  });

  it("returns nothing for a complete deck", () => {
    expect(missingClozes(all, all)).toEqual([]);
  });
});

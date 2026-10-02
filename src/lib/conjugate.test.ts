import { describe, expect, it } from "vitest";
import { PERSONS, REGULAR_VERBS, TENSES, type Person, type Tense } from "@/data/verbs";
import {
  conjugate,
  drillPool,
  gradeConjugation,
  nextDrillItem,
  participle,
  RETRY_GAP,
  sameItem,
  scheduleRetry,
  verbDeckName,
  verbTable,
  type DrillItem,
} from "./conjugate";

const paradigm = (inf: string, tense: Tense) => PERSONS.map((p) => conjugate(inf, tense, p));

describe("conjugate — regular verbs", () => {
  it.each<[string, Tense, string[]]>([
    ["hablar", "present", ["hablo", "hablas", "habla", "hablamos", "habláis", "hablan"]],
    ["comer", "present", ["como", "comes", "come", "comemos", "coméis", "comen"]],
    ["vivir", "present", ["vivo", "vives", "vive", "vivimos", "vivís", "viven"]],
    ["hablar", "preterite", ["hablé", "hablaste", "habló", "hablamos", "hablasteis", "hablaron"]],
    ["comer", "preterite", ["comí", "comiste", "comió", "comimos", "comisteis", "comieron"]],
    ["vivir", "preterite", ["viví", "viviste", "vivió", "vivimos", "vivisteis", "vivieron"]],
    ["hablar", "imperfect", ["hablaba", "hablabas", "hablaba", "hablábamos", "hablabais", "hablaban"]],
    ["vivir", "imperfect", ["vivía", "vivías", "vivía", "vivíamos", "vivíais", "vivían"]],
    ["hablar", "perfect", ["he hablado", "has hablado", "ha hablado", "hemos hablado", "habéis hablado", "han hablado"]],
    ["comer", "perfect", ["he comido", "has comido", "ha comido", "hemos comido", "habéis comido", "han comido"]],
  ])("%s %s", (inf, tense, expected) => {
    expect(paradigm(inf, tense)).toEqual(expected);
  });
});

describe("conjugate — irregular tables win", () => {
  it.each<[string, Tense, Person, string]>([
    ["ser", "present", "vosotros", "sois"],
    ["ir", "preterite", "vosotros", "fuisteis"],
    ["tener", "preterite", "yo", "tuve"],
    ["ver", "imperfect", "nosotros", "veíamos"],
    ["hacer", "perfect", "yo", "he hecho"],
    ["ir", "perfect", "ellos/ellas", "han ido"],
    ["decir", "perfect", "tú", "has dicho"],
  ])("%s %s %s → %s", (inf, tense, person, expected) => {
    expect(conjugate(inf, tense, person)).toBe(expected);
  });
});

describe("participle", () => {
  it.each([
    ["hablar", "hablado"],
    ["vivir", "vivido"],
    ["leer", "leído"],
    ["traer", "traído"],
    ["escribir", "escrito"],
    ["abrir", "abierto"],
    ["romper", "roto"],
    ["poner", "puesto"],
    ["ver", "visto"],
  ])("%s → %s", (inf, expected) => {
    expect(participle(inf)).toBe(expected);
  });

  it("rejects a non-infinitive", () => {
    expect(() => participle("casa")).toThrow();
  });
});

describe("verbTable", () => {
  it.each(TENSES)("every %s table has all 6 forms for both groups", (tense) => {
    for (const group of ["irregular", "regular"] as const) {
      for (const v of verbTable(group, tense)) {
        for (const p of PERSONS) expect(v.forms[p], `${v.infinitive} ${tense} ${p}`).toBeTruthy();
        expect(v.tense).toBe(tense);
      }
    }
  });

  it("regular table covers REGULAR_VERBS", () => {
    expect(verbTable("regular", "present").map((v) => v.infinitive)).toEqual(
      REGULAR_VERBS.map((v) => v.infinitive),
    );
  });

  it("irregular perfect covers the 14 irregulars", () => {
    expect(verbTable("irregular", "perfect")).toHaveLength(14);
  });
});

describe("verbDeckName", () => {
  it("keeps legacy irregular names", () => {
    expect(verbDeckName("irregular", "present")).toBe("Present Indicative — Irregulars");
    expect(verbDeckName("irregular", "preterite")).toBe("Preterite — Irregulars");
  });

  it("names regular perfect deck", () => {
    expect(verbDeckName("regular", "perfect")).toBe("Present Perfect — Regulars");
  });
});

describe("drillPool", () => {
  it("is verbs × tenses × 6 persons", () => {
    expect(drillPool(["irregular"], ["present", "perfect"])).toHaveLength(14 * 2 * 6);
    expect(drillPool(["irregular", "regular"], ["preterite"])).toHaveLength(
      (14 + REGULAR_VERBS.length) * 6,
    );
  });

  it("is empty with nothing selected", () => {
    expect(drillPool([], ["present"])).toEqual([]);
    expect(drillPool(["regular"], [])).toEqual([]);
  });
});

describe("gradeConjugation", () => {
  it.each<[string, string, string]>([
    ["hablé", "hablé", "correct"],
    ["  He   Hablado ", "he hablado", "correct"],
    ["hable", "hablé", "accent"],
    ["habeis comido", "habéis comido", "accent"],
    ["hablo", "habló", "accent"],
    ["habla\u0301is", "habláis", "correct"],
    ["hablo", "hablé", "wrong"],
    ["", "hablé", "wrong"],
  ])("%j vs %j → %s", (typed, expected, grade) => {
    expect(gradeConjugation(typed, expected)).toBe(grade);
  });
});

describe("nextDrillItem", () => {
  const pool = drillPool(["irregular"], ["present"]);
  const a = pool[0]!;
  const b = pool[1]!;

  it("picks from the pool using rng", () => {
    expect(nextDrillItem(pool, [], 0, () => 0).item).toEqual(a);
  });

  it("never repeats the previous item", () => {
    const { item } = nextDrillItem(pool, [], 0, () => 0, a);
    expect(sameItem(item, a)).toBe(false);
  });

  it("returns a due retry first and removes it", () => {
    const retry = [{ item: b, dueTurn: RETRY_GAP }];
    const res = nextDrillItem(pool, retry, RETRY_GAP, () => 0);
    expect(res.item).toEqual(b);
    expect(res.retry).toEqual([]);
  });

  it("keeps a retry that is not due yet", () => {
    const retry = [{ item: b, dueTurn: 5 }];
    const res = nextDrillItem(pool, retry, 2, () => 0);
    expect(res.item).toEqual(a);
    expect(res.retry).toEqual(retry);
  });

  it("does not pick an item already waiting for retry", () => {
    const retry = [{ item: a, dueTurn: 10 }];
    const { item } = nextDrillItem(pool, retry, 1, () => 0);
    expect(sameItem(item, a)).toBe(false);
  });

  it("does not serve a due retry right after the same item", () => {
    const retry = [{ item: a, dueTurn: 0 }];
    const res = nextDrillItem(pool, retry, 1, () => 0, a);
    expect(sameItem(res.item, a)).toBe(false);
    expect(res.retry).toEqual(retry);
  });

  it("allows a single-item pool to repeat", () => {
    const single: DrillItem[] = [a];
    expect(nextDrillItem(single, [], 1, () => 0.9, a).item).toEqual(a);
  });
});

describe("scheduleRetry", () => {
  const [a, b] = drillPool(["irregular"], ["present"]);

  it("queues RETRY_GAP turns ahead", () => {
    expect(scheduleRetry([], a!, 4)).toEqual([{ item: a, dueTurn: 4 + RETRY_GAP }]);
  });

  it("replaces a pending entry for the same item", () => {
    const retry = scheduleRetry(scheduleRetry([], a!, 0), b!, 1);
    expect(scheduleRetry(retry, a!, 5)).toEqual([
      { item: b, dueTurn: 1 + RETRY_GAP },
      { item: a, dueTurn: 5 + RETRY_GAP },
    ]);
  });
});

import {
  IRREGULAR_VERBS_IMPERFECT,
  IRREGULAR_VERBS_PRESENT,
  IRREGULAR_VERBS_PRETERITE,
  PERSONS,
  REGULAR_VERBS,
  type Person,
  type Tense,
  type VerbConjugation,
  type VerbGroup,
} from "@/data/verbs";
import { normalize } from "./cognates";

type SimpleTense = Exclude<Tense, "perfect">;
type Ending = "ar" | "er" | "ir";

const ER_IR_PRETERITE = ["í", "iste", "ió", "imos", "isteis", "ieron"];
const ER_IR_IMPERFECT = ["ía", "ías", "ía", "íamos", "íais", "ían"];

/** Endings indexed in PERSONS order. */
const ENDINGS: Record<SimpleTense, Record<Ending, string[]>> = {
  present: {
    ar: ["o", "as", "a", "amos", "áis", "an"],
    er: ["o", "es", "e", "emos", "éis", "en"],
    ir: ["o", "es", "e", "imos", "ís", "en"],
  },
  preterite: {
    ar: ["é", "aste", "ó", "amos", "asteis", "aron"],
    er: ER_IR_PRETERITE,
    ir: ER_IR_PRETERITE,
  },
  imperfect: {
    ar: ["aba", "abas", "aba", "ábamos", "abais", "aban"],
    er: ER_IR_IMPERFECT,
    ir: ER_IR_IMPERFECT,
  },
};

const HABER_PRESENT = ["he", "has", "ha", "hemos", "habéis", "han"];

const IRREGULAR_PARTICIPLES: Record<string, string> = {
  hacer: "hecho",
  decir: "dicho",
  ver: "visto",
  poner: "puesto",
  escribir: "escrito",
  abrir: "abierto",
  romper: "roto",
  volver: "vuelto",
  morir: "muerto",
  descubrir: "descubierto",
  freír: "frito",
};

const IRREGULAR_TABLES: Record<SimpleTense, VerbConjugation[]> = {
  present: IRREGULAR_VERBS_PRESENT,
  preterite: IRREGULAR_VERBS_PRETERITE,
  imperfect: IRREGULAR_VERBS_IMPERFECT,
};

function split(infinitive: string): { stem: string; ending: Ending } {
  const ending = infinitive.slice(-2);
  if (ending !== "ar" && ending !== "er" && ending !== "ir") {
    throw new Error(`not an infinitive: ${infinitive}`);
  }
  return { stem: infinitive.slice(0, -2), ending };
}

/** Past participle; stems ending in a strong vowel take an accent (leer → leído). */
export function participle(infinitive: string): string {
  const irregular = IRREGULAR_PARTICIPLES[infinitive];
  if (irregular) return irregular;
  const { stem, ending } = split(infinitive);
  if (ending === "ar") return `${stem}ado`;
  const stemEndsInStrongVowel = /[aeo]$/.test(stem);
  return stemEndsInStrongVowel ? `${stem}ído` : `${stem}ido`;
}

function regularForm(infinitive: string, tense: Tense, person: Person): string {
  const i = PERSONS.indexOf(person);
  if (tense === "perfect") return `${HABER_PRESENT[i]} ${participle(infinitive)}`;
  const { stem, ending } = split(infinitive);
  return stem + ENDINGS[tense][ending][i];
}

/** Conjugate any verb; irregular tables win over the regular pattern. */
export function conjugate(infinitive: string, tense: Tense, person: Person): string {
  if (tense !== "perfect") {
    const row = IRREGULAR_TABLES[tense].find((v) => v.infinitive === infinitive);
    if (row) return row.forms[person];
  }
  return regularForm(infinitive, tense, person);
}

function generated(infinitive: string, english: string, tense: Tense): VerbConjugation {
  const forms = Object.fromEntries(
    PERSONS.map((p) => [p, conjugate(infinitive, tense, p)]),
  ) as Record<Person, string>;
  return { infinitive, english, tense, forms, exampleByPerson: {} };
}

export function verbTable(group: VerbGroup, tense: Tense): VerbConjugation[] {
  if (group === "irregular") {
    if (tense !== "perfect") return IRREGULAR_TABLES[tense];
    return IRREGULAR_VERBS_PRESENT.map((v) => generated(v.infinitive, v.english, tense));
  }
  return REGULAR_VERBS.map((v) => generated(v.infinitive, v.english, tense));
}

const DECK_TENSE: Record<Tense, string> = {
  present: "Present Indicative",
  preterite: "Preterite",
  imperfect: "Imperfect",
  perfect: "Present Perfect",
};

export function verbDeckName(group: VerbGroup, tense: Tense): string {
  return `${DECK_TENSE[tense]} — ${group === "irregular" ? "Irregulars" : "Regulars"}`;
}

export type DrillItem = {
  infinitive: string;
  english: string;
  tense: Tense;
  person: Person;
  answer: string;
};

export function drillPool(groups: VerbGroup[], tenses: Tense[]): DrillItem[] {
  const out: DrillItem[] = [];
  for (const group of groups) {
    for (const tense of tenses) {
      for (const v of verbTable(group, tense)) {
        for (const person of PERSONS) {
          out.push({ infinitive: v.infinitive, english: v.english, tense, person, answer: v.forms[person] });
        }
      }
    }
  }
  return out;
}

export type Grade = "correct" | "accent" | "wrong";

function clean(s: string): string {
  return s.normalize("NFC").trim().toLowerCase().replace(/\s+/g, " ");
}

/** "accent" = right letters, wrong or missing accents — still a miss, since accents mark tense (hablo vs habló). */
export function gradeConjugation(typed: string, expected: string): Grade {
  if (clean(typed) === clean(expected)) return "correct";
  if (normalize(clean(typed)) === normalize(clean(expected))) return "accent";
  return "wrong";
}

export type RetryEntry = { item: DrillItem; dueTurn: number };

export const RETRY_GAP = 3;

/** Queue a missed item RETRY_GAP turns ahead, replacing any pending entry for it. */
export function scheduleRetry(retry: RetryEntry[], item: DrillItem, turn: number): RetryEntry[] {
  return [...retry.filter((r) => !sameItem(r.item, item)), { item, dueTurn: turn + RETRY_GAP }];
}

/** Due retries first; otherwise random among items not pending retry. Never repeats `previous` back to back. */
export function nextDrillItem(
  pool: DrillItem[],
  retry: RetryEntry[],
  turn: number,
  rng: () => number,
  previous?: DrillItem,
): { item: DrillItem; retry: RetryEntry[] } {
  const notPrevious = (item: DrillItem) => !previous || !sameItem(item, previous);
  const dueIdx = retry.findIndex((r) => r.dueTurn <= turn && notPrevious(r.item));
  if (dueIdx >= 0) {
    return { item: retry[dueIdx]!.item, retry: retry.filter((_, i) => i !== dueIdx) };
  }
  const fresh = pool.filter((p) => notPrevious(p) && !retry.some((r) => sameItem(r.item, p)));
  const candidates = fresh.length > 0 ? fresh : pool;
  const item = candidates[Math.floor(rng() * candidates.length)]!;
  return { item, retry: retry.filter((r) => !sameItem(r.item, item)) };
}

export function sameItem(a: DrillItem, b: DrillItem): boolean {
  return a.infinitive === b.infinitive && a.tense === b.tense && a.person === b.person;
}

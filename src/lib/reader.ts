export type Token = {
  raw: string;
  /** Lowercase, accent-preserved word — used for vocab lookup. */
  word: string | null;
};

const WORD_RE = /[a-záéíóúüñ]+/giu;

export function tokenizeForReader(text: string): Token[] {
  const out: Token[] = [];
  let i = 0;
  for (const m of text.matchAll(WORD_RE)) {
    if (m.index! > i) out.push({ raw: text.slice(i, m.index), word: null });
    out.push({ raw: m[0], word: m[0].toLowerCase() });
    i = m.index! + m[0].length;
  }
  if (i < text.length) out.push({ raw: text.slice(i), word: null });
  return out;
}

export type Familiarity = "unknown" | "learning" | "known";

/** Decide familiarity from FSRS state. */
export function familiarityFromState(
  state: "new" | "learning" | "review" | "relearning" | null,
): Familiarity {
  if (state === null) return "unknown";
  if (state === "review") return "known";
  return "learning";
}

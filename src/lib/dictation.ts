export type TokenStatus = "correct" | "wrong" | "extra" | "missing";

export type ScoredToken = {
  token: string;
  status: TokenStatus;
};

export type DictationScore = {
  expected: ScoredToken[];
  given: ScoredToken[];
  correctCount: number;
  expectedCount: number;
  percent: number;
};

const STRIP_PUNCT = /[-.,!?¿¡:;"'""„«»()…—–]/g;

export function normalizeWord(w: string): string {
  return w
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, (m) => m) // keep ñ tilde
    .replace(/̃/g, "")
    .replace(/[̀-ͯ]/g, "")
    .replace(//g, "̃")
    .normalize("NFC")
    .replace(STRIP_PUNCT, "")
    .trim();
}

export function tokenize(s: string): string[] {
  return s
    .split(/\s+/)
    .map((t) => t.trim())
    .filter(Boolean);
}

/**
 * Score user input against the expected sentence.
 * Aligns by index; tokens not in expected are 'extra', missing ones are 'missing'.
 */
export function scoreDictation(expected: string, given: string): DictationScore {
  const exp = tokenize(expected);
  const giv = tokenize(given);
  const max = Math.max(exp.length, giv.length);

  const expectedScored: ScoredToken[] = [];
  const givenScored: ScoredToken[] = [];
  let correctCount = 0;

  for (let i = 0; i < max; i++) {
    const e = exp[i];
    const g = giv[i];
    if (e !== undefined && g !== undefined) {
      const match = normalizeWord(e) === normalizeWord(g);
      const status: TokenStatus = match ? "correct" : "wrong";
      expectedScored.push({ token: e, status });
      givenScored.push({ token: g, status });
      if (match) correctCount++;
    } else if (e !== undefined) {
      expectedScored.push({ token: e, status: "missing" });
    } else if (g !== undefined) {
      givenScored.push({ token: g, status: "extra" });
    }
  }

  const expectedCount = exp.length;
  const percent = expectedCount === 0 ? 0 : Math.round((correctCount / expectedCount) * 100);
  return { expected: expectedScored, given: givenScored, correctCount, expectedCount, percent };
}

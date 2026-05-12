import { normalize } from "./cognates";

/** Tokenize a sentence into words (keeps punctuation attached to words). */
export function constructTokens(sentence: string): string[] {
  return sentence
    .split(/\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

/** Deterministic shuffle (Fisher-Yates) seeded by a number. */
export function shuffle<T>(items: T[], seed: number): T[] {
  const a = [...items];
  let s = seed | 0;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) | 0;
    const j = Math.abs(s) % (i + 1);
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

/** Compare constructed answer against expected, normalized + punctuation-tolerant. */
export function isConstructionCorrect(expectedTokens: string[], givenTokens: string[]): boolean {
  if (expectedTokens.length !== givenTokens.length) return false;
  const strip = (s: string) => normalize(s).replace(/[^\p{L}\p{N}]/gu, "");
  for (let i = 0; i < expectedTokens.length; i++) {
    if (strip(expectedTokens[i]!) !== strip(givenTokens[i]!)) return false;
  }
  return true;
}

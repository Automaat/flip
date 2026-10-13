import { matchesAnswer, normalize } from "./cognates";

type Gender = "m" | "f";

type VocabAnswer = {
  spanish: string;
  gender?: Gender;
};

// These feminine nouns take el immediately before their stressed initial a.
const FEMININE_EL_NOUNS = new Set([
  "acta", "agua", "aguila", "ala", "alma", "ancla", "anfora", "ansia",
  "area", "arma", "arpa", "arte", "asma", "aula", "ave", "habla",
  "hacha", "hada", "hambre",
]);

export function vocabPresentation({ spanish, gender }: VocabAnswer): {
  article: string | null;
  noun: string;
} {
  if (!gender) return { article: null, noun: spanish };
  const text = spanish.trim();
  const prefixed = /^(el|la|los|las)\s+(.+)$/i.exec(text);
  if (prefixed) return { article: prefixed[1]!.toLowerCase(), noun: prefixed[2]! };
  const firstWord = normalize(text).split(/\s+/)[0]!;
  const article = gender === "m" || FEMININE_EL_NOUNS.has(firstWord) ? "el" : "la";
  return { article, noun: text };
}

export function matchesVocabAnswer(actual: string, expected: VocabAnswer): boolean {
  if (!expected.gender) return matchesAnswer(actual, expected.spanish);
  const { article, noun } = vocabPresentation(expected);
  return matchesAnswer(actual, noun) || matchesAnswer(actual, `${article} ${noun}`);
}

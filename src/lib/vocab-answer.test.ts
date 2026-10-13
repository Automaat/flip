import { describe, expect, it } from "vitest";
import { matchesVocabAnswer, vocabPresentation } from "./vocab-answer";

describe("vocabulary presentation", () => {
  it.each([
    ["el año", "m", "el", "año"],
    ["la cabeza", "f", "la", "cabeza"],
    ["los zapatos", "m", "los", "zapatos"],
    ["las gafas", "f", "las", "gafas"],
    ["el agua", "f", "el", "agua"],
    ["el aula", "f", "el", "aula"],
    ["agua", "f", "el", "agua"],
    ["aula", "f", "el", "aula"],
    ["amiga", "f", "la", "amiga"],
    [" EL   AÑO ", "m", "el", "AÑO"],
  ] as const)("renders %s with one article", (spanish, gender, article, noun) => {
    expect(vocabPresentation({ spanish, gender })).toEqual({ article, noun });
  });

  it.each(["el año pasado", "la semana va bien", "una vez"])(
    "preserves the phrase %s without gender", (spanish) => {
      expect(vocabPresentation({ spanish })).toEqual({ article: null, noun: spanish });
    },
  );
});

describe("productive vocabulary answers", () => {
  it.each([
    ["año", "el año", "m", true],
    ["el año", "el año", "m", true],
    ["la año", "el año", "m", false],
    ["ano", "el año", "m", false],
    ["gafas", "las gafas", "f", true],
    ["las gafas", "las gafas", "f", true],
    ["la gafas", "las gafas", "f", false],
    ["zapatos", "los zapatos", "m", true],
    ["los zapatos", "los zapatos", "m", true],
    ["el zapatos", "los zapatos", "m", false],
    ["agua", "el agua", "f", true],
    ["el agua", "agua", "f", true],
    ["la agua", "agua", "f", false],
    ["aula", "el aula", "f", true],
    ["el aula", "el aula", "f", true],
    ["la aula", "el aula", "f", false],
    ["cabeza", "cabeza", "f", true],
    ["la cabeza", "cabeza", "f", true],
    ["el cabeza", "cabeza", "f", false],
    [" EL ARBOL ", "el árbol", "m", true],
  ] as const)("checks %s against %s", (actual, spanish, gender, correct) => {
    expect(matchesVocabAnswer(actual, { spanish, gender })).toBe(correct);
  });

  it.each([
    ["el año pasado", "el año pasado", true],
    ["año pasado", "el año pasado", false],
    ["semana va bien", "la semana va bien", false],
    ["vez", "una vez", false],
    ["el agua", "agua", false],
  ] as const)("checks phrases without gender exactly", (actual, spanish, correct) => {
    expect(matchesVocabAnswer(actual, { spanish })).toBe(correct);
  });
});

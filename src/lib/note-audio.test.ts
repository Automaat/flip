import { describe, expect, it } from "vitest";
import { audioTextsFor } from "./note-audio";

describe("audioTextsFor", () => {
  it("vocab: word = spanish, sentence = example", () => {
    const r = audioTextsFor("vocab", {
      spanish: "hola",
      example: "Hola, ¿cómo estás?",
    });
    expect(r.word).toBe("hola");
    expect(r.sentence).toBe("Hola, ¿cómo estás?");
  });

  it("false_friend: same as vocab shape", () => {
    const r = audioTextsFor("false_friend", {
      spanish: "embarazada",
      example: "Mi hermana está embarazada.",
    });
    expect(r.word).toBe("embarazada");
    expect(r.sentence).toBe("Mi hermana está embarazada.");
  });

  it("cognate vocab without example only has word", () => {
    const r = audioTextsFor("vocab", { spanish: "nación" });
    expect(r.word).toBe("nación");
    expect(r.sentence).toBeUndefined();
  });

  it("cloze: word = answer, sentence = full sentence (blank filled)", () => {
    const r = audioTextsFor("cloze", {
      sentence: "Yo ___ de México.",
      answer: "soy",
    });
    expect(r.word).toBe("soy");
    expect(r.sentence).toBe("Yo soy de México.");
  });

  it("cloze without answer returns word=undefined", () => {
    const r = audioTextsFor("cloze", { sentence: "Yo ___ aquí." });
    expect(r.word).toBeUndefined();
    expect(r.sentence).toBeUndefined();
  });
});

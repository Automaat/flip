import { describe, expect, it } from "vitest";
import { audioKey, audioUrl, VOICES } from "./tts";

describe("audioKey", () => {
  const voice = VOICES.mxFemale!;

  it("is deterministic for same text + voice", () => {
    expect(audioKey("hola", voice)).toBe(audioKey("hola", voice));
  });

  it("differs across texts", () => {
    expect(audioKey("hola", voice)).not.toBe(audioKey("adiós", voice));
  });

  it("differs across voices", () => {
    expect(audioKey("hola", VOICES.mxFemale!)).not.toBe(audioKey("hola", VOICES.mxMale!));
  });

  it("includes voice short prefix", () => {
    expect(audioKey("hola", voice).startsWith(`${voice.short}-`)).toBe(true);
  });

  it("uses .mp3 extension", () => {
    expect(audioKey("hola", voice).endsWith(".mp3")).toBe(true);
  });
});

describe("audioUrl", () => {
  it("prefixes with /audio/", () => {
    const voice = VOICES.mxFemale!;
    expect(audioUrl("hola", voice)).toBe(`/audio/${audioKey("hola", voice)}`);
  });
});

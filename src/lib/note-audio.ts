import { eq } from "drizzle-orm";
import { audioUrl, generateAudio, VOICES, type Voice } from "./tts";
import { notes } from "@/db/schema";
import type { DB } from "@/db/client";

export type AudioPair = { word?: string; example?: string };

type GenericFields = {
  spanish?: string;
  example?: string;
  sentence?: string;
  answer?: string;
  audio?: AudioPair;
} & Record<string, unknown>;

/** Pick the canonical word + sentence text from any note shape. */
export function audioTextsFor(noteType: string, fields: GenericFields): {
  word?: string;
  sentence?: string;
} {
  if (noteType === "cloze") {
    const fullSentence =
      fields.sentence && fields.answer
        ? fields.sentence.replace(/___/, fields.answer)
        : undefined;
    return { word: fields.answer, sentence: fullSentence };
  }
  return { word: fields.spanish, sentence: fields.example };
}

export type AudioGenStats = { generated: number; cached: number; updated: number };

/**
 * For each note in the list (or all notes if `db.select()` used), ensure audio
 * files exist and the note's `fields.audio` is populated. Idempotent.
 */
export async function ensureAudioForNotes(
  db: DB,
  noteRows: { id: string; noteType: string; fields: unknown }[],
  voice: Voice = VOICES.mxFemale!,
): Promise<AudioGenStats> {
  const stats: AudioGenStats = { generated: 0, cached: 0, updated: 0 };
  for (const row of noteRows) {
    const f = (row.fields ?? {}) as GenericFields;
    const { word, sentence } = audioTextsFor(row.noteType, f);
    if (!word && !sentence) continue;

    const audio: AudioPair = {};
    if (word) {
      const r = await generateAudio(word, voice);
      if (r.cached) stats.cached++;
      else stats.generated++;
      audio.word = audioUrl(word, voice);
    }
    if (sentence) {
      const r = await generateAudio(sentence, voice);
      if (r.cached) stats.cached++;
      else stats.generated++;
      audio.example = audioUrl(sentence, voice);
    }

    const next: GenericFields = { ...f, audio };
    await db.update(notes).set({ fields: next }).where(eq(notes.id, row.id));
    stats.updated++;
  }
  return stats;
}

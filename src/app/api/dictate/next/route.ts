import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";
import { db } from "@/db/client";
import { notes } from "@/db/schema";

export const dynamic = "force-dynamic";

type AudioField = { word?: string; example?: string };
type Fields = {
  example?: string;
  sentence?: string;
  answer?: string;
  exampleEnglish?: string;
  sentenceEnglish?: string;
  audio?: AudioField;
};

export async function GET() {
  // Pick a random note that has an audio.example URL.
  const rows = await db
    .select({
      id: notes.id,
      noteType: notes.noteType,
      fields: notes.fields,
    })
    .from(notes)
    .where(sql`${notes.fields}->'audio'->>'example' IS NOT NULL`)
    .orderBy(sql`random()`)
    .limit(1);

  if (rows.length === 0) {
    return NextResponse.json({ item: null });
  }
  const row = rows[0]!;
  const f = (row.fields ?? {}) as Fields;
  const expected =
    row.noteType === "cloze" && f.sentence && f.answer
      ? f.sentence.replace(/___/, f.answer)
      : (f.example ?? "");
  const audioUrl = f.audio?.example;
  if (!audioUrl || !expected) {
    return NextResponse.json({ item: null });
  }
  return NextResponse.json({
    item: {
      id: row.id,
      audioUrl,
      expected,
      translation: f.exampleEnglish ?? f.sentenceEnglish ?? null,
    },
  });
}

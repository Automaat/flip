import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import * as schema from "./schema";
import { audioUrl, generateAudio, VOICES } from "../lib/tts";

type VocabFields = {
  spanish: string;
  english: string;
  example?: string;
  exampleEnglish?: string;
  gender?: "m" | "f";
  audio?: { word: string; example?: string };
};

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL not set");
  const sql = postgres(url, { max: 1 });
  const db = drizzle(sql, { schema });
  const voice = VOICES.mxFemale!;

  const rows = await db
    .select({ id: schema.notes.id, fields: schema.notes.fields })
    .from(schema.notes)
    .where(eq(schema.notes.noteType, "vocab"));

  let generated = 0;
  let cached = 0;
  for (const row of rows) {
    const f = row.fields as VocabFields;
    if (!f.spanish) continue;

    const wordRes = await generateAudio(f.spanish, voice);
    if (wordRes.cached) cached++;
    else generated++;

    let exampleAudioUrl: string | undefined;
    if (f.example) {
      const exRes = await generateAudio(f.example, voice);
      if (exRes.cached) cached++;
      else generated++;
      exampleAudioUrl = audioUrl(f.example, voice);
    }

    const updated: VocabFields = {
      ...f,
      audio: {
        word: audioUrl(f.spanish, voice),
        ...(exampleAudioUrl ? { example: exampleAudioUrl } : {}),
      },
    };
    await db.update(schema.notes).set({ fields: updated }).where(eq(schema.notes.id, row.id));
  }

  console.log(`✓ audio: ${generated} new, ${cached} cached (${rows.length} notes)`);
  await sql.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

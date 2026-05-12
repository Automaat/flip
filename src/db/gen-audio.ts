import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import { ensureAudioForNotes } from "../lib/note-audio";
import { VOICES } from "../lib/tts";

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL not set");
  const sql = postgres(url, { max: 1 });
  const db = drizzle(sql, { schema });
  const voice = VOICES.mxFemale!;

  const rows = await db
    .select({ id: schema.notes.id, noteType: schema.notes.noteType, fields: schema.notes.fields })
    .from(schema.notes);

  const stats = await ensureAudioForNotes(db, rows, voice);
  console.log(
    `✓ audio: ${stats.generated} new, ${stats.cached} cached, ${stats.updated} notes updated`,
  );
  await sql.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

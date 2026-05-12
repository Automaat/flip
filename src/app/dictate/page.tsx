import Link from "next/link";
import { sql } from "drizzle-orm";
import { db } from "@/db/client";
import { notes } from "@/db/schema";
import { DictateClient, type DictateItem } from "./dictate-client";

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

async function fetchNextItem(): Promise<DictateItem | null> {
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
  if (rows.length === 0) return null;
  const row = rows[0]!;
  const f = (row.fields ?? {}) as Fields;
  const expected =
    row.noteType === "cloze" && f.sentence && f.answer
      ? f.sentence.replace(/___/, f.answer)
      : (f.example ?? "");
  const audioUrl = f.audio?.example;
  if (!audioUrl || !expected) return null;
  return {
    id: row.id,
    audioUrl,
    expected,
    translation: f.exampleEnglish ?? f.sentenceEnglish ?? null,
  };
}

export default async function DictatePage() {
  const item = await fetchNextItem();
  return (
    <main className="flex flex-1 flex-col items-center px-6 py-12">
      <div className="w-full max-w-md flex flex-col gap-6">
        <header className="text-center">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">Dictation</h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Listen and type what you hear. Accents and punctuation are ignored.
          </p>
        </header>

        <DictateClient key={item?.id ?? "empty"} item={item} />

        <div className="text-center">
          <Link
            href="/"
            className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            ← back
          </Link>
        </div>
      </div>
    </main>
  );
}

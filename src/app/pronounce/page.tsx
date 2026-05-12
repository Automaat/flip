import Link from "next/link";
import { sql } from "drizzle-orm";
import { db } from "@/db/client";
import { notes } from "@/db/schema";
import { PronounceClient, type PronounceItem } from "./pronounce-client";

export const dynamic = "force-dynamic";

type Fields = {
  example?: string;
  sentence?: string;
  answer?: string;
  audio?: { word?: string; example?: string };
};

async function fetchItem(): Promise<PronounceItem | null> {
  const rows = await db
    .select({ id: notes.id, noteType: notes.noteType, fields: notes.fields })
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
  if (!expected || !audioUrl) return null;
  return { id: row.id, seed: Math.random().toString(36).slice(2), audioUrl, expected };
}

export default async function PronouncePage() {
  const item = await fetchItem();
  return (
    <main className="flex flex-1 flex-col items-center px-6 py-12">
      <div className="w-full max-w-md flex flex-col gap-6">
        <header className="text-center">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">Pronounce</h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Listen to a sentence, then say it back. Browser speech recognition scores you.
          </p>
        </header>

        <PronounceClient key={item?.seed ?? "empty"} item={item} />

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

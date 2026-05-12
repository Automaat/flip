import Link from "next/link";
import { sql } from "drizzle-orm";
import { db } from "@/db/client";
import { notes } from "@/db/schema";
import { TranslateClient, type TranslateItem } from "./translate-client";

export const dynamic = "force-dynamic";

type Fields = {
  example?: string;
  exampleEnglish?: string;
  sentence?: string;
  answer?: string;
  sentenceEnglish?: string;
};

async function fetchPair(): Promise<TranslateItem | null> {
  const rows = await db
    .select({ id: notes.id, noteType: notes.noteType, fields: notes.fields })
    .from(notes)
    .where(
      sql`(${notes.fields} ? 'example' AND ${notes.fields} ? 'exampleEnglish')
         OR (${notes.fields} ? 'sentence' AND ${notes.fields} ? 'answer' AND ${notes.fields} ? 'sentenceEnglish')`,
    )
    .orderBy(sql`random()`)
    .limit(1);
  if (rows.length === 0) return null;
  const row = rows[0]!;
  const f = (row.fields ?? {}) as Fields;
  const expectedEs =
    row.noteType === "cloze" && f.sentence && f.answer
      ? f.sentence.replace(/___/, f.answer)
      : (f.example ?? "");
  const promptEn = f.sentenceEnglish ?? f.exampleEnglish ?? "";
  if (!expectedEs || !promptEn) return null;
  return { id: row.id, seed: Math.random().toString(36).slice(2), promptEn, expectedEs };
}

export default async function TranslatePage() {
  const item = await fetchPair();
  return (
    <main className="flex flex-1 flex-col items-center px-6 py-12">
      <div className="w-full max-w-md flex flex-col gap-6">
        <header className="text-center">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">Translate</h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Translate the English sentence into Spanish. Per-word scoring.
          </p>
        </header>

        <TranslateClient key={item?.seed ?? "empty"} item={item} />

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

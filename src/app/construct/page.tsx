import Link from "next/link";
import { sql } from "drizzle-orm";
import { db } from "@/db/client";
import { notes } from "@/db/schema";
import { ConstructClient, type ConstructItem } from "./construct-client";

export const dynamic = "force-dynamic";

type Fields = {
  spanish?: string;
  english?: string;
  example?: string;
  exampleEnglish?: string;
  sentence?: string;
  answer?: string;
  sentenceEnglish?: string;
};

async function fetchRandomSentence(): Promise<ConstructItem | null> {
  // Prefer cloze sentences (always whole sentences), fallback to vocab example.
  const rows = await db
    .select({
      id: notes.id,
      noteType: notes.noteType,
      fields: notes.fields,
    })
    .from(notes)
    .where(
      sql`(${notes.noteType} = 'cloze' AND ${notes.fields} ? 'sentence' AND ${notes.fields} ? 'answer')
         OR (${notes.fields} ? 'example')`,
    )
    .orderBy(sql`random()`)
    .limit(1);
  if (rows.length === 0) return null;
  const row = rows[0]!;
  const f = (row.fields ?? {}) as Fields;
  const expected =
    row.noteType === "cloze" && f.sentence && f.answer
      ? f.sentence.replace(/___/, f.answer)
      : (f.example ?? "");
  if (!expected) return null;
  return {
    id: row.id,
    seed: Math.floor(Math.random() * 1_000_000_000),
    expected,
    translation: f.exampleEnglish ?? f.sentenceEnglish ?? null,
  };
}

export default async function ConstructPage() {
  const item = await fetchRandomSentence();
  return (
    <main className="flex flex-1 flex-col items-center px-6 py-12">
      <div className="w-full max-w-md flex flex-col gap-6">
        <header className="text-center">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">Construct</h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Arrange shuffled words into a correct Spanish sentence.
          </p>
        </header>

        <ConstructClient key={`${item?.id ?? "empty"}-${item?.seed ?? 0}`} item={item} />

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

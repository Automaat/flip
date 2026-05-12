import Link from "next/link";
import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { decks } from "@/db/schema";
import { IRREGULAR_VERBS_PRESENT, PERSONS } from "@/data/verbs";
import { VerbsClient } from "./verbs-client";

export const dynamic = "force-dynamic";

const DECK_NAME = "Present Indicative — Irregulars";

export default async function VerbsPage() {
  const existing = await db.select().from(decks).where(eq(decks.name, DECK_NAME));
  const imported = existing.length > 0;

  return (
    <main className="flex flex-1 flex-col items-center px-6 py-12">
      <div className="w-full max-w-3xl flex flex-col gap-6">
        <header className="text-center">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">Verbs</h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            14 essential irregulars — present indicative. Latin-American persons (no vosotros).
          </p>
        </header>

        <VerbsClient alreadyImported={imported} cardCount={IRREGULAR_VERBS_PRESENT.length * PERSONS.length} />

        <div className="overflow-x-auto rounded-lg border border-zinc-300 dark:border-zinc-700">
          <table className="w-full text-sm">
            <thead className="bg-zinc-100 dark:bg-zinc-900">
              <tr>
                <th className="px-3 py-2 text-left">infinitive</th>
                {PERSONS.map((p) => (
                  <th key={p} className="px-3 py-2 text-left font-normal text-zinc-500">
                    {p}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {IRREGULAR_VERBS_PRESENT.map((v) => (
                <tr key={v.infinitive}>
                  <td className="px-3 py-2">
                    <div className="font-semibold">{v.infinitive}</div>
                    <div className="text-xs text-zinc-500">{v.english}</div>
                  </td>
                  {PERSONS.map((p) => (
                    <td key={p} className="px-3 py-2 font-mono">
                      {v.forms[p]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

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

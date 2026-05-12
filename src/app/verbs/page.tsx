import Link from "next/link";
import { inArray } from "drizzle-orm";
import { db } from "@/db/client";
import { decks } from "@/db/schema";
import {
  IRREGULAR_VERBS_PRESENT,
  IRREGULAR_VERBS_PRETERITE,
  PERSONS,
  type Tense,
  type VerbConjugation,
} from "@/data/verbs";
import { VerbsClient } from "./verbs-client";

export const dynamic = "force-dynamic";

const DECK_NAMES: Record<Tense, string> = {
  present: "Present Indicative — Irregulars",
  preterite: "Preterite — Irregulars",
};

type Props = { searchParams: Promise<{ tense?: string }> };

export default async function VerbsPage({ searchParams }: Props) {
  const sp = await searchParams;
  const tense: Tense = sp?.tense === "preterite" ? "preterite" : "present";
  const table: VerbConjugation[] =
    tense === "preterite" ? IRREGULAR_VERBS_PRETERITE : IRREGULAR_VERBS_PRESENT;

  const importedDecks = await db
    .select({ name: decks.name })
    .from(decks)
    .where(inArray(decks.name, Object.values(DECK_NAMES)));
  const importedNames = new Set(importedDecks.map((d) => d.name));
  const imported = importedNames.has(DECK_NAMES[tense]);

  return (
    <main className="flex flex-1 flex-col items-center px-6 py-12">
      <div className="w-full max-w-3xl flex flex-col gap-6">
        <header className="text-center">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">Verbs</h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            14 essential irregulars × 5 LATAM persons. Switch tenses below.
          </p>
        </header>

        <nav className="flex justify-center gap-2">
          <TenseLink
            href={{ pathname: "/verbs", query: { tense: "present" } }}
            active={tense === "present"}
            label="Present"
          />
          <TenseLink
            href={{ pathname: "/verbs", query: { tense: "preterite" } }}
            active={tense === "preterite"}
            label="Preterite"
          />
        </nav>

        <VerbsClient
          alreadyImported={imported}
          cardCount={table.length * PERSONS.length}
          tense={tense}
        />

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
              {table.map((v) => (
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

function TenseLink({
  href,
  active,
  label,
}: {
  href: { pathname: "/verbs"; query: { tense: Tense } };
  active: boolean;
  label: string;
}) {
  const cls = active
    ? "bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900"
    : "border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-900";
  return (
    <Link href={href} className={`rounded-full px-4 py-2 text-sm font-medium ${cls}`}>
      {label}
    </Link>
  );
}

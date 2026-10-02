import Link from "next/link";
import { eq, sql } from "drizzle-orm";
import { db } from "@/db/client";
import { cards, decks } from "@/db/schema";
import { PERSONS, TENSE_LABELS, TENSES, type Tense, type VerbGroup } from "@/data/verbs";
import { verbDeckName, verbTable } from "@/lib/conjugate";
import { VerbsClient } from "./verbs-client";

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ tense?: string; group?: string }> };

function parseTense(raw: string | undefined): Tense {
  return TENSES.find((t) => t === raw) ?? "present";
}

function parseGroup(raw: string | undefined): VerbGroup {
  return raw === "regular" ? "regular" : "irregular";
}

export default async function VerbsPage({ searchParams }: Props) {
  const sp = await searchParams;
  const tense = parseTense(sp?.tense);
  const group = parseGroup(sp?.group);
  const table = verbTable(group, tense);

  const cardCount = table.length * PERSONS.length;
  const [deckCards] = await db
    .select({ count: sql<number>`count(${cards.id})::int` })
    .from(decks)
    .leftJoin(cards, eq(cards.deckId, decks.id))
    .where(eq(decks.name, verbDeckName(group, tense)));
  const complete = (deckCards?.count ?? 0) >= cardCount;

  return (
    <main className="flex flex-1 flex-col items-center px-6 py-12">
      <div className="w-full max-w-3xl flex flex-col gap-6">
        <header className="text-center">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">Verbs</h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            {table.length} {group} verbs × {PERSONS.length} persons. Switch tenses below.
          </p>
        </header>

        <Link
          href="/verbs/drill"
          className="self-center rounded-full bg-emerald-600 text-white px-5 py-2 text-sm font-medium hover:opacity-90"
        >
          Conjugation drill →
        </Link>

        <nav aria-label="verb group" className="flex flex-wrap justify-center gap-2">
          {(["irregular", "regular"] as const).map((g) => (
            <PillLink
              key={g}
              href={{ pathname: "/verbs", query: { tense, group: g } }}
              active={group === g}
              label={g === "irregular" ? "Irregular" : "Regular"}
            />
          ))}
        </nav>

        <nav aria-label="tense" className="flex flex-wrap justify-center gap-2">
          {TENSES.map((t) => (
            <PillLink
              key={t}
              href={{ pathname: "/verbs", query: { tense: t, group } }}
              active={tense === t}
              label={TENSE_LABELS[t]}
            />
          ))}
        </nav>

        <VerbsClient
          key={`${group}-${tense}`}
          alreadyImported={complete}
          cardCount={cardCount}
          tense={tense}
          group={group}
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
                    <td key={p} className="px-3 py-2 font-mono whitespace-nowrap">
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

function PillLink({
  href,
  active,
  label,
}: {
  href: { pathname: "/verbs"; query: { tense: Tense; group: VerbGroup } };
  active: boolean;
  label: string;
}) {
  const cls = active
    ? "bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900"
    : "border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-900";
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`rounded-full px-4 py-2 text-sm font-medium ${cls}`}
    >
      {label}
    </Link>
  );
}

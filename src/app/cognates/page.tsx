import Link from "next/link";
import { inArray } from "drizzle-orm";
import { db } from "@/db/client";
import { decks } from "@/db/schema";
import { COGNATE_RULES } from "@/data/cognate-rules";

export const dynamic = "force-dynamic";

const DECK_PREFIX = "Cognates: ";

async function fetchUnlocked(): Promise<Set<string>> {
  const names = COGNATE_RULES.map((r) => DECK_PREFIX + r.id);
  const rows = await db
    .select({ name: decks.name })
    .from(decks)
    .where(inArray(decks.name, names));
  return new Set(rows.map((r) => r.name.replace(DECK_PREFIX, "")));
}

export default async function CognatesPage() {
  const unlocked = await fetchUnlocked();
  return (
    <main className="flex flex-1 flex-col items-center px-6 py-12">
      <div className="w-full max-w-2xl flex flex-col gap-6">
        <header className="text-center">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">Cognates</h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Spanish words you already know. Learn one ending rule, unlock hundreds of words.
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {COGNATE_RULES.map((r) => {
            const done = unlocked.has(r.id);
            return (
              <Link
                key={r.id}
                href={`/cognates/${r.id}`}
                className={`rounded-lg border p-4 transition ${
                  done
                    ? "border-emerald-500/40 bg-emerald-500/5 hover:bg-emerald-500/10"
                    : "border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="font-mono text-sm">
                    <span className="text-zinc-500">{r.enSuffix}</span>
                    <span className="mx-1 text-zinc-400">→</span>
                    <span className="text-zinc-900 dark:text-zinc-100">{r.esSuffix}</span>
                  </div>
                  {done && <span className="text-xs text-emerald-500">✓ unlocked</span>}
                </div>
                <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">{r.description}</p>
                <p className="mt-2 text-sm">
                  <span className="text-zinc-500">{r.examples[0]!.en}</span>{" "}
                  <span className="text-zinc-400">→</span>{" "}
                  <span className="text-zinc-900 dark:text-zinc-100">{r.examples[0]!.es}</span>
                </p>
              </Link>
            );
          })}
        </div>

        <div className="text-center">
          <Link href="/" className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100">
            ← back
          </Link>
        </div>
      </div>
    </main>
  );
}

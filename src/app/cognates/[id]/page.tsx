import { notFound } from "next/navigation";
import Link from "next/link";
import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { decks } from "@/db/schema";
import { findRule } from "@/data/cognate-rules";
import { CognateClient } from "./cognate-client";

export const dynamic = "force-dynamic";

const DECK_PREFIX = "Cognates: ";

export default async function CognateRulePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const rule = findRule(id);
  if (!rule) notFound();

  const existing = await db
    .select()
    .from(decks)
    .where(eq(decks.name, DECK_PREFIX + rule.id));
  const unlocked = existing.length > 0;

  return (
    <main className="flex flex-1 flex-col items-center px-6 py-12">
      <div className="w-full max-w-md flex flex-col gap-6">
        <header className="text-center">
          <Link
            href="/cognates"
            className="text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            ← all rules
          </Link>
          <h1 className="mt-2 font-mono text-3xl">
            <span className="text-zinc-500">{rule.enSuffix}</span>
            <span className="mx-2 text-zinc-400">→</span>
            <span className="text-zinc-900 dark:text-zinc-100">{rule.esSuffix}</span>
          </h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{rule.description}</p>
          {rule.notes && (
            <p className="mt-1 text-xs text-zinc-500 italic">{rule.notes}</p>
          )}
        </header>

        <section className="rounded-lg bg-zinc-100 dark:bg-zinc-900 p-4">
          <p className="text-xs uppercase tracking-wide text-zinc-500 mb-2">Examples</p>
          <ul className="space-y-1 text-sm">
            {rule.examples.map((e) => (
              <li key={e.es} className="flex justify-between">
                <span className="text-zinc-500">{e.en}</span>
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">{e.es}</span>
              </li>
            ))}
          </ul>
        </section>

        <CognateClient rule={rule} alreadyUnlocked={unlocked} />
      </div>
    </main>
  );
}

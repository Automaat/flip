"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { GenderEntry } from "@/data/gender-exceptions";

export function GenderClient({
  alreadyImported,
  total,
  exceptions,
}: {
  alreadyImported: boolean;
  total: number;
  exceptions: GenderEntry[];
}) {
  const router = useRouter();
  const [imported, setImported] = useState(alreadyImported);
  const [created, setCreated] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function importDeck() {
    setError(null);
    const res = await fetch("/api/gender/import", { method: "POST" });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "import failed");
      return;
    }
    setImported(true);
    setCreated(data.cardsCreated);
    startTransition(() => router.refresh());
  }

  return (
    <>
      {imported ? (
        <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/40 p-4 text-center">
          <p className="text-sm text-emerald-600 dark:text-emerald-400">
            ✓ Deck imported{created !== null && ` (${created} cards)`}
          </p>
          <Link
            href="/review"
            className="mt-3 inline-flex rounded-full bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 px-4 py-2 text-sm hover:opacity-90"
          >
            Review now
          </Link>
        </div>
      ) : (
        <div className="rounded-lg border border-zinc-300 dark:border-zinc-700 p-4 text-center">
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">
            Add {total} tricky-gender nouns (el problema, la mano, …) to your review queue.
          </p>
          <button
            type="button"
            onClick={importDeck}
            disabled={isPending}
            className="rounded-full bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 px-5 py-2 text-sm hover:opacity-90 disabled:opacity-50"
          >
            {isPending ? "Importing…" : "Add to my decks"}
          </button>
          {error && <p className="mt-2 text-sm text-rose-500">{error}</p>}
        </div>
      )}

      <section className="space-y-2">
        <h2 className="text-xs uppercase tracking-wide text-zinc-500">Exceptions</h2>
        <ul className="rounded-lg border border-zinc-300 dark:border-zinc-700 divide-y divide-zinc-200 dark:divide-zinc-800">
          {exceptions.map((e) => (
            <li key={e.spanish} className="p-3 flex items-baseline justify-between gap-3">
              <div className="min-w-0">
                <span className={e.gender === "m" ? "text-sky-500" : "text-rose-500"}>
                  {e.gender === "m" ? "el" : "la"}
                </span>{" "}
                <span className="font-semibold">{e.spanish}</span>
                <span className="text-zinc-500"> — {e.english}</span>
                <p className="text-xs text-zinc-500 mt-1">{e.trickReason}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

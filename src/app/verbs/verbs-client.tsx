"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function VerbsClient({
  alreadyImported,
  cardCount,
  tense,
}: {
  alreadyImported: boolean;
  cardCount: number;
  tense: "present" | "preterite";
}) {
  const router = useRouter();
  const [imported, setImported] = useState(alreadyImported);
  const [created, setCreated] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function importDeck() {
    setError(null);
    const res = await fetch("/api/verbs/import", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ tense }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "import failed");
      return;
    }
    setImported(true);
    setCreated(data.cardsCreated);
    startTransition(() => router.refresh());
  }

  if (imported) {
    return (
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
    );
  }

  return (
    <div className="rounded-lg border border-zinc-300 dark:border-zinc-700 p-4 text-center">
      <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">
        Add {cardCount} cloze cards (one per verb × person) to your queue.
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
  );
}

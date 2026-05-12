"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { constructTokens, isConstructionCorrect, shuffle } from "@/lib/construct";

export type ConstructItem = {
  id: string;
  seed: number;
  expected: string;
  translation: string | null;
};

export function ConstructClient({ item }: { item: ConstructItem | null }) {
  const router = useRouter();
  const [picked, setPicked] = useState<number[]>([]);
  const [result, setResult] = useState<"correct" | "wrong" | null>(null);
  const [isPending, startTransition] = useTransition();

  const expectedTokens = useMemo(() => (item ? constructTokens(item.expected) : []), [item]);
  const pool = useMemo(
    () => (item ? shuffle(expectedTokens, item.seed) : []),
    [item, expectedTokens],
  );

  if (!item) {
    return (
      <p className="text-center text-zinc-500">
        No example sentences available yet. Import some decks first.
      </p>
    );
  }

  function pick(i: number) {
    if (picked.includes(i)) return;
    setPicked([...picked, i]);
  }

  function unpick(idxInPicked: number) {
    setPicked(picked.filter((_, j) => j !== idxInPicked));
  }

  function check() {
    const given = picked.map((i) => pool[i]!);
    setResult(isConstructionCorrect(expectedTokens, given) ? "correct" : "wrong");
  }

  function next() {
    startTransition(() => router.refresh());
  }

  return (
    <section className="rounded-lg border border-zinc-300 dark:border-zinc-700 p-6 flex flex-col gap-5">
      {item.translation && (
        <p className="text-sm italic text-zinc-500 text-center">{item.translation}</p>
      )}

      <div className="min-h-[3rem] rounded border border-dashed border-zinc-300 dark:border-zinc-700 p-3 flex flex-wrap gap-2 justify-center">
        {picked.length === 0 ? (
          <span className="text-xs text-zinc-400 italic">click words below in order…</span>
        ) : (
          picked.map((i, j) => (
            <button
              key={`p${j}`}
              type="button"
              onClick={() => unpick(j)}
              disabled={result !== null}
              className="rounded bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 px-3 py-1 text-sm"
            >
              {pool[i]}
            </button>
          ))
        )}
      </div>

      <div className="flex flex-wrap gap-2 justify-center">
        {pool.map((tok, i) => {
          const isUsed = picked.includes(i);
          return (
            <button
              key={`pool${i}`}
              type="button"
              onClick={() => pick(i)}
              disabled={isUsed || result !== null}
              className={`rounded border px-3 py-1 text-sm ${
                isUsed
                  ? "opacity-40 border-zinc-300 dark:border-zinc-700"
                  : "border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-900"
              }`}
            >
              {tok}
            </button>
          );
        })}
      </div>

      {result && (
        <div className="text-center">
          {result === "correct" ? (
            <p className="text-emerald-500 text-lg font-semibold">✓ correct!</p>
          ) : (
            <>
              <p className="text-rose-500 text-lg font-semibold">✗ not quite</p>
              <p className="mt-1 text-sm">
                <span className="text-zinc-500">expected:</span> {item.expected}
              </p>
            </>
          )}
        </div>
      )}

      <div className="flex justify-between gap-2">
        <button
          type="button"
          onClick={() => setPicked([])}
          disabled={result !== null}
          className="rounded-full border border-zinc-300 dark:border-zinc-700 px-4 py-2 text-sm disabled:opacity-50"
        >
          Clear
        </button>
        {result === null ? (
          <button
            type="button"
            onClick={check}
            disabled={picked.length === 0}
            className="rounded-full bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 px-5 py-2 text-sm disabled:opacity-50"
          >
            Check
          </button>
        ) : (
          <button
            type="button"
            onClick={next}
            disabled={isPending}
            className="rounded-full bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 px-5 py-2 text-sm disabled:opacity-50"
          >
            Next
          </button>
        )}
      </div>
    </section>
  );
}

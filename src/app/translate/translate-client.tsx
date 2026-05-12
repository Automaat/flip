"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { scoreDictation, type DictationScore } from "@/lib/dictation";

export type TranslateItem = {
  id: string;
  seed: string;
  promptEn: string;
  expectedEs: string;
};

export function TranslateClient({ item }: { item: TranslateItem | null }) {
  const router = useRouter();
  const [input, setInput] = useState("");
  const [score, setScore] = useState<DictationScore | null>(null);
  const [isPending, startTransition] = useTransition();

  if (!item) {
    return (
      <p className="text-center text-zinc-500">
        No parallel sentences in the DB yet. Import some decks to populate examples.
      </p>
    );
  }

  function check() {
    setScore(scoreDictation(item!.expectedEs, input));
  }

  function next() {
    startTransition(() => router.refresh());
  }

  return (
    <section className="rounded-lg border border-zinc-300 dark:border-zinc-700 p-6 flex flex-col gap-4">
      <div className="text-center">
        <div className="text-xs uppercase tracking-wide text-zinc-500">English</div>
        <p className="mt-1 text-xl font-medium">{item.promptEn}</p>
      </div>

      {!score ? (
        <>
          <input
            autoFocus
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") check();
            }}
            placeholder="type Spanish translation"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            className="w-full rounded border border-zinc-300 dark:border-zinc-700 bg-transparent px-4 py-3 text-center text-lg outline-none focus:ring-2 focus:ring-zinc-500/40"
          />
          <div className="flex justify-end">
            <button
              type="button"
              onClick={check}
              disabled={!input.trim()}
              className="rounded-full bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 px-5 py-2 text-sm disabled:opacity-50"
            >
              Check (enter)
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="text-center text-3xl font-bold">
            {score.correctCount}
            <span className="text-zinc-500">/</span>
            {score.expectedCount}
            <span className="ml-2 text-sm text-zinc-500">({score.percent}%)</span>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-zinc-500 mb-1">expected</p>
            <p className="text-lg">
              {score.expected.map((t, i) => (
                <span
                  key={i}
                  className={
                    t.status === "correct"
                      ? "text-emerald-500"
                      : t.status === "missing"
                        ? "text-amber-500 underline decoration-dotted"
                        : "text-rose-500"
                  }
                >
                  {t.token}{" "}
                </span>
              ))}
            </p>
          </div>
          <button
            type="button"
            onClick={next}
            disabled={isPending}
            className="self-end rounded-full bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 px-5 py-2 text-sm"
          >
            Next
          </button>
        </>
      )}
    </section>
  );
}

"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

type Rating = "again" | "hard" | "good" | "easy";

export type ReviewCard = {
  id: string;
  state: "new" | "learning" | "review" | "relearning";
  due: string;
  reps: number;
  lapses: number;
  noteType: string;
  fields: {
    spanish: string;
    english: string;
    example?: string;
    exampleEnglish?: string;
    gender?: "m" | "f";
  };
};

type Counts = { new: number; learning: number; review: number; relearning: number };

const RATING_BUTTONS: { rating: Rating; label: string; key: string; cls: string }[] = [
  { rating: "again", label: "Again", key: "1", cls: "bg-rose-500 hover:bg-rose-600" },
  { rating: "hard", label: "Hard", key: "2", cls: "bg-amber-500 hover:bg-amber-600" },
  { rating: "good", label: "Good", key: "3", cls: "bg-emerald-500 hover:bg-emerald-600" },
  { rating: "easy", label: "Easy", key: "4", cls: "bg-sky-500 hover:bg-sky-600" },
];

export function ReviewClient({ card, counts }: { card: ReviewCard | null; counts: Counts }) {
  const router = useRouter();
  const [revealed, setRevealed] = useState(false);
  const [isPending, startTransition] = useTransition();
  const startedAt = useRef<number | null>(null);

  useEffect(() => {
    startedAt.current = performance.now();
  }, []);

  const rate = useCallback(
    async (rating: Rating) => {
      if (!card) return;
      const start = startedAt.current ?? performance.now();
      const durationMs = Math.round(performance.now() - start);
      await fetch("/api/review/rate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ cardId: card.id, rating, durationMs }),
      });
      startTransition(() => router.refresh());
    },
    [card, router],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!card || isPending) return;
      if (!revealed) {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          setRevealed(true);
        }
        return;
      }
      const btn = RATING_BUTTONS.find((b) => b.key === e.key);
      if (btn) {
        e.preventDefault();
        void rate(btn.rating);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [card, revealed, isPending, rate]);

  if (!card) {
    return (
      <div className="text-center max-w-md">
        <h1 className="text-2xl font-semibold mb-2">All done</h1>
        <p className="text-zinc-500">No cards due. Come back later.</p>
        <CountsBar counts={counts} />
      </div>
    );
  }

  const genderArticle =
    card.fields.gender === "m" ? "el" : card.fields.gender === "f" ? "la" : null;
  const genderColor =
    card.fields.gender === "m"
      ? "text-sky-500"
      : card.fields.gender === "f"
        ? "text-rose-500"
        : "";

  return (
    <div className="w-full max-w-md flex flex-col items-center gap-8">
      <CountsBar counts={counts} />
      <div className="text-xs uppercase tracking-wide text-zinc-400">
        {card.state} · rep {card.reps}
      </div>

      <div className="min-h-[12rem] flex flex-col items-center justify-center gap-3 text-center">
        <div className="text-5xl font-semibold text-zinc-900 dark:text-zinc-50">
          {genderArticle && <span className={genderColor}>{genderArticle} </span>}
          {card.fields.spanish}
        </div>
        {revealed && (
          <>
            <div className="text-xl text-zinc-600 dark:text-zinc-300">
              {card.fields.english}
            </div>
            {card.fields.example && (
              <div className="mt-4 text-sm text-zinc-500 dark:text-zinc-400 italic">
                &ldquo;{card.fields.example}&rdquo;
                {card.fields.exampleEnglish && (
                  <div className="mt-1 not-italic">{card.fields.exampleEnglish}</div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {!revealed ? (
        <button
          type="button"
          onClick={() => setRevealed(true)}
          disabled={isPending}
          className="inline-flex items-center justify-center rounded-full bg-zinc-900 dark:bg-zinc-50 px-8 py-3 text-sm font-medium text-zinc-50 dark:text-zinc-900 hover:opacity-90 disabled:opacity-50"
        >
          Reveal (space)
        </button>
      ) : (
        <div className="grid grid-cols-4 gap-2 w-full">
          {RATING_BUTTONS.map((b) => (
            <button
              key={b.rating}
              type="button"
              onClick={() => rate(b.rating)}
              disabled={isPending}
              className={`flex flex-col items-center justify-center rounded-lg px-2 py-3 text-white text-sm font-medium disabled:opacity-50 ${b.cls}`}
            >
              <span>{b.label}</span>
              <span className="text-[10px] opacity-80">{b.key}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function CountsBar({ counts }: { counts: Counts }) {
  return (
    <div className="flex gap-4 text-xs text-zinc-500">
      <span>
        new <span className="text-zinc-900 dark:text-zinc-100 font-semibold">{counts.new}</span>
      </span>
      <span>
        learn <span className="text-amber-500 font-semibold">{counts.learning}</span>
      </span>
      <span>
        review <span className="text-emerald-500 font-semibold">{counts.review}</span>
      </span>
    </div>
  );
}

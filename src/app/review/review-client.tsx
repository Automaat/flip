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
    englishTrap?: string;
    audio?: { word?: string; example?: string };
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
  const wordAudioRef = useRef<HTMLAudioElement | null>(null);
  const exAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    startedAt.current = performance.now();
  }, []);

  const playWord = useCallback(() => {
    const el = wordAudioRef.current;
    if (!el) return;
    el.currentTime = 0;
    void el.play().catch(() => {});
  }, []);

  const playExample = useCallback(() => {
    const el = exAudioRef.current;
    if (!el) return;
    el.currentTime = 0;
    void el.play().catch(() => {});
  }, []);

  useEffect(() => {
    if (!card?.fields.audio?.word) return;
    playWord();
  }, [card?.id, card?.fields.audio?.word, playWord]);

  useEffect(() => {
    if (!revealed) return;
    if (card?.fields.audio?.example) playExample();
  }, [revealed, card?.fields.audio?.example, playExample]);

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
        <div className="flex items-center gap-3">
          <div className="text-5xl font-semibold text-zinc-900 dark:text-zinc-50">
            {genderArticle && <span className={genderColor}>{genderArticle} </span>}
            {card.fields.spanish}
          </div>
          {card.fields.audio?.word && (
            <button
              type="button"
              onClick={playWord}
              aria-label="Play pronunciation"
              className="text-2xl text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
            >
              🔊
            </button>
          )}
        </div>
        {revealed && (
          <>
            {card.noteType === "false_friend" && card.fields.englishTrap && (
              <div className="text-sm text-rose-500">
                not <span className="line-through">{card.fields.englishTrap}</span>
              </div>
            )}
            <div className="text-xl text-zinc-600 dark:text-zinc-300">
              {card.noteType === "false_friend" && (
                <span className="text-emerald-500">= </span>
              )}
              {card.fields.english}
            </div>
            {card.fields.example && (
              <div className="mt-4 text-sm text-zinc-500 dark:text-zinc-400 italic flex items-center justify-center gap-2">
                <span>&ldquo;{card.fields.example}&rdquo;</span>
                {card.fields.audio?.example && (
                  <button
                    type="button"
                    onClick={playExample}
                    aria-label="Play example"
                    className="not-italic text-base hover:text-zinc-900 dark:hover:text-zinc-100"
                  >
                    🔊
                  </button>
                )}
              </div>
            )}
            {card.fields.exampleEnglish && (
              <div className="text-sm text-zinc-500 dark:text-zinc-400">
                {card.fields.exampleEnglish}
              </div>
            )}
          </>
        )}
      </div>

      {card.fields.audio?.word && (
        <audio ref={wordAudioRef} src={card.fields.audio.word} preload="auto" />
      )}
      {card.fields.audio?.example && (
        <audio ref={exAudioRef} src={card.fields.audio.example} preload="auto" />
      )}

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

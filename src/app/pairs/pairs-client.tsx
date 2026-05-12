"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export type PairItem = {
  index: number;
  seed: string;
  contrast: string;
  audioUrl: string;
  a: { spanish: string; english: string };
  b: { spanish: string; english: string };
  correct: "a" | "b";
};

export function PairsClient({ item }: { item: PairItem }) {
  const router = useRouter();
  const [picked, setPicked] = useState<"a" | "b" | null>(null);
  const [isPending, startTransition] = useTransition();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const play = useCallback(() => {
    const el = audioRef.current;
    if (!el) return;
    el.currentTime = 0;
    void el.play().catch(() => {});
  }, []);

  useEffect(() => {
    play();
  }, [play]);

  function pick(choice: "a" | "b") {
    if (picked) return;
    setPicked(choice);
  }

  function next() {
    startTransition(() => router.refresh());
  }

  const correctChoice = item.correct;

  return (
    <section className="rounded-lg border border-zinc-300 dark:border-zinc-700 p-6 flex flex-col gap-5">
      <div className="flex items-center justify-between text-xs text-zinc-500">
        <span>
          contrast: <span className="font-mono">{item.contrast}</span>
        </span>
      </div>
      <div className="flex justify-center">
        <button
          type="button"
          onClick={play}
          aria-label="Replay"
          className="text-5xl hover:scale-105 transition"
        >
          🔊
        </button>
      </div>
      <audio ref={audioRef} src={item.audioUrl} preload="auto" />

      <div className="grid grid-cols-2 gap-3">
        {(["a", "b"] as const).map((side) => {
          const word = item[side];
          const isPicked = picked === side;
          const isCorrect = correctChoice === side;
          const showResult = picked !== null;
          const cls = showResult
            ? isCorrect
              ? "border-emerald-500 bg-emerald-500/10"
              : isPicked
                ? "border-rose-500 bg-rose-500/10"
                : "border-zinc-300 dark:border-zinc-700 opacity-60"
            : "border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-900";
          return (
            <button
              key={side}
              type="button"
              onClick={() => pick(side)}
              disabled={!!picked}
              className={`rounded-lg border p-4 text-left transition ${cls}`}
            >
              <div className="font-semibold text-lg">{word.spanish}</div>
              <div className="text-xs text-zinc-500 mt-1">{word.english}</div>
            </button>
          );
        })}
      </div>

      {picked && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={next}
            disabled={isPending}
            className="rounded-full bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 px-5 py-2 text-sm disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </section>
  );
}

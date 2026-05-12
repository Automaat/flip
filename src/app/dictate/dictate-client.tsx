"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { scoreDictation, type DictationScore } from "@/lib/dictation";

type Item = {
  id: string;
  audioUrl: string;
  expected: string;
  translation: string | null;
};

export function DictateClient() {
  const [item, setItem] = useState<Item | null>(null);
  const [input, setInput] = useState("");
  const [score, setScore] = useState<DictationScore | null>(null);
  const [loading, setLoading] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setScore(null);
    setInput("");
    const res = await fetch("/api/dictate/next", { cache: "no-store" });
    const data = await res.json();
    setItem(data.item ?? null);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const play = useCallback(() => {
    const el = audioRef.current;
    if (!el) return;
    el.currentTime = 0;
    void el.play().catch(() => {});
  }, []);

  useEffect(() => {
    if (item && !score) play();
  }, [item, score, play]);

  if (loading) return <p className="text-center text-zinc-500">Loading…</p>;
  if (!item) {
    return (
      <p className="text-center text-zinc-500">
        No audio sentences available yet. Run <code>pnpm audio:gen</code> to populate.
      </p>
    );
  }

  function check() {
    if (!item) return;
    setScore(scoreDictation(item.expected, input));
  }

  function skip() {
    void load();
  }

  return (
    <section className="rounded-lg border border-zinc-300 dark:border-zinc-700 p-6 flex flex-col gap-4">
      <div className="flex justify-center">
        <button
          type="button"
          onClick={play}
          aria-label="Replay audio"
          className="text-5xl hover:scale-105 transition"
        >
          🔊
        </button>
      </div>
      <audio ref={audioRef} src={item.audioUrl} preload="auto" />

      {!score ? (
        <>
          <input
            autoFocus
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") check();
            }}
            placeholder="type what you hear"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            className="w-full rounded border border-zinc-300 dark:border-zinc-700 bg-transparent px-4 py-3 text-center text-lg outline-none focus:ring-2 focus:ring-zinc-500/40"
          />
          <div className="flex justify-between gap-2">
            <button
              type="button"
              onClick={skip}
              className="rounded-full border border-zinc-300 dark:border-zinc-700 px-4 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-900"
            >
              Skip
            </button>
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
          <div className="space-y-3">
            <div>
              <p className="text-xs uppercase tracking-wide text-zinc-500 mb-1">expected</p>
              <p className="text-lg">
                {score.expected.map((t, i) => (
                  <span
                    key={`e${i}`}
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
            {score.given.length > 0 && (
              <div>
                <p className="text-xs uppercase tracking-wide text-zinc-500 mb-1">you typed</p>
                <p className="text-lg text-zinc-500">
                  {score.given.map((t, i) => (
                    <span
                      key={`g${i}`}
                      className={
                        t.status === "correct"
                          ? "text-emerald-500"
                          : t.status === "extra"
                            ? "text-rose-500 line-through"
                            : "text-rose-500"
                      }
                    >
                      {t.token}{" "}
                    </span>
                  ))}
                </p>
              </div>
            )}
            {item.translation && (
              <p className="text-sm italic text-zinc-500">{item.translation}</p>
            )}
          </div>
          <button
            type="button"
            onClick={() => void load()}
            className="self-end rounded-full bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 px-5 py-2 text-sm"
          >
            Next
          </button>
        </>
      )}
    </section>
  );
}

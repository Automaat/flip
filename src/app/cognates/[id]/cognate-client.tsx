"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { CognateRule } from "@/data/cognate-rules";
import { matchesAnswer } from "@/lib/cognates";

type Status = "idle" | "correct" | "wrong";

export function CognateClient({
  rule,
  alreadyUnlocked,
}: {
  rule: CognateRule;
  alreadyUnlocked: boolean;
}) {
  const router = useRouter();
  const [idx, setIdx] = useState(0);
  const [answer, setAnswer] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [correctCount, setCorrectCount] = useState(0);
  const [done, setDone] = useState(false);
  const [unlocked, setUnlocked] = useState(alreadyUnlocked);
  const [unlockedCount, setUnlockedCount] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();

  const current = rule.quiz[idx];
  const total = rule.quiz.length;

  function check() {
    if (!current || !answer.trim()) return;
    if (matchesAnswer(answer, current.es)) {
      setStatus("correct");
      setCorrectCount((c) => c + 1);
    } else {
      setStatus("wrong");
    }
  }

  function next() {
    if (idx + 1 < total) {
      setIdx((i) => i + 1);
      setAnswer("");
      setStatus("idle");
    } else {
      setDone(true);
    }
  }

  async function unlock() {
    const res = await fetch("/api/cognates/unlock", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ruleId: rule.id }),
    });
    const data = await res.json();
    if (res.ok) {
      setUnlocked(true);
      setUnlockedCount(data.cardsCreated);
      startTransition(() => router.refresh());
    }
  }

  if (done) {
    const passed = correctCount >= Math.ceil(total * 0.75);
    return (
      <section className="rounded-lg border border-zinc-300 dark:border-zinc-700 p-6 text-center">
        <p className="text-2xl font-semibold">
          {correctCount} / {total}
        </p>
        <p className="mt-2 text-sm text-zinc-500">
          {passed ? "Nice. You've got the pattern." : "Almost there — try again to lock it in."}
        </p>
        <div className="mt-6 flex gap-3 justify-center">
          {!passed && (
            <button
              type="button"
              onClick={() => {
                setIdx(0);
                setAnswer("");
                setStatus("idle");
                setCorrectCount(0);
                setDone(false);
              }}
              className="rounded-full border border-zinc-300 dark:border-zinc-700 px-4 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-900"
            >
              Retry quiz
            </button>
          )}
          {passed && !unlocked && (
            <button
              type="button"
              onClick={unlock}
              disabled={isPending}
              className="rounded-full bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 text-sm disabled:opacity-50"
            >
              Unlock cards
            </button>
          )}
          {unlocked && (
            <>
              {unlockedCount !== null && (
                <span className="self-center text-sm text-emerald-500">
                  ✓ {unlockedCount} cards added
                </span>
              )}
              <Link
                href="/review"
                className="rounded-full bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 px-4 py-2 text-sm hover:opacity-90"
              >
                Review now
              </Link>
            </>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-lg border border-zinc-300 dark:border-zinc-700 p-6">
      <div className="flex justify-between items-center text-xs text-zinc-500 mb-3">
        <span>Quiz</span>
        <span>
          {idx + 1} / {total}
        </span>
      </div>
      <p className="text-center text-2xl mb-1">{current?.en}</p>
      <p className="text-center text-xs text-zinc-500 mb-4">
        translate using the <span className="font-mono">{rule.esSuffix}</span> pattern
      </p>
      <input
        autoFocus
        type="text"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        onKeyDown={(e) => {
          if (e.key !== "Enter") return;
          if (status === "idle") check();
          else next();
        }}
        disabled={status === "correct"}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        className={`w-full rounded border px-4 py-3 text-center text-lg bg-transparent outline-none focus:ring-2 ${
          status === "correct"
            ? "border-emerald-500 ring-emerald-500/40"
            : status === "wrong"
              ? "border-rose-500 ring-rose-500/40"
              : "border-zinc-300 dark:border-zinc-700 focus:ring-zinc-500/40"
        }`}
      />
      {status === "wrong" && (
        <p className="mt-2 text-sm text-rose-500 text-center">
          → {current?.es}
        </p>
      )}
      <div className="mt-4 flex justify-end gap-2">
        {status === "idle" ? (
          <button
            type="button"
            onClick={check}
            disabled={!answer.trim()}
            className="rounded-full bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 px-4 py-2 text-sm disabled:opacity-50"
          >
            Check (enter)
          </button>
        ) : (
          <button
            type="button"
            onClick={next}
            className="rounded-full bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 px-4 py-2 text-sm"
          >
            Next (enter)
          </button>
        )}
      </div>
    </section>
  );
}

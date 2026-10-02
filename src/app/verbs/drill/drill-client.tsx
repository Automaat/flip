"use client";

import { useRef, useState } from "react";
import { TENSE_LABELS, TENSES, type Tense, type VerbGroup } from "@/data/verbs";
import {
  drillPool,
  gradeConjugation,
  nextDrillItem,
  type DrillItem,
  type Grade,
  type RetryEntry,
  scheduleRetry,
} from "@/lib/conjugate";

const GROUPS: { id: VerbGroup; label: string }[] = [
  { id: "irregular", label: "Irregular" },
  { id: "regular", label: "Regular" },
];

const ACCENTS = ["á", "é", "í", "ó", "ú", "ñ"];

/** Swallows the second tap of a double-tap on Check, which would otherwise skip the correction. */
const NEXT_GUARD_MS = 400;

type Session = {
  pool: DrillItem[];
  item: DrillItem;
  retry: RetryEntry[];
  turn: number;
  correct: number;
  answered: number;
};

function toggle<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

export function DrillClient() {
  const [tenses, setTenses] = useState<Tense[]>(["present", "preterite", "perfect"]);
  const [groups, setGroups] = useState<VerbGroup[]>(["irregular", "regular"]);
  const [session, setSession] = useState<Session | null>(null);
  const [typed, setTyped] = useState("");
  const [grade, setGrade] = useState<Grade | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const checkedAt = useRef(0);

  const poolSize = drillPool(groups, tenses).length;

  function start() {
    const pool = drillPool(groups, tenses);
    if (pool.length === 0) return;
    const { item, retry } = nextDrillItem(pool, [], 0, Math.random);
    setSession({ pool, item, retry, turn: 0, correct: 0, answered: 0 });
    setTyped("");
    setGrade(null);
  }

  function check() {
    if (!session || grade || !typed.trim()) return;
    const g = gradeConjugation(typed, session.item.answer);
    checkedAt.current = Date.now();
    setGrade(g);
    setSession({
      ...session,
      answered: session.answered + 1,
      correct: session.correct + (g === "correct" ? 1 : 0),
      retry: g === "correct" ? session.retry : scheduleRetry(session.retry, session.item, session.turn),
    });
  }

  function next() {
    if (!session || Date.now() - checkedAt.current < NEXT_GUARD_MS) return;
    const turn = session.turn + 1;
    const { item, retry } = nextDrillItem(
      session.pool,
      session.retry,
      turn,
      Math.random,
      session.item,
    );
    setSession({ ...session, item, retry, turn });
    setTyped("");
    setGrade(null);
    inputRef.current?.focus();
  }

  function insertAccent(ch: string) {
    setTyped((t) => t + ch);
    inputRef.current?.focus();
  }

  if (!session) {
    return (
      <div className="flex flex-col gap-5">
        <fieldset className="flex flex-col gap-2">
          <legend className="text-xs uppercase tracking-wide text-zinc-500 mb-2">Tenses</legend>
          <div className="flex flex-wrap gap-2">
            {TENSES.map((t) => (
              <TogglePill
                key={t}
                label={TENSE_LABELS[t]}
                pressed={tenses.includes(t)}
                onClick={() => setTenses(toggle(tenses, t))}
              />
            ))}
          </div>
        </fieldset>
        <fieldset className="flex flex-col gap-2">
          <legend className="text-xs uppercase tracking-wide text-zinc-500 mb-2">Verbs</legend>
          <div className="flex flex-wrap gap-2">
            {GROUPS.map((g) => (
              <TogglePill
                key={g.id}
                label={g.label}
                pressed={groups.includes(g.id)}
                onClick={() => setGroups(toggle(groups, g.id))}
              />
            ))}
          </div>
        </fieldset>
        <button
          type="button"
          onClick={start}
          disabled={poolSize === 0}
          className="rounded-full bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 px-6 py-3 text-sm font-medium hover:opacity-90 disabled:opacity-40"
        >
          {poolSize === 0 ? "Pick a tense and a verb group" : `Start (${poolSize} forms)`}
        </button>
      </div>
    );
  }

  const { item } = session;
  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between text-xs text-zinc-500">
        <span data-testid="drill-score">
          {session.correct} / {session.answered}
        </span>
        <button type="button" onClick={() => setSession(null)} className="hover:underline">
          change settings
        </button>
      </div>

      <div className="rounded-xl border border-zinc-300 dark:border-zinc-700 p-6 flex flex-col items-center gap-2 text-center">
        <div
          className="text-xs uppercase tracking-wide text-emerald-600 dark:text-emerald-400"
          data-testid="drill-tense"
        >
          {TENSE_LABELS[item.tense]}
        </div>
        <div className="text-3xl font-semibold text-zinc-900 dark:text-zinc-50" data-testid="drill-prompt">
          {item.infinitive}
        </div>
        <div className="text-sm text-zinc-500">{item.english}</div>
        <div className="mt-2 text-xl text-zinc-800 dark:text-zinc-200" data-testid="drill-person">
          {item.person}
        </div>
      </div>

      <input
        ref={inputRef}
        autoFocus
        aria-label="conjugated form"
        value={typed}
        readOnly={grade !== null}
        onChange={(e) => setTyped(e.target.value)}
        onKeyDown={(e) => {
          if (e.key !== "Enter") return;
          if (grade) next();
          else check();
        }}
        placeholder="type the form"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent px-4 py-3 text-lg text-center"
      />

      {!grade && (
        <div className="flex justify-center gap-1">
          {ACCENTS.map((ch) => (
            <button
              key={ch}
              type="button"
              onClick={() => insertAccent(ch)}
              className="w-9 h-9 rounded-md border border-zinc-300 dark:border-zinc-700 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-900"
            >
              {ch}
            </button>
          ))}
        </div>
      )}

      {grade && <Feedback grade={grade} answer={item.answer} />}

      <button
        type="button"
        onClick={grade ? next : check}
        disabled={!grade && !typed.trim()}
        className="rounded-full bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 px-6 py-3 text-sm font-medium hover:opacity-90 disabled:opacity-40"
      >
        {grade ? "Next" : "Check"}
      </button>
    </div>
  );
}

function Feedback({ grade, answer }: { grade: Grade; answer: string }) {
  if (grade === "correct") {
    return (
      <p role="status" className="text-center text-emerald-600 dark:text-emerald-400 font-medium">
        ✓ Correct
      </p>
    );
  }
  if (grade === "accent") {
    return (
      <p role="status" className="text-center text-amber-600 dark:text-amber-400">
        ≈ Almost: mind the accents · <span className="font-semibold">{answer}</span>
      </p>
    );
  }
  return (
    <p role="status" className="text-center text-rose-600 dark:text-rose-400">
      ✗ <span className="font-semibold">{answer}</span>
    </p>
  );
}

function TogglePill({
  label,
  pressed,
  onClick,
}: {
  label: string;
  pressed: boolean;
  onClick: () => void;
}) {
  const cls = pressed
    ? "bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900"
    : "border border-zinc-300 dark:border-zinc-700 text-zinc-500";
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-sm font-medium ${cls}`}
    >
      {label}
    </button>
  );
}

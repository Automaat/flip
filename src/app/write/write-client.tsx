"use client";

import { useState } from "react";

const LEVELS = ["A1", "A2", "B1", "B2"] as const;
const PROMPTS = [
  "Describe tu día perfecto.",
  "Describe a tu familia.",
  "¿Qué hiciste el fin de semana pasado?",
  "Describe tu plato favorito.",
];

export function WriteClient() {
  const [level, setLevel] = useState<(typeof LEVELS)[number]>("A1");
  const [text, setText] = useState("");
  const [pending, setPending] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function evaluate() {
    setPending(true);
    setError(null);
    setFeedback(null);
    const res = await fetch("/api/write/evaluate", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ text, level }),
    });
    setPending(false);
    if (!res.ok) {
      setError(
        res.status === 503
          ? "Set ANTHROPIC_API_KEY in .env to enable evaluation."
          : `error ${res.status}`,
      );
      return;
    }
    const body = (await res.json()) as { raw: string };
    setFeedback(body.raw);
  }

  return (
    <section className="flex flex-col gap-3">
      <div className="flex gap-1 text-xs">
        {LEVELS.map((l) => (
          <button
            key={l}
            type="button"
            onClick={() => setLevel(l)}
            className={`rounded-full px-3 py-1 ${
              level === l
                ? "bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900"
                : "border border-zinc-300 dark:border-zinc-700"
            }`}
          >
            {l}
          </button>
        ))}
      </div>

      <div className="text-xs text-zinc-500">prompt ideas:</div>
      <div className="flex flex-wrap gap-2">
        {PROMPTS.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setText((t) => (t ? t : `${p}\n\n`))}
            className="rounded-full border border-zinc-300 dark:border-zinc-700 px-3 py-1 text-xs hover:bg-zinc-100 dark:hover:bg-zinc-900"
          >
            {p}
          </button>
        ))}
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={8}
        placeholder="escribe en español…"
        className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent p-3 text-sm focus:ring-2 focus:ring-zinc-500/40 outline-none"
      />

      <button
        type="button"
        onClick={evaluate}
        disabled={!text.trim() || pending}
        className="self-end rounded-full bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 px-5 py-2 text-sm disabled:opacity-50"
      >
        {pending ? "Evaluating…" : "Get feedback"}
      </button>

      {error && <p className="text-sm text-rose-500">{error}</p>}

      {feedback && (
        <pre className="rounded-lg border border-zinc-300 dark:border-zinc-700 p-3 text-xs whitespace-pre-wrap font-mono">
          {feedback}
        </pre>
      )}
    </section>
  );
}

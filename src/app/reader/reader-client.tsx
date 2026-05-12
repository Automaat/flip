"use client";

import { useState } from "react";
import type { Familiarity, Token } from "@/lib/reader";

type AnalyzeResponse = {
  tokens: Token[];
  familiarity: Record<string, Familiarity>;
};

const SAMPLE =
  "Hoy es un buen día. Voy a la librería del centro porque quiero comprar un libro nuevo. El sistema de transporte público es muy eficiente. Mi hermana está embarazada de cinco meses y ella siempre tiene hambre.";

const FAMILIARITY_CLASSES: Record<Familiarity, string> = {
  unknown:
    "text-zinc-400 underline decoration-dotted decoration-zinc-400 cursor-pointer hover:bg-amber-500/20",
  learning:
    "text-amber-600 dark:text-amber-400 cursor-pointer hover:bg-amber-500/20",
  known: "text-emerald-600 dark:text-emerald-400",
};

export function ReaderClient() {
  const [text, setText] = useState(SAMPLE);
  const [data, setData] = useState<AnalyzeResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<{ word: string; context: string } | null>(null);
  const [english, setEnglish] = useState("");
  const [added, setAdded] = useState<Set<string>>(new Set());
  const [addError, setAddError] = useState<string | null>(null);

  async function analyze() {
    setLoading(true);
    setData(null);
    setAdded(new Set());
    try {
      const res = await fetch("/api/reader/analyze", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const body = await res.json();
      setData(body);
    } finally {
      setLoading(false);
    }
  }

  async function add() {
    if (!selected) return;
    setAddError(null);
    const res = await fetch("/api/reader/add", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        spanish: selected.word,
        english: english.trim() || undefined,
        context: selected.context,
      }),
    });
    const body = await res.json();
    if (!res.ok) {
      setAddError(body.error ?? "add failed");
      return;
    }
    setAdded((s) => new Set(s).add(selected.word));
    setSelected(null);
    setEnglish("");
  }

  function contextFor(idx: number): string {
    if (!data) return "";
    const start = Math.max(0, idx - 3);
    const end = Math.min(data.tokens.length, idx + 4);
    return data.tokens
      .slice(start, end)
      .map((t) => t.raw)
      .join("");
  }

  return (
    <section className="flex flex-col gap-4">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={5}
        placeholder="Paste Spanish text…"
        className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent p-3 text-sm focus:ring-2 focus:ring-zinc-500/40 outline-none"
      />
      <button
        type="button"
        onClick={analyze}
        disabled={loading || !text.trim()}
        className="self-end rounded-full bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 px-5 py-2 text-sm disabled:opacity-50"
      >
        {loading ? "Analyzing…" : "Read"}
      </button>

      {data && (
        <article className="rounded-lg border border-zinc-300 dark:border-zinc-700 p-4 text-lg leading-relaxed">
          {data.tokens.map((t, i) => {
            if (!t.word) return <span key={i}>{t.raw}</span>;
            const fam = data.familiarity[t.word] ?? "unknown";
            const isAdded = added.has(t.word);
            const cls = isAdded
              ? "text-emerald-600 dark:text-emerald-400"
              : FAMILIARITY_CLASSES[fam];
            return (
              <span
                key={i}
                className={cls}
                onClick={() => {
                  if (fam === "known" || isAdded) return;
                  setSelected({ word: t.word!, context: contextFor(i) });
                  setEnglish("");
                  setAddError(null);
                }}
              >
                {t.raw}
              </span>
            );
          })}
        </article>
      )}

      {data && (
        <div className="flex items-center gap-4 text-xs text-zinc-500">
          <span className="flex items-center gap-1">
            <span className="inline-block w-3 h-3 rounded-full bg-emerald-500" /> known
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block w-3 h-3 rounded-full bg-amber-500" /> learning
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block w-3 h-3 rounded-full bg-zinc-400" /> unknown
          </span>
        </div>
      )}

      {selected && (
        <div className="rounded-lg border border-zinc-300 dark:border-zinc-700 p-4 flex flex-col gap-3">
          <div>
            <span className="text-xs uppercase tracking-wide text-zinc-500">word</span>
            <p className="text-xl font-semibold">{selected.word}</p>
            <p className="text-xs text-zinc-500 italic mt-1">…{selected.context}…</p>
          </div>
          <input
            value={english}
            onChange={(e) => setEnglish(e.target.value)}
            placeholder="English (optional)"
            autoComplete="off"
            className="rounded border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-500/40"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setSelected(null);
                setEnglish("");
              }}
              className="rounded-full border border-zinc-300 dark:border-zinc-700 px-4 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-900"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={add}
              className="rounded-full bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 px-4 py-2 text-sm"
            >
              Add to deck
            </button>
          </div>
          {addError && <p className="text-sm text-rose-500">{addError}</p>}
        </div>
      )}
    </section>
  );
}

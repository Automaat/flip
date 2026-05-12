"use client";

import { useState } from "react";

type ChatMsg = { role: "user" | "assistant"; content: string };

const SCENARIOS = [
  { id: "open", label: "Open chat", scenario: undefined },
  { id: "restaurant", label: "Restaurant", scenario: "Ordering food at a Mexican restaurant" },
  { id: "shopping", label: "Shopping", scenario: "Shopping for clothes" },
  { id: "directions", label: "Directions", scenario: "Asking for directions in a city" },
];

export function TutorClient() {
  const [level, setLevel] = useState<"A1" | "A2" | "B1" | "B2">("A1");
  const [scenarioId, setScenarioId] = useState<string>("open");
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function send() {
    if (!input.trim() || pending) return;
    const userMsg: ChatMsg = { role: "user", content: input.trim() };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setPending(true);
    setError(null);

    const scenario = SCENARIOS.find((s) => s.id === scenarioId)?.scenario;
    const res = await fetch("/api/tutor/chat", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ level, scenario, messages: next }),
    });
    setPending(false);
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      const msg =
        res.status === 503
          ? "AI tutor needs ANTHROPIC_API_KEY in .env to work."
          : (typeof body.error === "string" ? body.error : `error ${res.status}`);
      setError(msg);
      return;
    }
    const body = (await res.json()) as { reply: string };
    setMessages([...next, { role: "assistant", content: body.reply }]);
  }

  return (
    <section className="flex flex-col gap-3">
      <div className="flex gap-2 text-xs justify-between flex-wrap">
        <div className="flex gap-1">
          {(["A1", "A2", "B1", "B2"] as const).map((l) => (
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
        <select
          value={scenarioId}
          onChange={(e) => setScenarioId(e.target.value)}
          className="rounded border border-zinc-300 dark:border-zinc-700 bg-transparent px-2 py-1 text-xs"
        >
          {SCENARIOS.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2 min-h-[12rem] rounded-lg border border-zinc-300 dark:border-zinc-700 p-3">
        {messages.length === 0 ? (
          <p className="text-center text-zinc-500 text-sm">
            Say <span className="font-mono">¡Hola!</span> to start.
          </p>
        ) : (
          messages.map((m, i) => (
            <div
              key={i}
              className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm whitespace-pre-wrap ${
                m.role === "user"
                  ? "self-end bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900"
                  : "self-start bg-zinc-100 dark:bg-zinc-900"
              }`}
            >
              {m.content}
            </div>
          ))
        )}
        {pending && (
          <div className="self-start text-xs text-zinc-500 italic">tutor is thinking…</div>
        )}
      </div>

      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") send();
          }}
          placeholder="escribe en español"
          autoComplete="off"
          className="flex-1 rounded border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2"
        />
        <button
          type="button"
          onClick={send}
          disabled={!input.trim() || pending}
          className="rounded-full bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 px-5 py-2 text-sm disabled:opacity-50"
        >
          Send
        </button>
      </div>

      {error && <p className="text-sm text-rose-500">{error}</p>}
    </section>
  );
}

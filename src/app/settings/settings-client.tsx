"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export type SettingsForm = {
  newCardsPerDay: number;
  retention: number;
  voiceId: string;
  region: "latam" | "spain";
};

const VOICES_BY_REGION: Record<"latam" | "spain", { id: string; label: string }[]> = {
  latam: [
    { id: "es-MX-DaliaNeural", label: "Mexico — Dalia (f)" },
    { id: "es-MX-JorgeNeural", label: "Mexico — Jorge (m)" },
  ],
  spain: [
    { id: "es-ES-ElviraNeural", label: "Spain — Elvira (f)" },
    { id: "es-ES-AlvaroNeural", label: "Spain — Álvaro (m)" },
  ],
};

export function SettingsClient({ initial }: { initial: SettingsForm }) {
  const router = useRouter();
  const [form, setForm] = useState<SettingsForm>(initial);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function save() {
    setError(null);
    setSaved(false);
    const res = await fetch("/api/settings", {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(form),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(typeof body.error === "string" ? body.error : "save failed");
      return;
    }
    setSaved(true);
    startTransition(() => router.refresh());
  }

  const voices = VOICES_BY_REGION[form.region];
  const voiceIsValidForRegion = voices.some((v) => v.id === form.voiceId);

  return (
    <section className="rounded-lg border border-zinc-300 dark:border-zinc-700 p-6 flex flex-col gap-5">
      <Field label="New cards per day" hint="20 = balanced. 5–10 if reviews stack up.">
        <input
          type="number"
          min={0}
          max={200}
          value={form.newCardsPerDay}
          onChange={(e) =>
            setForm({ ...form, newCardsPerDay: parseInt(e.target.value, 10) || 0 })
          }
          className="w-full rounded border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2"
        />
      </Field>

      <Field
        label={`Target retention: ${Math.round(form.retention * 100)}%`}
        hint="Higher = more reviews but better recall. 90% is the FSRS default."
      >
        <input
          type="range"
          min={0.8}
          max={0.95}
          step={0.01}
          value={form.retention}
          onChange={(e) => setForm({ ...form, retention: parseFloat(e.target.value) })}
          className="w-full"
        />
      </Field>

      <Field label="Region" hint="Mexico (LATAM) is the default — clearer pronunciation.">
        <div className="grid grid-cols-2 gap-2">
          {(["latam", "spain"] as const).map((r) => {
            const active = form.region === r;
            return (
              <button
                key={r}
                type="button"
                onClick={() => {
                  const newVoice =
                    VOICES_BY_REGION[r].find((v) => v.id === form.voiceId)?.id ??
                    VOICES_BY_REGION[r][0]!.id;
                  setForm({ ...form, region: r, voiceId: newVoice });
                }}
                className={`rounded-full px-4 py-2 text-sm ${
                  active
                    ? "bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900"
                    : "border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                }`}
              >
                {r === "latam" ? "Latin America" : "Spain"}
              </button>
            );
          })}
        </div>
      </Field>

      <Field label="Voice">
        <select
          value={voiceIsValidForRegion ? form.voiceId : voices[0]!.id}
          onChange={(e) => setForm({ ...form, voiceId: e.target.value })}
          className="w-full rounded border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2"
        >
          {voices.map((v) => (
            <option key={v.id} value={v.id}>
              {v.label}
            </option>
          ))}
        </select>
      </Field>

      <div className="flex justify-between items-center">
        <span className="text-xs text-emerald-500">
          {saved && "✓ saved"}
        </span>
        <button
          type="button"
          onClick={save}
          disabled={isPending}
          className="rounded-full bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 px-5 py-2 text-sm disabled:opacity-50"
        >
          {isPending ? "Saving…" : "Save"}
        </button>
      </div>

      {error && <p className="text-sm text-rose-500">{error}</p>}
    </section>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs uppercase tracking-wide text-zinc-500">{label}</label>
      {children}
      {hint && <p className="text-xs text-zinc-500">{hint}</p>}
    </div>
  );
}

import Link from "next/link";
import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { decks } from "@/db/schema";
import { GENDER_EXCEPTIONS, GENDER_RULES } from "@/data/gender-exceptions";
import { GenderClient } from "./gender-client";

export const dynamic = "force-dynamic";

const DECK_NAME = "Gender Exceptions";

export default async function GenderPage() {
  const existing = await db.select().from(decks).where(eq(decks.name, DECK_NAME));
  const imported = existing.length > 0;
  return (
    <main className="flex flex-1 flex-col items-center px-6 py-12">
      <div className="w-full max-w-2xl flex flex-col gap-6">
        <header className="text-center">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">Gender</h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Spanish noun gender — the rules, and the exceptions that break them.
          </p>
        </header>

        <section className="space-y-2">
          <h2 className="text-xs uppercase tracking-wide text-zinc-500">Rules</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {GENDER_RULES.map((r) => {
              const accent =
                r.gender === "m"
                  ? "border-sky-500/40 bg-sky-500/5"
                  : r.gender === "f"
                    ? "border-rose-500/40 bg-rose-500/5"
                    : "border-zinc-300 dark:border-zinc-700";
              return (
                <div key={r.id} className={`rounded-lg border p-3 ${accent}`}>
                  <div className="flex items-baseline justify-between">
                    <span className="font-mono text-sm">{r.pattern}</span>
                    <span
                      className={
                        r.gender === "m"
                          ? "text-sky-500"
                          : r.gender === "f"
                            ? "text-rose-500"
                            : "text-zinc-500"
                      }
                    >
                      {r.gender === "m" ? "el" : r.gender === "f" ? "la" : "varies"}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">{r.description}</p>
                  <p className="text-xs text-zinc-500 mt-1 italic">{r.examples.join(", ")}</p>
                </div>
              );
            })}
          </div>
        </section>

        <GenderClient
          alreadyImported={imported}
          total={GENDER_EXCEPTIONS.length}
          exceptions={GENDER_EXCEPTIONS}
        />

        <div className="text-center">
          <Link
            href="/"
            className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            ← back
          </Link>
        </div>
      </div>
    </main>
  );
}

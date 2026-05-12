import Link from "next/link";
import { ROOTS } from "@/data/etymology";

export const dynamic = "force-dynamic";

export default function EtymologyPage() {
  return (
    <main className="flex flex-1 flex-col items-center px-6 py-12">
      <div className="w-full max-w-3xl flex flex-col gap-6">
        <header className="text-center">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">Etymology</h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Latin and Greek roots unlock whole families of Spanish and English words at once.
          </p>
        </header>

        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {ROOTS.map((r) => (
            <li
              key={r.id}
              className="rounded-lg border border-zinc-300 dark:border-zinc-700 p-4"
            >
              <div className="flex items-baseline justify-between">
                <div className="font-mono text-base">
                  <span className="font-semibold">{r.root}</span>
                  <span className="text-zinc-500"> · {r.meaning}</span>
                </div>
                <span
                  className={
                    r.origin === "Latin"
                      ? "text-xs uppercase text-amber-500"
                      : "text-xs uppercase text-sky-500"
                  }
                >
                  {r.origin}
                </span>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
                <div>
                  <p className="uppercase tracking-wide text-zinc-500 mb-1">Spanish</p>
                  <ul className="space-y-0.5">
                    {r.spanish.map((s) => (
                      <li key={s.word}>
                        <span className="text-zinc-900 dark:text-zinc-100 font-medium">
                          {s.word}
                        </span>{" "}
                        <span className="text-zinc-500">— {s.gloss}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="uppercase tracking-wide text-zinc-500 mb-1">English</p>
                  <p className="text-zinc-500">{r.english.join(", ")}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>

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

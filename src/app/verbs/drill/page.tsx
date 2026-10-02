import Link from "next/link";
import { DrillClient } from "./drill-client";

export default function VerbDrillPage() {
  return (
    <main className="flex flex-1 flex-col items-center px-6 py-12">
      <div className="w-full max-w-md flex flex-col gap-6">
        <header className="text-center">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">Conjugation drill</h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Type the form. Misses come back a few turns later.
          </p>
        </header>

        <DrillClient />

        <div className="text-center">
          <Link
            href="/verbs"
            className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            ← verbs
          </Link>
        </div>
      </div>
    </main>
  );
}

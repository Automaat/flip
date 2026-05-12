import Link from "next/link";
import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { decks } from "@/db/schema";
import { UNIQUE_FALSE_FRIENDS } from "@/data/false-friends";
import { FalseFriendsClient } from "./false-friends-client";

export const dynamic = "force-dynamic";

const DECK_NAME = "False Friends";

export default async function FalseFriendsPage() {
  const existing = await db.select().from(decks).where(eq(decks.name, DECK_NAME));
  const imported = existing.length > 0;
  return (
    <main className="flex flex-1 flex-col items-center px-6 py-12">
      <div className="w-full max-w-2xl flex flex-col gap-6">
        <header className="text-center">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">False Friends</h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Spanish words that look English but don&apos;t mean what you think.
          </p>
        </header>

        <FalseFriendsClient alreadyImported={imported} total={UNIQUE_FALSE_FRIENDS.length} />

        <ul className="rounded-lg border border-zinc-300 dark:border-zinc-700 divide-y divide-zinc-200 dark:divide-zinc-800">
          {UNIQUE_FALSE_FRIENDS.map((f) => (
            <li key={f.spanish} className="p-4">
              <div className="flex items-baseline justify-between gap-3">
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                  {f.spanish}
                </span>
                <span className="text-xs text-zinc-500">
                  not <span className="line-through text-rose-500">{f.englishTrap}</span>
                </span>
              </div>
              <p className="text-sm text-emerald-600 dark:text-emerald-400">
                = {f.englishReal}
              </p>
              <p className="mt-1 text-xs text-zinc-500 italic">{f.example}</p>
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

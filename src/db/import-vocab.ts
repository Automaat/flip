import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { sql as dsql } from "drizzle-orm";
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import * as schema from "./schema";

const SOURCE =
  "https://raw.githubusercontent.com/hermitdave/FrequencyWords/master/content/2018/es/es_50k.txt";

const CACHE_DIR = path.join(process.cwd(), ".cache");
const CACHE_FILE = path.join(CACHE_DIR, "es_50k.txt");

async function fetchList(): Promise<string> {
  await mkdir(CACHE_DIR, { recursive: true });
  if (existsSync(CACHE_FILE)) {
    return readFile(CACHE_FILE, "utf8");
  }
  console.log(`↓ downloading ${SOURCE}`);
  const res = await fetch(SOURCE);
  if (!res.ok) throw new Error(`fetch failed ${res.status}`);
  const text = await res.text();
  await writeFile(CACHE_FILE, text);
  return text;
}

function parse(text: string): { word: string; rank: number }[] {
  const out: { word: string; rank: number }[] = [];
  let rank = 0;
  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const [word] = trimmed.split(/\s+/);
    if (!word) continue;
    if (/[^a-záéíóúüñ]/i.test(word)) continue;
    rank++;
    out.push({ word: word.toLowerCase(), rank });
  }
  return out;
}

async function main() {
  const limitArg = process.argv[2];
  const limit = limitArg ? parseInt(limitArg, 10) : 5000;

  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL not set");
  const sql = postgres(url, { max: 1 });
  const db = drizzle(sql, { schema });

  const text = await fetchList();
  const rows = parse(text).slice(0, limit);
  console.log(`parsed ${rows.length} words from frequency list`);

  const CHUNK = 500;
  let inserted = 0;
  for (let i = 0; i < rows.length; i += CHUNK) {
    const batch = rows.slice(i, i + CHUNK);
    const res = await db
      .insert(schema.vocabulary)
      .values(batch.map((r) => ({ word: r.word, frequencyRank: r.rank })))
      .onConflictDoUpdate({
        target: schema.vocabulary.word,
        set: { frequencyRank: dsql`excluded.frequency_rank` },
      });
    inserted += res.count ?? batch.length;
  }
  const [{ count }] = await db.execute<{ count: number }>(
    dsql`select count(*)::int as count from vocabulary`,
  );
  console.log(`✓ vocabulary upserted (${inserted} processed, ${count} total in DB)`);
  await sql.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

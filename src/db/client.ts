import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL not set");

type PgClient = ReturnType<typeof postgres>;
const g = globalThis as typeof globalThis & { __flipPg?: PgClient };

const pg: PgClient = g.__flipPg ?? postgres(url, { max: 10 });
if (process.env.NODE_ENV !== "production") g.__flipPg = pg;

export const db = drizzle(pg, { schema });
export type DB = typeof db;

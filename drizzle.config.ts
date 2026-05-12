import type { Config } from "drizzle-kit";

const url = process.env.DATABASE_URL ?? "postgres://flip:flip@localhost:5432/flip";

export default {
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: { url },
  strict: false,
  verbose: false,
} satisfies Config;

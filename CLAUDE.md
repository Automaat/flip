# Flip

Self-hosted Spanish learning app: FSRS spaced repetition, AI mnemonics, comprehensible input. Next.js App Router, runs on the home LAN, used from a phone browser as a PWA. Feature scope lives in `FEATURES.md`.

## Tech Stack

- **Next.js 16** (App Router, Turbopack) + **React 19** — TypeScript (strict)
- **Tailwind CSS 4**
- **Drizzle ORM** + **Postgres 17** (`postgres-js` driver)
- **ts-fsrs** — FSRS scheduler
- **msedge-tts** — audio generation
- **zod** — request validation
- **Anthropic API** — LLM features (mnemonics, tutor, story gen) via `src/lib/claude.ts`
- Tooling: **pnpm 10** + **Node 22** (pinned in `mise.toml`), **vitest**, **Playwright**, **oxlint** + **eslint**

## Project Structure

```
src/
  app/
    <feature>/page.tsx          # server component: fetches via db, force-dynamic
    <feature>/<feature>-client.tsx  # client component: interactivity
    api/<feature>/route.ts      # route handlers: zod-validated, NextResponse.json
    layout.tsx                  # root layout, PWA metadata
  components/                   # shared React components (e.g. sw-register)
  data/        # static linguistic data (verbs, cognate-rules, false-friends, ...) + *.test.ts
  db/
    client.ts  # drizzle client singleton (db, DB type)
    schema.ts  # tables: decks, notes, cards, review_log, vocabulary, settings
    migrate.ts seed.ts import-vocab.ts gen-audio.ts  # tsx scripts
  lib/         # pure logic (fsrs, prompts, cognates, streaks, tts, ...) + co-located *.test.ts
drizzle/       # generated SQL migrations (do not hand-edit)
tests/e2e/     # Playwright specs, one per feature
scripts/       # build-time tooling (icon gen)
```

Path alias: `@/` → `src/`.

## Commands

```bash
mise run dev          # db:migrate then dev server on 0.0.0.0:$PORT (default 3000)
mise run lan          # print LAN URLs for phone access
mise run check        # typecheck + eslint (fast pre-commit gate)

pnpm build            # next build (prod bundle)
pnpm typecheck        # tsc --noEmit
pnpm lint:ox          # oxlint --deny-warnings  (run FIRST — fastest)
pnpm lint             # eslint (next config)
pnpm test             # vitest run (unit)
pnpm test:cov         # vitest + v8 coverage (src/lib, src/data)
pnpm test:e2e         # playwright (auto-starts dev server on :3100)
pnpm test:e2e:ui      # playwright --ui

pnpm db:push          # push schema to DB (dev iteration)
pnpm db:generate      # generate SQL migration from schema diff
pnpm db:migrate       # apply migrations (used by CI + prod)
pnpm db:studio        # Drizzle Studio DB browser
pnpm db:seed          # seed deck + sample cards
pnpm db:import-vocab [N]  # import N vocab rows from frequency list
```

## Database & Environment

- Connection is driven entirely by `DATABASE_URL`. **Local dev uses `:5433`** (docker-compose maps host `5433`→container `5432`); **CI uses `:5432`** (direct postgres service). Copy `.env.example`→`.env` — do not assume `5432` locally.
- `docker compose up -d` starts Postgres; data persists in `./postgres-data` (gitignored).
- `src/db/client.ts` caches the `postgres` pool on `globalThis.__flipPg` outside production to survive HMR — preserve this pattern; never instantiate a second pool.
- Schema changes: edit `src/db/schema.ts`, then `pnpm db:generate` (commit the new `drizzle/*.sql`) or `pnpm db:push` for throwaway dev iteration. Never hand-edit generated migrations.
- Deployed DB access (pet-projects host): `ssh` + `docker exec` into the container and run `psql`.

## Adding a Feature (vertical slice)

Each learning feature is a full slice. Follow the existing per-feature pattern (mirror a sibling like `review/` or `cognates/`):

1. **Pure logic** → `src/lib/<feature>.ts` (or static data in `src/data/<feature>.ts`). Keep it side-effect-free; inject randomness/clock so tests are deterministic.
2. **Unit test** → co-located `src/lib/<feature>.test.ts`. Cover the logic, not the framework.
3. **API route** (if it needs server work) → `src/app/api/<feature>/route.ts`. Validate the body with a zod schema; return `NextResponse.json`.
4. **Page** → `src/app/<feature>/page.tsx` as a server component that reads `db`; delegate interactivity to `src/app/<feature>/<feature>-client.tsx`.
5. **E2E** → `tests/e2e/<feature>.spec.ts`.
6. Run the full gate (below) before committing.

### Templates to copy

- **API route** → mirror `src/app/api/mnemonic/route.ts`: `safeParse` the body (return `400` + `error.flatten()` on failure), wrap multi-writes in `db.transaction`, return `NextResponse.json`.
- **DB-reading page** → mirror `src/app/decks/page.tsx`: `export const dynamic = "force-dynamic"` (REQUIRED), `await db.select(...)` in the server component, hand rows to the `<feature>-client.tsx` for interactivity.

## AI / LLM Features

- Route **all** LLM calls through `getClaudeClient()` in `src/lib/claude.ts`. Default model `claude-haiku-4-5-20251001`.
- `getClaudeClient()` returns `null` when `ANTHROPIC_API_KEY` is unset — features **must degrade gracefully** (skip/placeholder), never crash. Same for TTS when its key is absent.
- Keep prompt builders + response parsers as pure exported functions (see `buildMnemonicPrompt` / `parseMnemonic`) so they're unit-testable without network calls.
- New models: the latest Claude family is Fable 5 and Claude 4.X (Opus 4.8, Sonnet 4.6, Haiku 4.5). Prefer the newest capable model for the task.

## Quality Gates

Before every commit, all must pass:

```bash
pnpm lint:ox && pnpm lint && pnpm typecheck && pnpm test
```

E2E (`pnpm test:e2e`) before pushing UI/flow changes. CI runs three jobs on PRs to `main`: **lint** (oxlint→eslint→typecheck), **unit** (vitest), **e2e** (Postgres service → migrate → seed → import-vocab → Playwright).

New features ship with **both** test tiers: vitest unit coverage of the logic **and** a Playwright e2e spec. Do not skip a tier.

## Testing Conventions

- Unit: vitest, node env, files `src/**/*.test.ts`, coverage scoped to `src/lib` + `src/data`. Test pure functions directly; inject `randomFn`/clock for determinism (see `shouldPrompt` in `src/lib/prompts.ts`).
- E2E: Playwright, serial (`workers: 1`, `fullyParallel: false`), against `:3100`. Auto-starts the dev server unless `E2E_BASE_URL` is set. Avoid timing races — assert on visible state, not delays.

## Anti-Patterns

**AVOID:**

- ❌ Assuming Postgres is on `:5432` locally — local dev is `:5433`. Mismatched `DATABASE_URL` silently breaks `db:push`/`db:migrate`.
- ❌ A DB-reading `page.tsx` without `export const dynamic = "force-dynamic"` — it gets statically cached at build and serves stale/empty data.
- ❌ Non-deterministic logic or flaky e2e timing — inject randomness/clock; e2e is serial on a single worker, so order-dependent or sleep-based tests break CI.
- ❌ LLM/TTS features that crash when API keys are unset — always handle the `getClaudeClient() === null` (and missing-TTS-key) path.
- ❌ A second `postgres()` pool — reuse the `db` singleton from `@/db/client`.
- ❌ Hand-editing files in `drizzle/` — regenerate from `schema.ts`.
- ❌ Shipping a feature with only one test tier — both unit and e2e are required.
- ❌ Linter suppression directives (disable comments, oxlint ignores) — fix the root cause; `lint:ox` runs with `--deny-warnings`.

## Extensibility

Add sections as the app grows (new subsystems, deploy runbook, schema notes). Keep entries concrete: real file paths, runnable commands, project-specific pitfalls — not generic advice.

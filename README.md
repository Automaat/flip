# Flip

Spanish learning app: FSRS spaced repetition, AI mnemonics, comprehensible input.
Self-hosted on home network, accessible from phone browser.

See [FEATURES.md](./FEATURES.md) for the full plan.

## Stack

- Next.js 16 (App Router, Turbopack) — TypeScript
- Tailwind CSS 4
- Drizzle ORM + Postgres 17
- ts-fsrs (FSRS scheduler)
- PWA (manifest + service worker) for phone install + offline shell

## Prereqs

- [mise](https://mise.jdx.dev) — manages Node + pnpm
- Docker (for Postgres)

## Quickstart

```sh
mise install                  # installs Node + pnpm
cp .env.example .env
docker compose up -d          # starts Postgres on :5432
pnpm install
pnpm db:push                  # apply Drizzle schema
pnpm dev                      # listens on 0.0.0.0:3000
```

Then on your phone, open `http://<server-lan-ip>:3000`.
Find the LAN IP with `ipconfig getifaddr en0` (macOS) or `hostname -I` (Linux).

## Scripts

| Command            | What                              |
|--------------------|-----------------------------------|
| `pnpm dev`         | Dev server on `0.0.0.0:$PORT`     |
| `pnpm build`       | Production build                  |
| `pnpm start`       | Production server on `0.0.0.0`    |
| `pnpm lint`        | ESLint                            |
| `pnpm typecheck`   | tsc --noEmit                      |
| `pnpm db:push`     | Push Drizzle schema to Postgres   |
| `pnpm db:studio`   | Drizzle Studio (web DB browser)   |
| `pnpm db:generate` | Generate SQL migration            |
| `pnpm db:migrate`  | Apply migrations                  |

mise tasks mirror these: `mise run dev`, `mise run db-push`, etc.

## Layout

```
src/
  app/              # Next.js App Router (pages + API routes)
  components/       # React components
  db/
    client.ts       # Drizzle client
    schema.ts       # Tables: notes, cards, review_log, decks, vocabulary
  lib/
    fsrs.ts         # FSRS scheduler wrapper
public/
  manifest.webmanifest
  sw.js             # Service worker (offline app shell)
  icon-*.png        # PWA icons
```

## Home-network access

`next dev`/`start` bind to `0.0.0.0` so any LAN device can reach the server.
For phone install: open in Safari/Chrome → "Add to Home Screen" → installs as PWA.

For HTTPS (required for some PWA features), front with Caddy/nginx + Tailscale
or use mkcert for a local CA.

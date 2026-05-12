#!/bin/sh
set -eu

# Wait for postgres to accept connections.
echo "[entrypoint] waiting for DATABASE_URL to accept connections…"
i=0
until node -e "
  const postgres = require('postgres');
  const sql = postgres(process.env.DATABASE_URL);
  sql\`select 1\`.then(() => sql.end()).then(() => process.exit(0)).catch(() => process.exit(1));
" 2>/dev/null; do
  i=$((i+1))
  if [ "$i" -gt 60 ]; then
    echo "[entrypoint] postgres did not come up in 60s, giving up"
    exit 1
  fi
  sleep 1
done
echo "[entrypoint] postgres ready"

# Make installed CLIs (tsx, drizzle-kit) discoverable for one-shot scripts.
export PATH="/app/.node_modules-init/.bin:$PATH"
export NODE_PATH="/app/node_modules:/app/.node_modules-init/.pnpm/node_modules"

# 1. Migrations (idempotent).
echo "[entrypoint] applying migrations"
tsx src/db/migrate.ts

# 2. Seed vocab cards if the deck doesn't exist yet.
echo "[entrypoint] seeding base deck (idempotent)"
tsx src/db/seed.ts || true

# 3. Import frequency list if vocabulary table is small.
NEED_VOCAB=$(node -e "
  const postgres = require('postgres');
  const sql = postgres(process.env.DATABASE_URL);
  sql\`select count(*)::int as n from vocabulary\`.then(([r]) => { console.log(r.n < 1000 ? '1' : '0'); return sql.end(); }).catch(() => { console.log('1'); });
")
if [ "$NEED_VOCAB" = "1" ]; then
  echo "[entrypoint] importing vocabulary (first run)"
  tsx src/db/import-vocab.ts 5000 || echo "[entrypoint] vocab import failed; continuing"
fi

# 4. Generate audio if /app/public/audio is empty.
if [ -z "$(ls -A public/audio 2>/dev/null)" ]; then
  mkdir -p public/audio
  echo "[entrypoint] generating audio (first run; ~5 min)"
  tsx src/db/gen-audio.ts || echo "[entrypoint] audio gen failed; app starts without it"
fi

echo "[entrypoint] starting Next.js"
exec "$@"

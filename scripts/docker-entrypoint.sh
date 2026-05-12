#!/bin/sh
set -eu

if [ -z "${DATABASE_URL:-}" ]; then
  echo "[entrypoint] DATABASE_URL is required"
  exit 1
fi

# 1. Wait for postgres via pg_isready against the URL.
echo "[entrypoint] waiting for postgres…"
i=0
until pg_isready -q -d "$DATABASE_URL"; do
  i=$((i+1))
  if [ "$i" -gt 60 ]; then
    echo "[entrypoint] postgres not ready after 60s, giving up"
    exit 1
  fi
  sleep 1
done
echo "[entrypoint] postgres ready"

# 2. Init-time scripts run from /app-init where the full node_modules
# (including tsx + drizzle-kit) lives.
cd /app-init

echo "[entrypoint] applying migrations"
./node_modules/.bin/tsx src/db/migrate.ts

echo "[entrypoint] seeding base deck (idempotent)"
./node_modules/.bin/tsx src/db/seed.ts || true

NEED_VOCAB=$(psql -At -d "$DATABASE_URL" \
  -c "select case when count(*) < 1000 then 1 else 0 end from vocabulary" \
  2>/dev/null || echo "1")
if [ "$NEED_VOCAB" = "1" ]; then
  echo "[entrypoint] importing vocabulary (first run)"
  ./node_modules/.bin/tsx src/db/import-vocab.ts 5000 \
    || echo "[entrypoint] vocab import failed; continuing"
fi

cd /app
if [ -z "$(ls -A public/audio 2>/dev/null)" ]; then
  echo "[entrypoint] generating audio (first run; ~5 min)"
  # gen-audio writes to cwd/public/audio; ensure it's the bind-mounted dir.
  rm -rf /app-init/public
  ln -sfn /app/public /app-init/public
  cd /app-init
  ./node_modules/.bin/tsx src/db/gen-audio.ts \
    || echo "[entrypoint] audio gen failed; app starts without it"
  cd /app
fi

echo "[entrypoint] starting Next.js"
exec "$@"

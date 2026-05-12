# syntax=docker/dockerfile:1.7

###############
# 1. deps
###############
FROM node:22-alpine AS deps
WORKDIR /app
RUN apk add --no-cache libc6-compat
RUN corepack enable

COPY package.json pnpm-lock.yaml ./
# --ignore-scripts is safe here: build-time native modules (sharp, esbuild
# binaries, etc.) aren't required for the runtime app; sharp is only used
# by the icons:gen dev script.
RUN pnpm install --frozen-lockfile --ignore-scripts

###############
# 2. build
###############
FROM node:22-alpine AS build
WORKDIR /app
RUN corepack enable

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
# Next.js evaluates route handlers during `collect page data` even for
# force-dynamic routes; src/db/client.ts throws if DATABASE_URL is missing.
# Provide a dummy URL — no connection happens at build time.
ENV DATABASE_URL=postgres://flip:flip@127.0.0.1:5432/flip
RUN pnpm build

###############
# 3. runner
###############
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOST=0.0.0.0

# postgresql-client gives us pg_isready + psql (~12MB). tini for PID 1.
RUN apk add --no-cache tini curl postgresql-client

# Init bundle lives in /app-init so the standalone server's own
# node_modules in /app stays untouched.
RUN mkdir -p /app-init
COPY --from=build /app/node_modules /app-init/node_modules
COPY --from=build /app/src /app-init/src
COPY --from=build /app/drizzle /app-init/drizzle
COPY --from=build /app/drizzle.config.ts /app-init/drizzle.config.ts
COPY --from=build /app/package.json /app-init/package.json
COPY --from=build /app/tsconfig.json /app-init/tsconfig.json
# Fail loudly if any of the init bundle is missing.
RUN test -f /app-init/tsconfig.json \
 && test -f /app-init/drizzle.config.ts \
 && test -d /app-init/src \
 || (echo "Missing init bundle file!" && ls -la /app-init && exit 1)

# Non-root user for the long-lived Next.js server.
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Bring in Next standalone output + static + public.
COPY --from=build --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=build --chown=nextjs:nodejs /app/public ./public

# Audio dir is a volume target; ensure ownership before the run user takes
# over so first-boot audio:gen can write.
RUN mkdir -p /app/public/audio && chown -R nextjs:nodejs /app/public/audio
# audio:gen runs from /app-init with cwd there; src/lib/tts.ts resolves
# AUDIO_DIR = cwd/public/audio. Symlink /app-init/public -> /app/public so
# the generated files land in the bind-mounted volume.
RUN ln -s /app/public /app-init/public

COPY scripts/docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=120s --retries=5 \
  CMD curl -fsS http://localhost:3000/api/health || exit 1

ENTRYPOINT ["/sbin/tini", "--", "/usr/local/bin/docker-entrypoint.sh"]
CMD ["node", "server.js"]

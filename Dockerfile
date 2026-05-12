# syntax=docker/dockerfile:1.7

###############
# 1. deps
###############
FROM node:22-alpine AS deps
WORKDIR /app
RUN apk add --no-cache libc6-compat
RUN corepack enable pnpm

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

###############
# 2. build
###############
FROM node:22-alpine AS build
WORKDIR /app
RUN corepack enable pnpm

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

RUN apk add --no-cache tini curl
RUN corepack enable pnpm

# Non-root user for Next.js runtime; runs the long-lived server.
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Bring in Next standalone output + static + public.
COPY --from=build --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=build --chown=nextjs:nodejs /app/public ./public

# Init scripts (run as root before the server). These need tsx + drizzle-kit
# from the build stage; copy the necessary node_modules.
COPY --from=build /app/node_modules/.pnpm /app/.node_modules-init/.pnpm
COPY --from=build /app/node_modules/.bin /app/.node_modules-init/.bin
COPY --from=build /app/drizzle ./drizzle
COPY --from=build /app/src/db ./src/db
COPY --from=build /app/src/data ./src/data
COPY --from=build /app/src/lib ./src/lib
COPY --from=build /app/drizzle.config.ts ./drizzle.config.ts
COPY --from=build /app/package.json /app/pnpm-lock.yaml ./
COPY scripts/docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -fsS http://localhost:3000/api/health || exit 1

ENTRYPOINT ["/sbin/tini", "--", "/usr/local/bin/docker-entrypoint.sh"]
CMD ["node", "server.js"]

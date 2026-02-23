# Task: Dockerfile & .dockerignore

**ID:** p01-04
**Status:** pending
**Depends on:** p01-01
**Context size:** small
**Branch:** `p01-04-dockerfile`
**Target LOC:** ~80 (max 400)

## Goal

Create a multi-stage Dockerfile for SSR deployment, modeled on scbd/bioland-head, adapted for pnpm.

## Pre-flight

1. Verify clean repo: `git status`
2. Create task branch: `git checkout -b p01-04-dockerfile`
3. Memory recall: Search Neo4j for `dockerfile nuxt`, `docker multi-stage`, `pnpm docker`

## Inputs

- Phase context: `phase-01/context.md`
- Reference: https://github.com/scbd/bioland-head/blob/nuxt4/Dockerfile

## Steps

1. Create `Dockerfile` with 4 stages (adapted from bioland-head for pnpm):

   **Stage 1: base** — Node 24 slim, install OS utils, enable corepack/pnpm
   ```dockerfile
   FROM node:24-bookworm-slim AS base
   ENV NODE_ENV=production
   WORKDIR /usr/src/app
   RUN apt-get update && \
       apt-get install -y --no-install-recommends ca-certificates dumb-init && \
       rm -rf /var/lib/apt/lists/*
   RUN corepack enable && corepack prepare pnpm@latest --activate
   ```

   **Stage 2: deps** — Install production dependencies only
   ```dockerfile
   FROM base AS deps
   COPY package.json pnpm-lock.yaml ./
   RUN pnpm install --frozen-lockfile --prod
   ```

   **Stage 3: build** — Install all dependencies, build Nuxt
   ```dockerfile
   FROM base AS build
   ENV NODE_ENV=development
   COPY package.json pnpm-lock.yaml ./
   RUN pnpm install --frozen-lockfile
   COPY . ./
   ENV NODE_OPTIONS="--max-old-space-size=4096"
   RUN pnpm build
   ```

   **Stage 4: runner** — Minimal production image
   ```dockerfile
   FROM node:24-bookworm-slim AS runner
   ENV NODE_ENV=production
   WORKDIR /usr/src/app
   RUN groupadd --system nodejs && useradd --system --gid nodejs nuxt
   COPY --from=base /usr/bin/dumb-init /usr/bin/dumb-init
   COPY --from=deps /usr/src/app/node_modules ./node_modules
   COPY --from=build /usr/src/app/.output ./.output
   ENV PORT=8000
   ENV NUXT_HOST=0.0.0.0
   ENV NUXT_PORT=8000
   EXPOSE 8000
   USER nuxt
   CMD ["dumb-init", "node", ".output/server/index.mjs"]
   ```

2. Create `.dockerignore`:
   ```
   .git
   .github
   .nuxt
   .output
   node_modules
   .env
   .env.*
   !.env.example
   *.md
   .vscode
   .idea
   tasks/
   ```

3. Create `docker-compose.yml` for local development:
   ```yaml
   services:
     app:
       build: .
       ports:
         - "8000:8000"
       environment:
         - NUXT_DATO_API_TOKEN=${NUXT_DATO_API_TOKEN}
         - NUXT_PUBLIC_BASE_URL=${NUXT_PUBLIC_BASE_URL}
         - NUXT_PUBLIC_CANONICAL_BASE_URL=${NUXT_PUBLIC_CANONICAL_BASE_URL}
         - NUXT_PUBLIC_GA_TAG_ID=${NUXT_PUBLIC_GA_TAG_ID}
   ```

## Testing

- [ ] `docker build -t circusliving-amp .` completes successfully
- [ ] `docker run -p 8000:8000 circusliving-amp` serves the app
- [ ] Container runs as non-root user `nuxt`
- [ ] `.dockerignore` excludes node_modules and .git

## Outputs

- `Dockerfile`
- `.dockerignore`
- `docker-compose.yml`

## Done When

- [ ] Docker image builds in multi-stage
- [ ] Container starts and serves on port 8000
- [ ] Image size is minimal (slim base, production deps only)

## Commits

Final commit: `p01-04-dockerfile`

## Rollback

- Delete Dockerfile, .dockerignore, docker-compose.yml

## Handoff

Next: `phase-02/p02-01-types-and-queries.md`
State: Phase 01 complete. Nuxt 4 project skeleton exists with config, TypeScript, ESLint, Prettier, and Docker support. Dev server boots. Docker builds.

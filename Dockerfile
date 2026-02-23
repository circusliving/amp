# Stage 1: Base — Node 24 slim, OS utils, pnpm
FROM node:24-bookworm-slim AS base
ENV NODE_ENV=production
WORKDIR /usr/src/app
RUN apt-get update && \
    apt-get install -y --no-install-recommends ca-certificates dumb-init && \
    rm -rf /var/lib/apt/lists/*
RUN corepack enable && corepack prepare pnpm@latest --activate

# Stage 2: Dependencies — production only
FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod

# Stage 3: Build — all deps, build Nuxt
FROM base AS build
ENV NODE_ENV=development
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . ./
ENV NODE_OPTIONS="--max-old-space-size=4096"
RUN pnpm build

# Stage 4: Runner — minimal production image
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

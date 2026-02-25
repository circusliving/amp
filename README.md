# Circus Living — Web Application

A Nuxt 4 SSR application backed by DatoCMS, served via Docker.

## Tech Stack

- **Nuxt 4** — Vue 3 `<script setup lang="ts">`, file-based routing
- **Pinia** — state management (menu, article, navigation stores)
- **DatoCMS** — headless CMS via `graphql-request`
- **Bootstrap 5** — UI framework via SCSS
- **`@nuxt/image`** — responsive image optimisation with DatoCMS CDN
- **Vitest 4** — unit + integration testing
- **Playwright** — end-to-end testing
- **Docker** — multi-stage production image (Node 24)

---

## Local Development

### Requirements

- Node 20+
- pnpm 9+

### Setup

```bash
git clone https://github.com/circusliving/amp.git
cd amp
pnpm install
```

### Environment Variables

Copy `.env.example` to `.env` and populate:

| Variable | Description |
|---|---|
| `NUXT_DATO_API_TOKEN` | DatoCMS read API token |
| `NUXT_PUBLIC_BASE_URL` | Public base URL (e.g. `http://localhost:3000`) |
| `NUXT_PUBLIC_CANONICAL_BASE_URL` | Canonical URL for SEO (e.g. `https://www.circusliving.com`) |
| `NUXT_PUBLIC_GA_TAG_ID` | Google Analytics tag ID (optional) |

### Start Dev Server

```bash
pnpm dev
```

### Type Check

```bash
pnpm typecheck
```

### Lint

```bash
pnpm lint        # check
pnpm lint:fix    # auto-fix
```

### Format

```bash
pnpm format
```

---

## Testing

### Unit & Integration Tests (Vitest)

```bash
pnpm test              # run once
pnpm test:watch        # watch mode
pnpm test:coverage     # with coverage report
```

### End-to-End Tests (Playwright)

Requires a running dev server (started automatically if not already up):

```bash
pnpm test:e2e
```

Install Playwright browsers once:

```bash
npx playwright install chromium
```

---

## Docker

### Build & Run with docker compose

```bash
# Start
docker compose up -d

# Tail logs
docker compose logs -f

# Stop
docker compose down
```

The app is served on port **8000**.

### Manual Build

```bash
docker build -t circusliving-web .
docker run -p 8000:8000 \
  -e NUXT_DATO_API_TOKEN=your-token \
  -e NUXT_PUBLIC_BASE_URL=http://localhost:8000 \
  -e NUXT_PUBLIC_CANONICAL_BASE_URL=https://www.circusliving.com \
  circusliving-web
```

---

## Directory Structure

```
.
├── app/                        # Nuxt srcDir
│   ├── assets/scss/            # Bootstrap 5 + variables
│   ├── components/             # Vue components
│   ├── composables/            # useSeoHead, useWebPage, useImageAttrs
│   ├── layouts/default.vue
│   ├── pages/                  # File-based routes
│   ├── plugins/analytics.client.ts
│   ├── stores/                 # Pinia stores
│   ├── utils/                  # helpers, date-format, image-service
│   ├── app.vue
│   └── error.vue
├── server/
│   ├── api/                    # Nitro API routes
│   ├── routes/                 # Redirect routes
│   └── utils/                  # dato-client, dato-fetch, graphql-queries, etc.
├── shared/types/               # TypeScript types shared between app + server
├── tests/e2e/                  # Playwright specs
├── locales/                    # i18n (en.ts, fr.ts)
├── public/                     # Static assets
├── Dockerfile
├── docker-compose.yml
├── nuxt.config.ts
├── playwright.config.ts
├── vitest.config.ts
└── tsconfig.json
```

---

## Content Management

Edit content at [DatoCMS](https://circusliving.admin.datocms.com/editor).

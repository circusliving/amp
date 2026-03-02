# Phase 01: Prerequisites & Page Enumeration

## Purpose

Ensure the local dev environment is fully functional (APIs responding, DatoCMS connected) and enumerate every URL that needs auditing. Without working APIs, most pages render empty or error — so this phase must complete first.

## Shared Context

- Live site: `https://circusliving.com/` (AMP, Nuxt 2, Vue 2, S3 static hosting)
- Local site: `http://localhost:3000/` (Nuxt 4, Vue 3, SSR, Docker-ready)
- The DatoCMS API token is configured via `NUXT_DATO_API_TOKEN` in `.env`
- All server API routes use `server/utils/dato-client.ts` singleton GraphQL client
- The menu tree is fetched at `GET /api/menu` → `fetchMenuItems()` → `buildMenuTree()`
- Web pages are fetched at `GET /api/web-pages/:path` → `fetchWebPageByPath()`
- Articles are at `GET /api/articles/:id` and `GET /api/articles/latest?limit=N`

## Key Files

| File | Purpose |
|------|---------|
| `.env` | DatoCMS API token + public URLs |
| `server/utils/dato-client.ts` | Singleton GraphQL client |
| `server/utils/dato-fetch.ts` | All CMS fetch functions |
| `server/api/menu.get.ts` | Menu tree endpoint |
| `server/api/web-pages/[...path].get.ts` | Web page by path |
| `server/api/articles/latest.get.ts` | Latest articles |

## Constraints

- Do NOT reveal API token values — reference `.env` only
- Do NOT fix issues — only document them
- APIs must be returning 200 before Phase 02 can begin

# Task: Verify Dev Server & API Health

**ID:** p01-01
**Status:** pending
**Depends on:** none
**Context size:** small

## Goal

Confirm the local Nuxt 4 dev server is running and all DatoCMS API endpoints return 200 with valid data.

## Inputs

- Phase context: `phase-01/context.md`
- `.env` file (reference only — do not display values)
- `server/utils/dato-client.ts`

## Steps

1. Verify `http://localhost:3000/` returns 200
2. Test each API endpoint and document status:
   - `GET /api/menu` — should return menu tree JSON
   - `GET /api/web-pages/` — should return homepage web page data
   - `GET /api/web-pages/side-shows` — should return section page data
   - `GET /api/articles/latest?limit=3` — should return array of articles
   - `GET /api/articles/[any-valid-id]` — should return article detail
   - `GET /api/image-objects/[any-valid-id]` — should return image object
   - `GET /api/places/[any-valid-id]` — should return place data
   - `GET /api/identifiers/[any-value]` — should return identifier data
3. If any endpoint returns 503 or error:
   - Check that `NUXT_DATO_API_TOKEN` is set in `.env`
   - Check that `nuxt.config.ts` runtimeConfig maps it correctly
   - Check `server/utils/dato-client.ts` reads the token from runtime config
   - Run `curl -X POST https://graphql.datocms.com/ -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d '{"query":"{ _site { globalSeo { siteName } } }"'` to verify token validity
   - Document the root cause of the 503
4. Record the status of every endpoint in the task output

## Outputs

- API health status table (endpoint → status code → response summary)
- Root cause documentation if any endpoints fail
- Confirmation that Phase 02 can proceed (all APIs returning 200)

## Done When

- [ ] All API endpoints tested and status documented
- [ ] If failures exist, root cause identified and documented
- [ ] Clear go/no-go decision for Phase 02

## Handoff

Next: `phase-01/p01-02-enumerate-urls.md`
State: API health status — if any are failing, p01-02 will need to work around it or block

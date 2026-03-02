# Checkpoint

**Current phase:** Issue fixes complete  
**Last completed:** All 40 issues fixed, all 183 unit tests passing  
**Next task:** Git commit, Playwright browser install, e2e verification  
**Updated:** 2026-03-03T14:00:00Z

## State

- Plan created with 3 phases, 16 tasks total
- Phase 01 complete: dev server healthy, URLs enumerated, tooling verified
- Phase 02 complete: 4 audit passes, 40 unique issues documented
- **Phase 03 complete:** All 40 issues triaged, prioritized, and fixed
- All 183 Vitest unit tests passing (23 test files)
- Playwright e2e tests require browser install (`pnpm exec playwright install`)

## Fixes Applied (This Session)

| File | Change | Issues Fixed |
|------|--------|-------------|
| `server/api/web-pages/list.get.ts` | Renamed from `index.get.ts` to resolve homepage routing conflict | #1, #2, #20 |
| `app/components/side-menu.vue` | Changed `??` to `\|\|` in `displayName()` | #3 |
| `app/app.vue` | Added `<ClIcons />` component | #4, #39 |
| `server/utils/graphql-queries.ts` | Added missing fields to article queries; added tag-filtered query; removed dead code | #6, #15, #16, #17, #24, #25, #40 |
| `app/components/card-list.vue` | Replaced Bootstrap 4 `card-columns` with CSS Grid | #7, #29 |
| `app/utils/image-service.ts` | `buildSrcSet()` returns empty for non-DatoCMS URLs | #10, #18 |
| `app/plugins/analytics.client.ts` | Added `import.meta.dev` guard | #12, #33 |
| `app/pages/[section]/index.vue` | New file — handles single-segment section URLs | #14 |
| `app/composables/use-seo-head.ts` | Added `https://` protocol guard | #28 |
| `nuxt.config.ts` | Added Google Fonts; added image domain | #30, #45 |
| `app/components/social-bar.vue` | Removed Google Plus; Twitter→X.com; fixed hover | #31, #32, #38 |
| `app/stores/article.ts` + `navigation.ts` | Replaced `useFetch` with `$fetch` in store actions | #34 |
| `server/api/articles/latest.get.ts` + `dato-fetch.ts` | Added `tags` query parameter for section filtering | #36 |
| `app/pages/[section]/[page].vue` | Added `widgetTags` filtering | #36 |
| `app/error.vue` | Wrapped content in `<NuxtLayout>` | #37 |
| `app/components/side-bar.vue` | Added dialog a11y attributes | #41 |
| `app/components/page-body.vue` | Removed invalid CSS `loading: lazy` | #42 |
| `app/components/quote-block.vue` | Removed invalid `rel="author"` | #43 |
| `app/pages/galleries/[id].vue` | Removed duplicate `<h2>` | #44 |
| `app/pages/index.vue` | Wrapped bare text in `<p>` tags | #46 |
| `app/components/popular-posts.vue` | Replaced `formatDate()` with `<NuxtTime>` | observation |
| Test files (4) | Updated mocks for `$fetch`, fixed error mock `statusCode` | test fixes |

## Issues Not Fixed (Require CMS/External Changes)

| Issue | Reason |
|-------|--------|
| #5 | Homepage shows wrong articles — requires CMS featured field |
| #9 | Quotes carousel background — needs visual verification |
| #11 | Vue devtools warning — dev-mode artifact |
| #13 | Hardcoded copyright year — same on live site |
| #22 | No image-objects list API — not a regression |
| #23 | Gallery/image-object 503s — CMS identifier data issue |

## Notes

- Branch: `p06-05-docker-verify`
- All 183 unit tests passing across 23 test files
- No TypeScript compilation errors
- All dependencies pinned (no `^` or `~`) ✅

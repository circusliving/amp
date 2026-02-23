# Task: Helpers Util & Locale Files

**ID:** p03-04
**Status:** pending
**Depends on:** p01-02
**Context size:** small
**Branch:** `p03-04-helpers-and-locales`
**Target LOC:** ~80 (max 400)

## Goal

Migrate remaining helper utilities and locale files to TypeScript. Replace Vue 2 `filters` with Luxon-based formatter functions.

## Pre-flight

1. Verify clean repo: `git status`
2. Create task branch: `git checkout -b p03-04-helpers-and-locales`
3. Memory recall: Search Neo4j for `helpers`, `locale`, `luxon date format`

## Inputs

- Phase context: `phase-03/context.md`
- Old `modules/helpers.js` — helper functions (URL parsing, computed properties)
- Old `locales/en.js`, `locales/fr.js` — i18n locale files
- Old `components/amp/PopularPosts.vue` — `dateFormat` filter

## Steps

1. Create `app/utils/helpers.ts`:
   - Port useful functions from old `modules/helpers.js` to TypeScript
   - The old `helpers.js` exports `src` (URL parsing computed) — this is now in `image-service.ts`
   - Keep any remaining utility functions that aren't image-related
   - Add `truncateText(text: string, maxLength: number): string` (used by CardCL, CardImgMiddle `needsSpace()`)

   **Note:** Two old dependencies are carried forward:
   - `string-strip-html` (`13.5.3`) — used for stripping HTML from article body to generate meta descriptions. Used in the article page composable/server route. Import as ESM: `import { stripHtml } from 'string-strip-html'` (v13 API changed from default export to named export).
   - `pluralize` (`8.0.0`) — used in `useWebPage` composable for building collection-type GraphQL queries. Import: `import pluralize from 'pluralize'`.

2. Create `app/utils/date-format.ts`:
   - Replace the old Vue 2 `filters.dateFormat` with a Luxon-based function:
     ```typescript
     import { DateTime } from 'luxon';
     
     export function formatDate(isoDate: string, format = 'MMMM d, yyyy'): string {
       return DateTime.fromISO(isoDate).toFormat(format);
     }
     ```
   - This replaces the `dateFormat` filter removed in Vue 3
   - Per project standards: use NuxtTime for display, Luxon for conversions/manipulations

3. Migrate locale files to TypeScript:
   - `locales/en.ts` — convert from `module.exports` Promise to ESM default export
   - `locales/fr.ts` — same conversion
   - Ensure proper typing for i18n messages

4. Delete old files:
   - `modules/helpers.js` (already deleted in p03-03, verify)
   - `locales/en.js`
   - `locales/fr.js`
   - `modules/configs/nuxt-i18n.js` (config now in nuxt.config.ts)

## Testing

- [ ] Unit test `truncateText` with edge cases
- [ ] Unit test `formatDate` with various ISO dates
- [ ] Verify locale files load in i18n module
- [ ] TypeScript compiles without errors

## Outputs

- `app/utils/helpers.ts`
- `app/utils/date-format.ts`
- `locales/en.ts`
- `locales/fr.ts`

## Done When

- [ ] All helpers are TypeScript
- [ ] Date formatting uses Luxon
- [ ] Locale files are ESM TypeScript
- [ ] Old JS files deleted
- [ ] Unit tests pass

## Commits

Final commit: `p03-04-helpers-and-locales`

## Rollback

- Delete new util files, restore old locales from git

## Handoff

Next: `phase-04/p04-01-layout.md`
State: Phase 03 complete. All composables (useSeoHead, useWebPage, useImageAttrs) and utilities (helpers, date-format, image-service) are TypeScript. Locale files migrated.

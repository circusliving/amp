# Task: useImageAttrs Composable & Image Service Util

**ID:** p03-03
**Status:** pending
**Depends on:** p02-01
**Context size:** small
**Branch:** `p03-03-use-image-attrs`
**Target LOC:** ~100 (max 400)

## Goal

Create `useImageAttrs()` composable and `image-service.ts` utility to replace the duplicated image dimension/attribute logic. Integrate with `@nuxt/image` where possible.

## Pre-flight

1. Verify clean repo: `git status`
2. Create task branch: `git checkout -b p03-03-use-image-attrs`
3. Memory recall: Search Neo4j for `image service`, `nuxt image`, `image dimensions`

## Inputs

- Phase context: `phase-03/context.md`
- Old `modules/ImageService.js` — singleton class with dimension fetching
- Old `modules/helpers.js` — `src()` function for URL parsing
- Old `components/amp/HeroTitle.vue` — `src()` computed for image URL parsing
- Old `components/amp/PageBody.vue` — width/height/alt computed properties

## Steps

1. Create `app/utils/image-service.ts`:
   - Convert old `ImageService.js` class to typed functions
   - `parseImageUrl(url: string): { pathname: string; filename: string; extension: string }`
   - `buildSrcSet(url: string, widths: number[]): string` — generate responsive srcset
   - `getImageDimensions(url: string): Promise<{ width: number; height: number }>` — 
     Use `@nuxt/image` APIs or DatoCMS image API `?w=&h=` params instead of HTTP HEAD requests
   - Remove the old HTTP HEAD dimension-fetching pattern (fragile, depends on S3 custom headers)
   - DatoCMS images include `?w=` and `?h=` query params + responsive image API

2. Create `app/composables/use-image-attrs.ts`:
   ```typescript
   interface ImageAttrsOptions {
     url: MaybeRefOrGetter<string>;
     alt?: MaybeRefOrGetter<string>;
     widths?: number[];
   }
   
   export function useImageAttrs(options: ImageAttrsOptions) {
     const url = toRef(options.url);
     const alt = toRef(options.alt ?? '');
     
     const srcSet = computed(() => buildSrcSet(url.value, options.widths ?? [320, 640, 960, 1280]));
     const src = computed(() => url.value);
     
     return { src, srcSet, alt };
   }
   ```

3. This composable replaces:
   - `src()` function duplicated in HeroTitle.vue and PopularPosts.vue (dead code)
   - `width()`, `height()`, `alt()` computed in PageBody.vue and articles/_id.vue
   - `getImageAttrs()` in articles/_id.vue

4. Delete old files:
   - `modules/ImageService.js`
   - `modules/helpers.js`

## Testing

- [ ] Unit test `parseImageUrl` with various URL formats
- [ ] Unit test `buildSrcSet` output
- [ ] Unit test `useImageAttrs` composable
- [ ] Verify no HTTP HEAD requests are made for dimensions

## Outputs

- `app/utils/image-service.ts`
- `app/composables/use-image-attrs.ts`

## Done When

- [ ] All image attribute logic consolidated (zero duplication)
- [ ] No HTTP HEAD dimension-fetching pattern
- [ ] Composable is typed and reactive
- [ ] Old ImageService.js and helpers.js deleted
- [ ] Unit tests pass

## Commits

Final commit: `p03-03-use-image-attrs`

## Rollback

- Delete `app/utils/image-service.ts` and `app/composables/use-image-attrs.ts`

## Handoff

Next: `phase-03/p03-04-helpers-and-locales.md`
State: Image composable and utility ready. Components can use `useImageAttrs()` for all image handling.

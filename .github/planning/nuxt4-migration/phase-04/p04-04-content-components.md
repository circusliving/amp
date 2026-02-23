# Task: Content Components (Hero, PageBody, Quotes, Section Headers)

**ID:** p04-04
**Status:** pending
**Depends on:** p03-03
**Context size:** medium
**Branch:** `p04-04-content-components`
**Target LOC:** ~200 (max 400)

## Goal

Migrate hero title, page body, quotes, and section header components. These have the heaviest AMP usage (parallax effects, carousels, amp-img with responsive layouts). Replace all with standard HTML/CSS.

## Pre-flight

1. Verify clean repo: `git status`
2. Create task branch: `git checkout -b p04-04-content-components`
3. Memory recall: Search Neo4j for `hero component`, `carousel`, `parallax css`

## Inputs

- Phase context: `phase-04/context.md`
- Old `components/amp/HeroTitle.vue` — `<amp-img>` with parallax (`amp-fx`), Node.js `require('url')`, complex computed
- Old `components/amp/PageBody.vue` — `v-html`, ImageService methods, `<amp-img>` responsive
- Old `components/amp/AmpQuote.vue` — simple quote display
- Old `components/amp/AmpQuotes.vue` — `<amp-carousel>` with parallax image background
- Old `components/amp/AmpSectionHeaderH2.vue` — `<h2>` wrapper
- Old `components/amp/AmpSectionHeaderH3.vue` — `<h3>` wrapper
- `app/composables/use-image-attrs.ts` (from p03-03)

## Steps

1. Create `app/components/hero-title.vue`:
   - Replace `<amp-img amp-fx="parallax">` with:
     - Standard `<img>` or `<NuxtImg>` with CSS `object-fit: cover`
     - Optional CSS parallax: `background-attachment: fixed` or `transform` on scroll
     - Or simply remove parallax (AMP-era gimmick, not needed for good UX)
   - Replace Node.js `require('url').parse()` and `require('path').parse()` with:
     - `new URL(url)` for URL parsing
     - Use `parseImageUrl()` from `app/utils/image-service.ts`
   - Props: typed interface for image/title data
   - Remove duplicated `src()` computed (now in image-service util)

2. Create `app/components/page-body.vue`:
   - Keep `v-html` for CMS content rendering (article body)
   - Replace `<amp-img layout="responsive">` with responsive `<img>`:
     - CSS: `width: 100%; height: auto;` or `aspect-ratio`
   - Remove duplicated width/height/alt computed → use `useImageAttrs()`
   - Remove ImageService class method calls → use utility functions
   - Scoped styles for CMS content (use `:deep()` selector for content inside v-html)

3. Create `app/components/quote-block.vue` (renamed from AmpQuote):
   - Simple component, just props to `<blockquote>` conversion
   - Props: `{ quote: string; author?: string }`

4. Create `app/components/quotes-carousel.vue` (renamed from AmpQuotes):
   - Replace `<amp-carousel type="slides" controls loop autoplay>` with:
     - CSS scroll-snap carousel:
       ```html
       <div class="carousel" role="region" aria-label="Quotes">
         <div class="carousel-track">
           <div v-for="quote in quotes" :key="quote.id" class="carousel-slide">
             <QuoteBlock :quote="quote.text" :author="quote.author" />
           </div>
         </div>
         <button aria-label="Previous" @click="prev">‹</button>
         <button aria-label="Next" @click="next">›</button>
       </div>
       ```
     - JS: `ref<number>` for current index, scroll-snap CSS
   - Replace parallax `<amp-img amp-fx="parallax">` background with CSS `background-image` + `background-attachment: fixed`
   - Accessible navigation buttons with aria-labels

5. Create `app/components/section-header-h2.vue`:
   - Props: `{ title: string; subtitle?: string }`
   - Simple `<h2>` render

6. Create `app/components/section-header-h3.vue`:
   - Props: `{ title: string; subtitle?: string }`
   - Simple `<h3>` render

7. Delete old files:
   - `components/amp/HeroTitle.vue`
   - `components/amp/PageBody.vue`
   - `components/amp/AmpQuote.vue`
   - `components/amp/AmpQuotes.vue`
   - `components/amp/AmpSectionHeaderH2.vue`
   - `components/amp/AmpSectionHeaderH3.vue`

## Testing

- [ ] Hero title renders image with proper sizing
- [ ] Page body renders CMS HTML safely
- [ ] Carousel navigates between quotes
- [ ] Carousel is keyboard accessible
- [ ] Section headers render correct heading levels
- [ ] No AMP elements in rendered output

## Outputs

- `app/components/hero-title.vue`
- `app/components/page-body.vue`
- `app/components/quote-block.vue`
- `app/components/quotes-carousel.vue`
- `app/components/section-header-h2.vue`
- `app/components/section-header-h3.vue`

## Done When

- [ ] 6 components migrated
- [ ] No AMP markup
- [ ] No Node.js require() calls
- [ ] No code duplication
- [ ] Carousel accessible
- [ ] Old files deleted

## Commits

Final commit: `p04-04-content-components`

## Rollback

- Delete new component files, restore old from git

## Handoff

Next: `phase-04/p04-05-utility-components.md`
State: Content components complete. Hero, page body, quotes, and section headers all standard HTML/CSS.

# Task: SCSS Cleanup, Accessibility & Performance Audit

**ID:** p06-04
**Status:** pending
**Depends on:** p06-03
**Context size:** small
**Branch:** `p06-04-scss-a11y-perf`
**Target LOC:** ~150 (max 400)

## Goal

Clean up SCSS for Bootstrap 5, ensure WCAG 2.1 AA compliance, and optimize Nuxt performance (bundle size, lazy loading, image optimization).

## Pre-flight

1. Verify clean repo: `git status`
2. Create task branch: `git checkout -b p06-04-scss-a11y-perf`
3. Memory recall: Search Neo4j for `bootstrap 5 migration`, `nuxt performance`, `wcag accessibility`

## Inputs

- Phase context: `phase-06/context.md`
- `app/assets/scss/main.scss` (from p01-02)
- All component `<style scoped>` blocks
- Accessibility test results from p06-03

## Steps

### SCSS Cleanup

1. Audit `app/assets/scss/main.scss`:
   - Verify only needed Bootstrap 5 modules are imported (not the full library)
   - Import order: variables → Bootstrap → custom overrides
   - Remove any dead CSS from AMP component styles

2. Audit component `<style scoped>` blocks:
   - Verify all component styles use `scoped` attribute
   - Remove duplicate styles (same rules in multiple components)
   - Extract shared styles to `app/assets/scss/_shared.scss` if needed
   - Verify no `!important` overrides unless absolutely necessary

3. Bootstrap 4 → 5 class updates (verify in templates):
   - `ml-*` / `mr-*` → `ms-*` / `me-*`
   - `pl-*` / `pr-*` → `ps-*` / `pe-*`
   - `float-left` / `float-right` → `float-start` / `float-end`
   - `text-left` / `text-right` → `text-start` / `text-end`
   - `badge-*` → `bg-*` on badges
   - `form-group` → `mb-3`
   - `media` → replaced with flex utilities
   - `data-toggle` → `data-bs-toggle`

### Accessibility Audit

4. Semantic HTML audit:
   - Verify all pages have exactly one `<h1>`
   - Verify heading hierarchy (h1 → h2 → h3, no skipping)
   - Verify all `<img>` tags have `alt` attributes
   - Verify all `<NuxtImg>` components have `alt` attributes
   - Verify all form inputs have associated `<label>` elements
   - Verify all interactive elements are keyboard accessible
   - Verify skip navigation link exists in layout

5. ARIA audit:
   - Add `aria-label` to navigation landmarks
   - Add `role="navigation"` where needed (NuxtLink groups)
   - Verify sidebar has proper ARIA (expanded/collapsed state)
   - Verify mobile menu toggle has `aria-expanded`
   - Add `aria-current="page"` to active nav links

6. Color contrast:
   - Verify all text meets 4.5:1 contrast ratio (AA)
   - Verify large text meets 3:1 contrast ratio
   - Check link colors are distinguishable from body text

7. Focus management:
   - Verify visible focus indicators on all interactive elements
   - Add `focus-visible` styles if missing
   - Verify tab order is logical

### Performance

8. Image optimization:
   - Verify all images use `<NuxtImg>` with `loading="lazy"` (except above-fold)
   - Set `width` and `height` on all images to prevent CLS
   - Verify responsive image `sizes` attribute is set
   - Configure `@nuxt/image` provider for DatoCMS CDN if applicable

9. Bundle analysis:
   - Run `npx nuxi analyze` to check bundle size
   - Verify no server-only code leaks into client bundle
   - Verify tree-shaking works (only used Bootstrap modules included)

10. Meta & SEO:
    - Verify `robots.txt` exists in `public/`
    - Verify `sitemap.xml` generation (configure `@nuxtjs/sitemap` or custom)
    - Verify canonical URLs set on all pages
    - Verify Open Graph image dimensions specified

11. Core Web Vitals check:
    - Run Lighthouse locally (or `npx unlighthouse`)
    - Target scores: Performance > 90, Accessibility > 95, Best Practices > 90, SEO > 95
    - Document any specific issues in task notes

## Testing

- [ ] Lighthouse scores meet targets
- [ ] No accessibility violations (axe scan)
- [ ] All styles render correctly with Bootstrap 5 classes
- [ ] No CLS from images (width/height set)
- [ ] Bundle size reasonable (< 200kb JS initial load)

## Outputs

- Updated `app/assets/scss/main.scss`
- Updated component `<style scoped>` blocks
- `public/robots.txt` (if not already)
- Accessibility fixes across components
- Performance optimizations

## Done When

- [ ] Bootstrap 5 classes fully audited and updated
- [ ] WCAG 2.1 AA compliance verified
- [ ] Lighthouse scores meet targets
- [ ] No dead CSS remains
- [ ] All images optimized

## Commits

Final commit: `p06-04-scss-a11y-perf`
Mid-task: `p06-04-scss-cleanup`, `p06-04-accessibility`, `p06-04-performance`

## Rollback

- Revert SCSS and component style changes

## Handoff

Next: `phase-06/p06-05-docker-verify.md`
State: App polished and optimized. Accessibility meets AA. Performance targets hit. Final step: Docker verification.

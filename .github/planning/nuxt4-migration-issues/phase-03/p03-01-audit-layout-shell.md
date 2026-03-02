# Task: Audit Layout Shell (Header, Sidebar, Footer)

**ID:** p03-01
**Status:** pending
**Depends on:** p02-10
**Context size:** medium

## Goal

Compare the site-wide layout shell — header bar, sidebar drawer, and footer — across all pages between live and local. These components appear on every page so issues here affect the entire site.

## Inputs

- Phase context: `phase-03/context.md`
- Issue count from Phase 02 (continue numbering)
- Components:
  - `app/layouts/default.vue` — layout wrapper
  - `app/components/header-bar.vue` — site header
  - `app/components/side-bar.vue` — sidebar drawer container
  - `app/components/side-menu.vue` — menu links
  - `app/components/footer-bar.vue` — site footer
  - `app/components/social-bar.vue` — social icons in side  - `app/components/social-bar.vue` — social icons in side  - `app/components/social-bar.vue` —sence and sizing
   - Hamburger menu icon: appearance, position, click behavior
   - Background color/transparency
   - Sticky/fixed behavior on scroll
   - Height and padding
   - Any other header elements (search, language toggle, etc.)

2. **Sidebar drawer comparison:**
   - Open/close animation (slide in from left? overlay?)
   - Background color and overlay
   - Menu items: order, text, link targets
   - Social icons: render correctly? (known issue: squares vs icons)
   - Close button: appearance and functionality
   - Click-outside-to-close behavior
   - Scroll behavior if menu is long

3. **Footer comparison:**
   - Content: copyright text, social links, other info
   - Layout: centered? columns?
   - Social bar: icons render? links work?
   - Background color
   - Sticky/fixed to bottom or flow with content?
   - Same footer on every page?

4. **Skip-to-content link** (accessibility):
   - `default.vue` has a skip-to-content link — does it work?
   - Is it visible on focus?
   - Does it skip to the correct content area?

5. **Layout transitions:**
   - Does the page content transition smoothly between routes?
   - Any layout shift during navigation?

## Outputs

- Continued issue list with layout shell issues
- Cross-page consistency findings

## Done When

- [ ] Header compared across 3+ pages
- [ ] Sidebar fully tested (open, close, links, icons)
- [ ] Footer compared across 3+ pages
- [ ] Skip-to-content tested
- [ ] All issues numbered

## Handoff

Next: `phase-03/p03-02-audit-icons-fonts.md`
State: Issue count + layout shell patterns noted

# Task: Audit Homepage

**ID:** p02-01
**Status:** complete
**Depends on:** p01-01, p01-02, p01-03
**Context size:** medium

## Goal

Compare the live homepage (`https://circusliving.com/`) to the local homepage (`http://localhost:3000/`) and document every visual, functional, and content discrepancy.

## Inputs

- Phase context: `phase-02/context.md`
- Comparison methodology: `phase-01/p01-03-setup-comparison-tooling.md`
- URL list: `temp/research/url-list.md`
- Known issues from prior recon (issues #1–#4 in human.md):
  1. Hero image not showing
  2. Menu items missing
  3. Social icons showing as colored squares
  4. Article cards section missing

## Steps

1. **Navigate to live homepage** (`https://circusliving.com/`)
   - Take full-page screenshot → `temp/screenshots/live-homepage.png`
   - Record all visible sections: hero, navigation, content blocks, article cards, footer
   - Open sidebar menu → screenshot → `temp/screenshots/live-homepage-menu.png`
   - Note all menu items, social icons, and links

2. **Navigate to local homepage** (`http://localhost:3000/`)
   - Take full-page screenshot → `temp/screenshots/local-homepage.png`
   - Open sidebar menu → screenshot → `temp/screenshots/local-homepage-menu.png`

3. **Compare section by section**:

   a. **Hero area**:
      - Live: What image is shown? What title/subtitle text?
      - Local: Is the image present? Is the title correct?
      - Compare dimensions, aspect ratio, overlay text positioning

   b. **Header bar**:
      - Logo/branding present?
      - Hamburger menu icon working?
      - Any other header elements?

   c. **Main content area**:
      - Quote block / carousel present?
      - Popular posts section?
      - Three-cards section?
      - Any other content blocks on the homepage?

   d. **Article cards / Latest articles**:
      - Live: How many articles shown? Card layout?
      - Local: Are cards present? Content populated?

   e. **Footer**:
      - Social links present and clickable?
      - Footer text/copyright?

   f. **Sidebar (open state)**:
      - Menu items listed?
      - Social icons rendered correctly?
      - Close button works?

4. **Check console** for errors on local homepage
5. **Check network** for failed requests on local homepage
6. **Check all internal links** on the homepage — do they resolve?

## Outputs

- Screenshots saved to `temp/screenshots/`
- Numbered issue list (starting at #1 or continuing from prior tasks)
- Each issue follows the format in `phase-02/context.md`

## Done When

- [x] Live and local homepage fully compared
- [x] All sections checked (hero, header, content, cards, footer, sidebar)
- [x] Console and network errors documented
- [x] All discrepancies numbered and documented

## Results

12 issues documented (2 critical, 6 major, 2 minor, 2 cosmetic). See `temp/issues-p02-01.md`.

Issue count at end of this task: **13** (including #8 resolved)

## Handoff

Next: `phase-02/p02-02-audit-section-pages.md`
State: Issue count at end of this task → next task continues numbering

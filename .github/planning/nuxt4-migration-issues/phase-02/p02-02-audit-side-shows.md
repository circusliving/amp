# Task: Audit Section Pages — Side Shows

**ID:** p02-02
**Status:** pending
**Depends on:** p02-01
**Context size:** medium

## Goal

Compare all Side Shows section pages (live vs local). This section has the most pages and is the primary content area.

## Inputs

- Phase context: `phase-02/context.md`
- URL list: `temp/research/url-list.md`
- Issue count from p02-01

## Pages to Audit (12)

1. `/side-shows` — Side Shows (section root)
2. `/side-shows/cabinet-of-curiosities` — Cabinet of Curiosities
3. `/side-shows/chilling-collectibles` — Chilling Collectibles
4. `/side-shows/dark-art` — Dark, Macabre, and Morbid Fine Art
5. `/side-shows/ghoulish-grub` — Ghoulish Grub
6. `/side-shows/macabre-artists` — Macabre and Dark Surreal Artists
7. `/side-shows/magical-mystical-experiences` — Magical and Mystical Experiences
8. `/side-shows/memento-mori` — Memento Mori Art
9. `/side-shows/morbid-art-events` — Morbid Art Events
10. `/side-shows/morbid-art-galleries` — Morbid Art Galleries
11. `/side-shows/mysterious-monster-marvels` — Mysterious Monster Marvels
12. `/side-shows/spook-shows-and-oddities` — Spook Shows and Oddities

## Steps

For each page above:
1. Navigate Playwright to live URL → full-page screenshot
2. Navigate Playwright to local URL → full-page screenshot
3. Compare: hero image, title, content area (image grid, text, cards), footer
4. Check console for errors
5. Check network for failed requests
6. Document each discrepancy as a numbered issue

Pay special attention to:
- Image grids (these pages typically display collections of image objects)
- Widget-driven content (`webPage.widget` field determines layout type)
- `widgetCollections` and `widgetTags` data driving the content

## Outputs

- Screenshots per page (live + local)
- Continued issue list

## Done When

- [ ] All 12 Side Shows pages compared
- [ ] All discrepancies documented with issue numbers

## Handoff

Next: `phase-02/p02-03-audit-backyard-aftershows.md`
State: Issue count

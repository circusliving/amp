# Task: Audit Section Pages — Sideshows Duplicates

**ID:** p02-05
**Status:** pending
**Depends on:** p02-02
**Context size:** small

## Goal

Check the 9 `/sideshows/` (no hyphen) URL variants. These are duplicates of the `/side-shows/` (hyphenated) pages — verify whether they render the same content, redirect, or 404.

## Inputs

- Phase context: `phase-02/context.md`
- Issue count from p02-04
- Findings from p02-02 (the canonical `/side-shows/` pages)

## Pages to Audit (9)

1. `/sideshows/cabinet-of-curiosities` — duplicate of `/side-shows/cabinet-of-curiosities`
2. `/sideshows/dark-art` — duplicate of `/side-shows/dark-art`
3. `/sideshows/macabre-artists` — duplicate of `/side-shows/macabre-artists`
4. `/sideshows/magical-mystical-experiences` — duplicate of `/side-shows/magical-mystical-experiences`
5. `/sideshows/memento-mori` — duplicate of `/side-shows/memento-mori`
6. `/sideshows/morbid-art-events` — duplicate of `/side-shows/morbid-art-events`
7. `/sideshows/morbid-art-galleries` — duplicate of `/side-shows/morbid-art-galleries`
8. `/sideshows/mysterious-monster-marvels` — duplicate of `/side-shows/mysterious-monster-marvels`
9. `/sideshows/spook-shows-and-oddities` — duplicate of `/side-shows/spook-shows-and-oddities`

## Steps

For each duplicate URL:
1. Navigate to the live URL — does it redirect to `/side-shows/` or render independently?
2. Navigate to the local URL — same behavior?
3. Compare behavior: redirect vs render vs 404
4. If they render: are they identical to the canonical `/side-shows/` version?
5. Document whether these should be redirects, canonical duplicates, or removed

## Outputs

- Duplicate handling behavior documentation
- Continued issue list
- Recommendation: redirect, canonical tag, or remove

## Done When

- [ ] All 9 duplicate URLs tested on live and local
- [ ] Behavior documented (redirect / render / 404)
- [ ] Issues documented

## Handoff

Next: `phase-02/p02-06-audit-articles-sample.md`
State: Issue count + duplicate handling recommendation

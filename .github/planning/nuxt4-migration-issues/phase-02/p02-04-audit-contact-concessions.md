# Task: Audit Section Pages — Contact & Concessions

**ID:** p02-04
**Status:** pending
**Depends on:** p02-01
**Context size:** medium

## Goal

Compare Contact and Concessions section pages (live vs local). Concessions pages may be legacy content from an older site structure.

## Inputs

- Phase context: `phase-02/context.md`
- Issue count from p02-03

## Pages to Audit (9)

### Contact (4)
1. `/contact` — Contact (section root)
2. `/contact/contact-us` — Contact Us
3. `/contact/partners` — Julius & Bain Marketing
4. `/contact/work-with-us` — Work with Circus Living

### Concessions (5)
5. `/concessions/art-blogs` — Art Magazine Submissions
6. `/concessions/art-galleries-looking-for-submissions` — 61 Art Galleries Looking for Submissions (2019)
7. `/concessions/artist-opportunities` — Where to sell, showcase, or submit your art (2019)
8. `/concessions/call-for-artists-app` — Call for Artists App
9. `/concessions/ghoulish-grub` — Ghoulish Grub

## Steps

For each page:
1. Navigate to live URL → screenshot
2. Navigate to local URL → screenshot
3. Compare: hero, title, content, images, footer
4. Console + network check
5. Document issues

Note: Concessions pages may overlap with After Shows pages (similar content, old URLs). Document whether these are redirects, duplicates, or distinct pages.

## Outputs

- Screenshots per page
- Continued issue list
- Concessions vs After Shows overlap notes

## Done When

- [ ] All 9 pages compared
- [ ] Concessions overlap documented
- [ ] All discrepancies documented

## Handoff

Next: `phase-02/p02-05-audit-sideshows-duplicates.md`
State: Issue count + concessions findings

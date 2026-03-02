# Roadmap

## Phase 01: Prerequisites & Page Enumeration

**Context:** [phase-01/context.md](phase-01/context.md)

| ID | Task | Status | Depends On |
|----|------|--------|------------|
| p01-01 | [Verify Dev Server & API Health](phase-01/p01-01-verify-dev-server.md) | ✅ complete | none |
| p01-02 | [Enumerate All Auditable URLs](phase-01/p01-02-enumerate-urls.md) | ✅ complete | p01-01 |
| p01-03 | [Set Up Comparison Tooling](phase-01/p01-03-setup-comparison-tooling.md) | ✅ complete | p01-01 |

## Phase 02: Page-by-Page Visual Audit

**Context:** [phase-02/context.md](phase-02/context.md)
**Requires:** Phase 01 complete (APIs healthy, URLs enumerated, tooling ready)

| ID | Task | Pages | Status | Depends On |
|----|------|-------|--------|------------|
| p02-01 | [Audit Homepage](phase-02/p02-01-audit-homepage.md) | 1 | ✅ complete | p01-03 |
| p02-02 | [Audit Section Pages — Side Shows](phase-02/p02-02-audit-side-shows.md) | 12 | ⬜ pending | p02-01 |
| p02-03 | [Audit Section Pages — Back Yard & After Shows](phase-02/p02-03-audit-backyard-aftershows.md) | 11 | ⬜ pending | p02-01 |
| p02-04 | [Audit Section Pages — Contact & Concessions](phase-02/p02-04-audit-contact-concessions.md) | 9 | ⬜ pending | p02-01 |
| p02-05 | [Audit Section Pages — Sideshows Duplicates](phase-02/p02-05-audit-sideshows-duplicates.md) | 9 | ⬜ pending | p02-02 |
| p02-06 | [Audit Articles — Detailed Sample](phase-02/p02-06-audit-articles-sample.md) | 5–10 | ⬜ pending | p02-01 |
| p02-07 | [Audit Articles — Programmatic Sweep](phase-02/p02-07-audit-articles-sweep.md) | 222 | ⬜ pending | p02-06 |
| p02-08 | [Audit Image Objects — Programmatic Sweep](phase-02/p02-08-audit-image-objects-sweep.md) | 971 | ⬜ pending | p02-07 |
| p02-09 | [Audit Gallery Pages](phase-02/p02-09-audit-gallery-pages.md) | TBD | ⬜ pending | p02-01 |
| p02-10 | [Audit Error Page](phase-02/p02-10-audit-error-page.md) | 1 | ⬜ pending | p02-01 |

## Phase 03: Cross-Cutting Audits & Final Compilation

**Context:** [phase-03/context.md](phase-03/context.md)
**Requires:** Phase 02 complete

| ID | Task | Status | Depends On |
|----|------|--------|------------|
| p03-01 | [Audit Layout Shell](phase-03/p03-01-audit-layout-shell.md) | ⬜ pending | p02-10 |
| p03-02 | [Audit Icons & Fonts](phase-03/p03-02-audit-icons-fonts.md) | ⬜ pending | p03-01 |
| p03-03 | [Audit SEO & Meta Tags](phase-03/p03-03-audit-seo-meta.md) | ⬜ pending | p03-02 |
| p03-04 | [Audit Responsive Behavior](phase-03/p03-04-audit-responsive.md) | ⬜ pending | p03-03 |
| p03-05 | [Audit Console & Network Errors](phase-03/p03-05-audit-console-network.md) | ⬜ pending | p03-04 |
| p03-06 | [Audit Accessibility](phase-03/p03-06-audit-accessibility.md) | ⬜ pending | p03-05 |
| p03-07 | [Compile Master Issue List](phase-03/p03-07-compile-issues.md) | ⬜ pending | p03-06 |

## Status Legend

- ⬜ pending
- 🔄 in-progress
- ✅ complete
- ❌ blocked
- ⏸️ paused

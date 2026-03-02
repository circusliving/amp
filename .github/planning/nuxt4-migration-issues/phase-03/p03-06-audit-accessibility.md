# Task: Audit Accessibility

**ID:** p03-06
**Status:** pending
**Depends on:** p03-05
**Context size:** medium

## Goal

Perform an accessibility audit comparing live vs local. Check WCAG 2.1 AA compliance for key pages, focusing on issues introduced or changed during the migration.

## Inputs

- Ph- Ph- Ph- Ph- Ph- Ph- Ph- Ph- Ph- Ph- Ph- Ph- Ph- Ph- Ph- Ph- Ph- Ph- Ph- Ph- Ph- Ph- Ph- Ph- Ph- Ph- Ph- Ph- Ph- Ph- Ph- Ph- Ph- Ph- Ph- Ph- Ph- Ph- Ph- Ph- Ph- Ph- Ph- Ph- Ph- Ph- Ph- Ph- Ph- Ph- Ph- Ph- Ph- Ph- Ph- Ph- Ph- Ph- Ph- Ph- Ph- Ph- Ph- Ph- Ph- Ph- Ph- Ph- Ph- Ph- Ph- Ph- Ph- Ph- Ph- Ph- Ph- Ph- Ph- Ph- Ph- Ph- Ph- Ph- Ph- Ph- Ph- Ph- Ph- Ph- Ph- Ph- Ph- Ph- Ph- Ph- Ph- Ph- Ph- Ph- Ph- Ph- Ph- Ph- Ph- Ph- Ph- Ph- Ph- Ph- Ph- Ph- Ph- Ph- Ph- Ph- Ph- Ph- Ph- Ph- Ph- Ph- Ph- Ph- Ph- Ph- Ph- Ph- Ph- Ph- Ph- Ph- Ph- Ph- Ph- Ph- Ph- Ph- Ph- Ph- Ph- Ph- Ph- Ph- Ph- Ph- Ph skipping h2→h4)?
   - Compare heading structure live vs local

4. **Check images:**
   - All `<img>` elements have `alt` attributes?
   - Alt text is descriptive (not empty or "image")?
   - Decorative images have `alt=""` and `role="presentation"`?

5. **Check interactive elements:**
   - All buttons have accessible names?
   - All links have descriptive text (no "click here")?
   - Focus visible on all interactive elements?
   - Tab order logical?
   - Hamburger menu button has `aria-label`?
   - Sidebar open/close announces state change (`aria-expanded`)?

6. **Check color contrast:**
   - Text on backgrounds meets 4.5:1 ratio (normal text) / 3:1 (large text)?
   - This may be hard to fully test without axe-core — note areas of concern

7. **Check skip-to-content:**
   - `default.vue` has a skip-to-content link
   - Is it the first focusable element?
   - Does it become visible on focus?
   - Does it move focus to main content?

8. **Check form elements** (if any):
   - Labels associated with inputs?
   - Error messages accessible?

9. **Check language:**
   - `<html lang="en">` (or appropriate language) set?
   - Language matches content?

## Outputs

- Accessibility snapshot comparison (live vs local)
- Continued issue list for a11y issues
- Landmark and heading hierarchy comparison
- Alt text audit results

## Done When

- [ ] Accessibility snapshots taken for 3 page types
- [ ] Landmarks compared
- [ ] Heading hierarchy compared
- [ ] Images audited for alt text
- [ ] Interactive elements checked
- [ ] Skip-to-content tested
- [ ] All a11y issues numbered

## Handoff

Next: `phase-03/p03-07-compile-issues.md`
State: Complete issue count from all phases

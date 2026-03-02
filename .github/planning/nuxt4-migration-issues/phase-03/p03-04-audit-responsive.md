# Task: Audit Responsive Behavior

**ID:** p03-04
**Status:** pending
**Depends on:** p03-03
**Context size:** medium

## Goal

Compare responsive behavior at mobile (375px), tablet (768px), and desktop (1280px) viewports between live and local.

## Inputs

- Phase context: `phase-03/context.md`
- Issue count from p03-03
- `app/assets/scss/_variables.scss` — SCSS breakpoint variables
- `app/assets/scss/main.scss` — Global responsive styles

## Steps

1. **Test homepage at 3 viewports** on both live and local:
   - 375×667 (mobile — iPhone SE)
   - 768×1024 (tablet — iPad)
   - 1280×800 (desktop)
   - Take screenshots at each viewport for both sites

2. **Compare at each viewport:**
   - Layout: columns collapse? Stack vertically?
   - Hero image:   - Hero image:   - Hero image:   - Hero image:   - Hero image:   - Hero image:   - Hero image:   - Hero image:   - Herorid: how many columns at each breakpoint?
   - Images: responsive sizing? Not overflowing?
   - Text: readable font sizes? No horizontal scroll?
   - Footer: layout adapts?

3. **Test a section page and an article page** at all 3 viewports

4. **Check CSS breakpoints:**
   - What breakpoints does `_variables.scss` define?
   - Do they match the live site's breakpoints?
   - Are media queries using the correct breakpoint values?

5. **Check touch interactions** (mobile viewport):
   - Sidebar swipe-to-close?
   - Tap targets large enough (48px minimum)?
   - Scroll behavior smooth?

6. **Check viewport meta tag:**
   - `<meta name="viewport" content="...">` present and correct?
   - No zoom-blocking (`maximum-scale=1` is an accessibility issue)

## Outputs

- Responsive screenshots at 3 viewports for 3 page types (18 screenshots)
- Continued issue list
- Breakpoint comparison documentation

## Done When

- [ ] 3 pages tested at 3 viewports each
- [ ] Layout, images, text, navigation compared at each
- [ ] Touch interaction considerations documented
- [ ] Viewport meta tag checked
- [ ] All issues numbered

## Handoff

Next: `phase-03/p03-05-audit-console-network.md`
State: Issue count + responsive patterns

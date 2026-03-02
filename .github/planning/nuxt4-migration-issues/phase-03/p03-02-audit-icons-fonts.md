# Task: Audit Icons & Fonts

**ID:** p03-02
**Status:** pending
**Depends on:** p03-01
**Context size:** medium

## Goal

Audit all icon rendering and font loading across the site. Icons are a known problem area — `ClIcons` (SVG sprite) may not be mounted, causing all `<Icon>` components to render as empty/colored squares.

## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## #Read `app/app.vue` — is `<ClIcons />` included?
   - Read `app/layouts/default.vue` — is `<ClIcons />` included?
   - If neither: this is the root cause of all icon issues
   - Document exactly where it needs to be added

2. **Inventory all icon usages:**
   - Search codebase for `<Icon` component usage
   - List every icon name used: facebook, twitter, google-plus, pinterest, instagram, youtube, plus any others
   - Verify each icon name has a matching `<symbol id="icon-{name}">` in `cl-icons.vue`

3. **Compare icon rendering** on live vs local:
   - Social bar icons (sidebar and footer)
   - Any icons in the header
   - Any icons in article content
   - Any icons in cards or other components

4. **Check font loading:**
   - What fonts does the live site use? (inspect computed styles)
   - What fonts does the local site load? (check `nuxt.config.ts`, CSS files)
   - Compare font-family, font-weight, font-size on:
     - Headings (h1, h2, h3)
     - Body text
     - Navigation links
     - Footer text
   - Check for FOUT (Flash of Unstyled Text) on local

5. **Check for icon/font related console errors:**
   - Missing font files (404s)
   - SVG reference errors
   - CSS font-face declaration issues

## Outputs

- Continued issue list
- ClIcons mounting status documentation
- Icon inventory with match status
- Font comparison table

## Done When

- [ ] ClIcons mounting verified
- [ ] All icon usages inventoried
- [ ] Icon rendering compared live vs local
- [ ] Font loading and rendering compared
- [ ] All issues numbered

## Handoff

Next: `phase-03/p03-03-audit-seo-meta.md`
State: Issue count + icon/font root causes identified

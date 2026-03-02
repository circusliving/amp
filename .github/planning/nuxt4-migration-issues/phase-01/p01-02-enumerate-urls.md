# Task: Enumerate All Auditable URLs

**ID:** p01-02
**Status:** pending
**Depends on:** p01-01
**Context size:** small

## Goal

Build a complete list of every URL that exists on the live site, so Phase 02 can audit every page without missing any.

## Inputs

- Phase context: `phase-01/context.md`
- API health status from p01-01
- Live site: `https://circusliving.com/`
- `server/utils/graphql-queries.ts` — DatoCMS query definitions
- `app/pages/` — route structure

## Steps

1. **From route structure**, identify all route patterns:
   - `/` (homepage)
   - `/:section/:page` (section pages)
   - `/articles/:id` (article detail)
   - `/galleries/:id` (gallery detail)
   - `/image-objects/:id` (image object detail)

2. **From live site menu**, extract all navigation links:
   - Fetch `https://circusliving.com/` and parse the menu/sidebar
   - OR use Playwright to open the sidebar and capture all links
   - Record every internal link found

3. **From DatoCMS API** (if working), query for content:
   - Fetch all web pages: `GET /api/web-pages/` — extract all paths
   - Fetch `GET /api/menu` — extract all menu item URLs
   - Fetch `GET /api/articles/latest?limit=100` — get all article slugs
   - Note: galleries and image-objects may be linked from articles/pages

4. **From live site crawl**, discover additional pages:
   - Use Playwright to navigate to each known page
   - Collect all internal `<a href>` links on each page
   - Deduplicate and add any new URLs not already found
   - Continue until no new URLs are discovered (breadth-first crawl)

5. **Compile the master URL list** organized by route type:
   - Homepage: `/`
   - Section pages: list each
   - Article pages: list each
   - Gallery pages: list each (if any)
   - Image object pages: list each (if any)
   - Other pages: any that don't fit above patterns

6. Save the URL list to `temp/research/url-list.md`

## Outputs

- `temp/research/url-list.md` — Complete URL inventory organized by page type
- Count of URLs per category
- Any URLs that exist on live but have no matching local route

## Done When

- [ ] All navigable URLs from live site collected
- [ ] URLs organized by route type
- [ ] List saved to `temp/research/url-list.md`
- [ ] No known pages missing from the list

## Handoff

Next: `phase-01/p01-03-setup-comparison-tooling.md`
State: URL list is at `temp/research/url-list.md` — Phase 02 tasks will reference this

# Task: Audit Articles — Detailed Sample

**ID:** p02-06
**Status:** pending
**Depends on:** p02-01
**Context size:** medium

## Goal

Perform detailed visual comparison of 5–10 representative article pages (live vs local) to identify template-level issues before running the programmatic sweep.

## Inputs

- Phase context: `phase-02/context.md`
- Full article list: `temp/research/url-list.md` (222 articles)
- Issue count from p02-05
- `app/pages/articles/[id].vue`
- `app/stores/article.ts`
- `server/utils/html-processor.ts`

## Sample Articles to Audit

Pick 5–10 articles spanning different content types:
1. A recent article with rich HTML content (embedded images, blockquotes)
2. An article with a cover image / hero
3. An article with minimal text content
4. An article with special characters in the title (accents, quotes)
5. An article linking to image objects or galleries
6. An article with date/author metadata
7. The oldest article (to test date formatting edge cases)
8–10. Any articles that appear broken during initial load

Suggested starting picks (from DatoCMS data):
- `/articles/mahlimae` — recent, seen on homepage
- `/articles/forest-lumina` — has rich content
- `/articles/montreal-with-teenagers` — long article
- `/articles/la-khaima-cuisine-nomade` — special characters in name
- `/articles/greeting-card-companies-accepting-submissions` — list-heavy content

## Steps

For each sample article:
1. Navigate to live URL → full-page screenshot
2. Navigate to local URL → full-page screenshot
3. Compare in detail:
   - Hero / cover image
   - Article title rendering
   - Publication date format and placement
   - Article body HTML: headings, paragraphs, lists, blockquotes, embedded images
   - Image loading within article body
   - Links within article content
   - Sidebar content
   - Related articles (if any)
   - Footer
4. Check `html-processor.ts` rendering:
   - Are embedded images processed correctly?
   - Are internal links rewritten?
   - Is structured data preserved?
5. Console + network errors
6. Document all issues

## Outputs

- Detailed screenshots for 5–10 articles
- Template-level issue list (issues that will affect ALL articles)
- Content-specific issues
- Continued issue numbering

## Done When

- [ ] 5–10 articles manually compared with screenshots
- [ ] Template-level issues identified
- [ ] HTML rendering issues documented
- [ ] All issues numbered

## Handoff

Next: `phase-02/p02-07-audit-articles-sweep.md`
State: Template-level issues to check during programmatic sweep

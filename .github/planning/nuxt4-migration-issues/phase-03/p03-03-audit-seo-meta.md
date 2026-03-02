# Task: Audit SEO & Meta Tags

**ID:** p03-03
**Status:** pending
**Depends on:** p03-02
**Context size:** medium

## Goal

Compare all SEO-relevant tags between live and local: `<title>`, `<meta>` descriptions, Open Graph tags, canonical URLs, structured Compare all SEO-relevant tags between live and local: `<title>`, `<meta>` descriptions, Open Graph tags, canonical URLs, structured Compare all SEO-relevant tags between live and local: `<title>`, `<meta>` descriptions, Open Graph tags, canonical URLs, structured Compare all SEO-relevant tags between live and local: `<title>`, `<meta>` descriptions, Open Graph tags, canonical URLs, structured Compare all SEO-relevant tags between live and local: `<title>`, `<meta>` descriptions, Open Graph tags, canonical URLs, structured Compare all SEO-relevant tags between live and local: `<title>`, `<meta>` descriptions, Open Graph tags, ctwitter:card`, `twitter:title`, `twitter:description`, `twitter:image`
   - Structured data (JSON-LD): check for WebPage, WebSite, Organization schemas
   - `<html lang="...">` attribute
   - Favicon and apple-touch-icon links

2. **For a section page, an article page, and an image object page**, repeat the comparison above

3. **Check `useSeoHead` composable behavior:**
   - Does it set all expected tags?
   - Does it use the correct base URL?
   - Does it handle missing data gracefully?

4. **Check `robots.txt`:**
   - Compare live vs local `robots.txt` content
   - Check sitemap reference (if any)

5. **Check for duplicate or missing tags:**
   - Multiple title tags?
   - Missing description on any page?
   - Conflicting canonical URLs?

## Outputs

- SEO comparison table per page type
- Continued issue list
- Missing/incorrect tag documentation

## Done When

- [ ] Homepage SEO compared
- [ ] Section page SEO compared
- [ ] Article page SEO compared
- [ ] robots.txt compared
- [ ] useSeoHead behavior verified
- [ ] All issues numbered

## Handoff

Next: `phase-03/p03-04-audit-responsive.md`
State: Issue count + SEO patterns

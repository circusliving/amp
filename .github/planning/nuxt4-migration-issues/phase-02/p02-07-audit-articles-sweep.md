# Task: Audit Articles — Programmatic Sweep

**ID:** p02-07
**Status:** pending
**Depends on:** p02-06
**Context size:** large

## Goal

Programmatically check ALL 222 article pages on local for structural issues: HTTP errors, missing content, console errors, and network failures. This is not a visual comparison — it's a health check across every article.

## Inputs

- Phase context: `phase-02/context.md`
- Full article list: `temp/research/url-list.md` (222 articles)
- Template-level issues from p02-06
- Issue count from p02-06

## Approach

Use Playwright MCP (or a script) to visit each of the 222 article URLs on `http://localhost:3000/` and collect:

### Per-page checks:
1. **HTTP status**: Does the page return 200? (not 404, 500, 503)
2. **Content present**: Does the page have a non-empty `<h1>` or main content area?
3. **Hero image**: Is a cover image `<img>` present? Does it have a valid `src`?
4. **Article body**: Is the article body text non-empty?
5. **Console errors**: Any JavaScript errors?
6. **Network failures**: Any failed API requests (4xx/5xx)?
7. **Missing images**: Any `<img>` with broken src?

### Output format:
For each article, produce a row:
```
| /articles/slug | status | title? | hero? | body? | console errors | network errors | broken images |
```

### Batch processing:
- Process in batches of 10–20 to avoid overwhelming the dev server
- Wait briefly between batches
- Save intermediate results to `temp/research/articles-sweep-results.md`

## Steps

1. Load the full article URL list (222 URLs)
2. For each URL, navigate Playwright to `http://localhost:3000/articles/{identifier}`
3. Collect the 7 checks listed above
4. Record results in a table
5. Flag any articles that fail any check
6. Create issues for patterns of failure (e.g., "all articles missing hero image" = 1 issue, not 222)

## Outputs

- `temp/research/articles-sweep-results.md` — Full results table
- Summary: how many passed, how many failed each check
- New issues for any patterns not already captured in p02-06
- Continued issue numbering

## Done When

- [ ] All 222 articles visited
- [ ] Results table saved
- [ ] Failure patterns documented as issues
- [ ] Summary statistics produced

## Handoff

Next: `phase-02/p02-08-audit-image-objects-sweep.md`
State: Article sweep results + issue count

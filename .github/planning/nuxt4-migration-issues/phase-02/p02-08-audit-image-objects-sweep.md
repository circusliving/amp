# Task: Audit Image Objects — Programmatic Sweep

**ID:** p02-08
**Status:** pending
**Depends on:** p02-07
**Context size:** large

## Goal

Programmatically check image object pages on local. There are 971 image objects — too many for manual comparison. Run a health check sweep similar to the article sweep.

## Inputs

- Phase context: `phase-02/context.md`
- Issue count from p02-07
- `app/pages/image-objects/[id].vue`
- `server/api/image-objects/[id].get.ts`

## Approach

### Step 1: Discover image object identifiers
Image objects are accessed by identifier, not a simple slug. Query DatoCMS:
```graphql
{
  allImageObjects(first: 100, skip: N) {
    identifier { value }
    name
  }
}
```
Paginate through all 971 to get the full identifier list.

### Step 2: Sweep all image object pages
For each identifier, navigate to `http://localhost:3000/image-objects/{identifier}`:
1. **HTTP status**: 200 or error?
2. **Content present**: Image rendered? Name displayed?
3. **Image loading**: Does the content URL resolve? Correct format?
4. **Console errors**: Any JS errors?
5. **Network failures**: Any failed requests?

### Step 3: Cross-reference with live site
Pick 5 random image objects and compare rendering on live vs local.

### Batch processing:
- Process in batches of 20
- Save results to `temp/research/image-objects-sweep-results.md`

## Outputs

- `temp/research/image-objects-sweep-results.md` — Results table
- Summary statistics
- Issues for failure patterns
- Continued issue numbering

## Done When

- [ ] All reachable image objects visited
- [ ] Results documented
- [ ] Failure patterns documented as issues

## Handoff

Next: `phase-02/p02-09-audit-gallery-pages.md`
State: Image object sweep results + issue count

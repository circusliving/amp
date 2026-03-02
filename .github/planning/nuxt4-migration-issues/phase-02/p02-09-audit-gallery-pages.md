# Task: Audit Gallery Pages

**ID:** p02-09
**Status:** pending
**Depends on:** p02-01
**Context size:** small

## Goal

Determine if gallery pages exist and compare them. Galleries use the `/galleries/:id` route.

## Inputs

- Phase context: `phase-02/context.md`
- Issue count from p02-08
- `app/pages/galleries/[id].vue`
- `server/routes/gallaries/` — note misspelling

## Steps

1. Check if any gallery pages exist on the live site (search for `/galleries/` links)
2. Check the DatoCMS schema for a gallery content type
3. If galleries exist: compare live vs local for each
4. If none exist: document that and note the unused route
5. Document the `server/routes/gallaries/` directory typo ("gallaries" vs "galleries")
6. Check if the misspelled route actually serves content

## Outputs

- Gallery existence documentation
- Directory typo issue
- Continued issue list

## Done When

- [ ] Gallery existence confirmed or denied
- [ ] Typo documented
- [ ] All issues numbered

## Handoff

Next: `phase-02/p02-10-audit-error-page.md`
State: Issue count

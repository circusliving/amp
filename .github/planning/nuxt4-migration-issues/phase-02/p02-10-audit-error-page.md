# Task: Audit Error Page

**ID:** p02-10
**Status:** pending
**Depends on:** p02-01
**Context size:** small

## Goal

Compare error/404 page behavior between live and local.

## Inputs

- Phase context: `phase-02/context.md`
- Issue count from p02-09
- `app/error.vue`

## Steps

1. Test 404 on live: `https://circusliving.com/this-does-not-exist` → screenshot
2. Test 404 on local: `http://localhost:3000/this-does-not-exist` → screenshot
3. Test invalid article: `http://localhost:3000/articles/nonexistent-id`
4. Test invalid section: `http://localhost:3000/fake-section/fake-page`
5. Compare error page: styling, message, navigation back to home
6. Check `error.vue`: handles 404 vs 500? Uses same layout?

## Outputs

- Error page screenshots
- Continued issue list

## Done When

- [ ] 404 compared live vs local
- [ ] Multiple error scenarios tested
- [ ] All issues documented

## Handoff

Next: `phase-03/p03-01-audit-layout-shell.md`
State: Complete Phase 02 issue count → Phase 03 continues numbering

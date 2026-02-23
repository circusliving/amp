# Lessons Learned

## 2026-02-23 — Phase 01 Init

### Old `modules/` directory auto-scanned
- **Problem:** Nuxt 4 auto-scans the root `modules/` directory and tried to load old Nuxt 2 modules (Dato.js, SiteMap.js) which depend on removed packages
- **Fix:** Renamed `modules/` → `modules.old/` before running `nuxt prepare`
- **Rule:** When migrating in-place, rename conflicting old directories before running any Nuxt 4 commands

### Old `nuxt.config.js` blocks Nuxt 4
- **Problem:** Nuxt 4 picks up the old `nuxt.config.js` which uses CommonJS and references removed dependencies
- **Fix:** Rename to `nuxt.config.js.old` before creating `nuxt.config.ts`
- **Rule:** Always move old config out of the way first — the new `nuxt.config.ts` takes precedence only if the `.js` version is gone

# Task: Docker Build Verification & Final Cleanup

**ID:** p06-05
**Status:** pending
**Depends on:** p06-04
**Context size:** small
**Branch:** `p06-05-docker-verify`
**Target LOC:** ~50 (max 400)

## Goal

Verify the Docker build produces a working SSR container, run smoke tests against it, delete ALL remaining old Nuxt 2 files, and confirm the repo is clean.

## Pre-flight

1. Verify clean repo: `git status`
2. Create task branch: `git checkout -b p06-05-docker-verify`
3. Memory recall: Search Neo4j for `docker nuxt`, `nitro node-server`, `docker multi-stage`

## Inputs

- Phase context: `phase-06/context.md`
- `Dockerfile` (from p01-04)
- `docker-compose.yml` (from p01-04)
- `.dockerignore` (from p01-04)

## Steps

### Docker Build Verification

1. Build Docker image:
   ```bash
   docker build -t circusliving-web:test .
   ```
   - Verify all 4 stages complete (base → deps → build → runner)
   - Verify final image size is reasonable (< 300MB)
   - Verify no build errors

2. Run container:
   ```bash
   docker run -d --name cl-test -p 8000:8000 \
     -e NUXT_PUBLIC_SITE_URL=http://localhost:8000 \
     -e NUXT_DATO_API_TOKEN=test-token \
     circusliving-web:test
   ```

3. Smoke test against running container:
   - `curl -s http://localhost:8000/` — verify 200 + HTML response
   - `curl -s http://localhost:8000/ | grep '<title>'` — verify title renders
   - `curl -sI http://localhost:8000/` — verify SSR headers (no client-only markers)
   - `curl -s http://localhost:8000/nonexistent` — verify error page (not crash)
   - Verify container logs show no startup errors: `docker logs cl-test`

4. Test docker-compose:
   ```bash
   docker compose up -d
   ```
   - Verify service starts
   - Repeat smoke tests against compose service
   - `docker compose down`

5. Clean up test containers:
   ```bash
   docker stop cl-test && docker rm cl-test
   docker rmi circusliving-web:test
   ```

### Final Cleanup — Delete ALL Old Files

6. Verify and delete remaining old Nuxt 2 / AMP files (if any survive from earlier phases):
   ```
   # Old config files (should be replaced by now)
   rm -f nuxt.config.js
   rm -f vue.config.js
   rm -f gulpfile.js
   rm -f serverless.yml

   # Old directories (should be empty or already deleted)
   rm -rf apollo/
   rm -rf assets/
   rm -rf components/
   rm -rf layouts/
   rm -rf locales/
   rm -rf middleware/
   rm -rf modules/
   rm -rf pages/
   rm -rf plugins/
   rm -rf sls/
   rm -rf static/
   rm -rf store/
   ```
   **NOTE**: Only delete if files still exist AND have been migrated to their new locations. Cross-reference with plan tasks before deleting.

7. Verify no old file references remain:
   ```bash
   # Search for old import paths
   grep -r "from '~/components/amp/" app/ server/ || echo "Clean"
   grep -r "from '~/modules/" app/ server/ || echo "Clean"
   grep -r "from '~/apollo/" app/ server/ || echo "Clean"
   grep -r "from '~/store/" app/ server/ || echo "Clean"
   grep -r "from '~/assets/main" app/ server/ || echo "Clean"
   ```

8. Final directory structure verification:
   ```
   .
   ├── app/
   │   ├── assets/scss/
   │   ├── components/
   │   ├── composables/
   │   ├── pages/
   │   ├── plugins/
   │   ├── utils/
   │   ├── app.vue
   │   └── error.vue
   ├── i18n/
   ├── public/
   ├── server/
   │   ├── api/
   │   ├── routes/
   │   └── utils/
   ├── tests/
   │   └── e2e/
   ├── .dockerignore
   ├── Dockerfile
   ├── docker-compose.yml
   ├── nuxt.config.ts
   ├── package.json
   ├── pnpm-lock.yaml
   ├── tsconfig.json
   ├── vitest.config.ts
   ├── playwright.config.ts
   ├── eslint.config.mjs
   ```

9. Final verification suite:
   ```bash
   pnpm typecheck          # TypeScript compiles
   pnpm lint               # ESLint passes
   pnpm format:check       # Prettier check
   pnpm test               # Vitest passes
   pnpm build              # Nuxt build succeeds
   ```

10. Update README.md:
    - Development setup (pnpm install, pnpm dev)
    - Docker instructions (docker compose up)
    - Environment variables reference (list all NUXT_ vars)
    - Test commands (pnpm test, pnpm test:e2e)
    - Deployment notes

## Testing

- [ ] Docker image builds successfully
- [ ] Container starts and serves pages
- [ ] SSR confirmed (HTML in response, not empty div)
- [ ] All old files deleted
- [ ] No dangling imports to old paths
- [ ] All verification commands pass (typecheck, lint, test, build)

## Outputs

- Updated `README.md`
- Deleted old Nuxt 2 files and directories
- Verified Docker build

## Done When

- [ ] Docker build and run verified
- [ ] ALL old Nuxt 2 / AMP files deleted
- [ ] No references to old paths
- [ ] TypeScript compiles, lint passes, tests pass, build succeeds
- [ ] README updated
- [ ] Migration complete

## Commits

Final commit: `p06-05-docker-verify`
Mid-task: `p06-05-cleanup-old-files`, `p06-05-readme`

## Rollback

- Restore deleted old files from git history if needed

## Handoff

**MIGRATION COMPLETE.** No further tasks.

Summary checklist:
- [ ] Nuxt 2 → Nuxt 4 ✅
- [ ] Vue 2 → Vue 3 ✅
- [ ] JavaScript → TypeScript ✅
- [ ] AMP → Standard HTML ✅
- [ ] Apollo Client v2 → graphql-request + useFetch ✅
- [ ] Vuex → Pinia ✅
- [ ] Bootstrap 4 → Bootstrap 5 ✅
- [ ] Serverless → Docker SSR ✅
- [ ] kebab-case filenames ✅
- [ ] camelCase identifiers ✅
- [ ] No code duplication ✅
- [ ] Full test coverage ✅
- [ ] WCAG 2.1 AA accessible ✅
- [ ] Performance optimized ✅

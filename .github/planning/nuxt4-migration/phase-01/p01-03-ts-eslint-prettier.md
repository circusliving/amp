# Task: TypeScript, ESLint & Prettier Config

**ID:** p01-03
**Status:** pending
**Depends on:** p01-01
**Context size:** small
**Branch:** `p01-03-ts-eslint-prettier`
**Target LOC:** ~80 (max 400)

## Goal

Set up TypeScript strict mode, ESLint 10 flat config with Nuxt preset, and Prettier for consistent code formatting.

## Pre-flight

1. Verify clean repo: `git status`
2. Create task branch: `git checkout -b p01-03-ts-eslint-prettier`
3. Memory recall: Search Neo4j for `eslint flat config`, `typescript strict`, `prettier`

## Inputs

- Phase context: `phase-01/context.md`
- Old `.eslintrc.js` or `eslint` config (if any)

## Steps

1. Create `tsconfig.json` at project root:
   ```json
   {
     "extends": "./.nuxt/tsconfig.json"
   }
   ```
   (Nuxt 4 generates the actual config in `.nuxt/`. Optionally adopt project references per upgrade guide.)

2. Create `eslint.config.mjs` (ESLint 10 flat config — only format supported in ESLint 10+):
   ```javascript
   import { createConfigForNuxt } from '@nuxt/eslint-config/flat'

   export default createConfigForNuxt({
     features: {
       typescript: true,
     },
   }).append({
     rules: {
       // Project-specific overrides
       'no-console': 'warn',
       'vue/multi-word-component-names': 'off', // Nuxt auto-names components
     },
   })
   ```
   **Note:** ESLint 10 (`10.0.1`) dropped all legacy `.eslintrc` support. Only flat config (`eslint.config.mjs`) is supported. `@nuxt/eslint` (`1.15.1`) handles this natively.

3. Create `.prettierrc`:
   ```json
   {
     "semi": true,
     "singleQuote": true,
     "trailingComma": "all",
     "printWidth": 100,
     "tabWidth": 2
   }
   ```

4. Create `.prettierignore`:
   ```
   .nuxt/
   .output/
   node_modules/
   dist/
   pnpm-lock.yaml
   ```

5. Remove old ESLint config files:
   - Any `.eslintrc.*` files
   - Any `eslint-*` references in old config

6. Verify TypeScript strict mode is enforced:
   - `nuxt.config.ts` already has `typescript: { strict: true }`
   - Ensure `noUncheckedIndexedAccess: true` (Nuxt 4 default)

## Testing

- [ ] `pnpm lint` runs without config errors
- [ ] `pnpm format` formats files correctly
- [ ] `pnpm typecheck` (after `nuxt prepare`) reports no config errors

## Outputs

- `tsconfig.json`
- `eslint.config.mjs`
- `.prettierrc`
- `.prettierignore`

## Done When

- [ ] ESLint runs with Nuxt preset
- [ ] Prettier formats on demand
- [ ] TypeScript compiles in strict mode
- [ ] No old ESLint config remains

## Commits

Final commit: `p01-03-ts-eslint-prettier`

## Rollback

- Revert to p01-01 branch state

## Handoff

Next: `phase-01/p01-04-dockerfile.md`
State: TypeScript, ESLint, and Prettier are configured. Dev server, linting, and type-checking all work.

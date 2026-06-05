# UI / UX / PWA fix progress

**Branch:** `cursor/ui-ux-pwa-hardening-447d`  
**Plan:** `SOLCORE_AGENT_FULL_UI_UX_PWA_FIX_PLAN` (uploaded)

## Validation (last run)

| Check | Status |
|-------|--------|
| `npm ci` | Pass |
| `npm run lint` | Pass |
| `npm run typecheck` | Pass |
| `npm run test` (Vitest) | Pass (11 tests) |
| `npm run build` | Pass |
| `npm run verify:pwa` | Pass |
| `npm run test:e2e` (Playwright + axe) | Pass |

## Completed

### Phase 1 — Baseline & tooling
- [x] `.nvmrc` (Node 20), `engines` in `package.json`
- [x] Scripts: `typecheck`, `test`, `test:e2e`, `validate`, `verify:pwa`
- [x] Vitest + Playwright + `@axe-core/playwright`
- [x] CI workflow runs validate, PWA verify, e2e

### Phase 2–3 — Design system & shell
- [x] Semantic CSS tokens (`globals.css`)
- [x] UI primitives: `EmptyState`, `DataSourceBadge`, `BottomActionBar`, `StepIndicator`, `SolarIcons`
- [x] Fixed bottom mobile nav + safe-area padding on main
- [x] Mobile tabs: Home, Calculator, Report, Contractors, More
- [x] `AppShell` skips chrome on `/offline`
- [x] i18n: `common`, `offline`, `a11y`, `nav.menu*`, `pwa.*`

### Phase 4 — PWA
- [x] Generated icons + screenshots (non-blank SVG mockups)
- [x] Manifest screenshots with `form_factor: narrow`
- [x] `docs/PWA_DEPLOY.md` (Vercel = installable PWA; GitHub Pages = no SW)
- [x] `IosInstallPrompt` for Safari
- [x] Improved `/offline` copy + calculator link
- [x] `scripts/verify-service-worker.mjs`

### Phase 5–7 — Core flows
- [x] Home: district picker, 4 feature cards (SVG), coverage search, trust/audience blocks
- [x] Calculator: 4-step wizard, validation, data source badges, sticky bottom actions
- [x] Report: empty state when `landValue <= 0`; default land = 0
- [x] 404 uses `EmptyState`

### Phase 11–14 — Trust, tests, a11y
- [x] `calcValidation.ts` + unit tests (`format`, `finance`, validation)
- [x] E2e smoke + axe on core routes
- [x] Security headers in `next.config.mjs`
- [x] Reduced-motion CSS

## Deferred / owner-only

- [ ] Real device iPhone Add-to-Home-Screen QA (requires production URL)
- [ ] Hindi/Gujarati strings for new keys (English fallback works)
- [ ] Report component split into `src/sections/report/*` (large refactor)
- [ ] PDF export dedicated print layout
- [ ] P2: saved scenarios, share links, deeper offline report cache
- [ ] Legal copy sign-off

## Deployment notes

- **Production PWA:** deploy `solarbharat/` to Vercel with `STATIC_EXPORT` unset.
- **GitHub Pages:** static export; service worker disabled by design.
- Regenerate assets: `npm run generate:pwa-icons && npm run generate:pwa-screenshot`.

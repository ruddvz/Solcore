# Post-agent audit status — SolarBharat

**Date:** 2026-06-05  
**Branch:** `cursor/post-agent-audit-complete-373e`  
**Agent:** Cloud implementation pass per `SOLCORE_RIGOROUS_POST_AGENT_AUDIT_AND_REMAINING_PLAN`

## Verification commands (clean checkout)

| Command | Result | Notes |
|---------|--------|-------|
| `node -v` | v22.14.0 | |
| `npm -v` | 10.9.7 | |
| `npm ci` | PASS | 878 packages |
| `npm run generate:pwa-icons` | PASS | |
| `npm run generate:pwa-screenshot` | PASS | |
| `npm run lint` | PASS | |
| `npm run typecheck` | PASS | |
| `npm run test` | PASS | 31 tests (5 files) |
| `npm run build` | PASS | Next.js 14 production build |
| `npm run verify:pwa` | PASS | sw.js + icons + screenshot |
| `npm run validate` | PASS | lint + typecheck + test + build + verify:pwa |
| `npm run test:e2e` (chromium) | PASS | 48 tests, `PLAYWRIGHT_PORT=3010` |
| `npm run test:e2e` (webkit-iphone) | PASS | 48 tests, `PLAYWRIGHT_PORT=3010` |

**E2E local:** `npm run test:e2e:local` or `CI=true PLAYWRIGHT_PORT=3010 npm run test:e2e`

## P0 closure summary

| ID | Status | Evidence |
|----|--------|----------|
| P0.1 Build/validation | Done | Table above |
| P0.2 Playwright build-before-start | Done | `playwright.config.ts` builds when not CI; CI uses prebuilt `npm run start` |
| P0.3 Accessibility | Done | Removed blanket `color-contrast` disable; contrast tokens bumped; axe fails serious+critical |
| P0.4 Mobile safe-area | Done | Existing `app-main-with-bottom-nav` + BottomActionBar offset verified in code |
| P0.5 PWA | Done | `verify:pwa` pass; `PwaUpdatePrompt` for SW updates |
| P0.6 Route inventory | Done | `e2e/routes.spec.ts` — 16+ routes, manifest, robots, sitemap, API |
| P0.7 Calculator | Done | E2E smoke + funnel; land `min=0`; WebKit input fix |
| P0.8 Report | Done | Empty-state E2E; existing ReportPage |
| P0.9 Financial model | Done | `finance.golden.test.ts` — 12 districts + snapshot |
| P0.10 API hardening | Done | Timeouts, pin validation 400, `route.test.ts` |

## P1 / P2 highlights

- **Navigation a11y:** More sheet Escape + focus; `aria-label` on More tab.
- **CSP:** Report-only policy in `next.config.mjs`.
- **CI:** WebKit project, Lighthouse thresholds (performance ≥0.5, a11y/SEO/BP ≥0.85), `PLAYWRIGHT_PORT=3010`.
- **Visual regression:** `e2e/visual.spec.ts` + `npm run test:e2e:visual` (optional; not in default CI projects).

## Blocked / human-only

| Item | Blocker |
|------|---------|
| NREL primary in prod | `NREL_API_KEY` not set in agent env |
| Supabase RLS live verify | No production Supabase credentials |
| Resend / cron | `RESEND_API_KEY`, `CRON_SECRET` absent |
| Real iPhone PWA install | Requires physical device + deploy URL |
| Legal sign-off | Counsel review of privacy/terms |
| Lighthouse in CI | Thresholds set; may need tuning on GitHub runners |

## Env audit (no secrets committed)

See local `.env.audit.md` (gitignored). Present in template only: `NEXT_PUBLIC_SITE_URL`, empty optional keys per `.env.example`.

## Files changed (representative)

- `e2e/*` — routes, funnel, helpers, expanded smoke/a11y
- `playwright.config.ts`, `package.json`
- `src/lib/finance.golden.test.ts`, `src/app/api/solar/route.ts` + tests
- `src/components/pwa/PwaUpdatePrompt.tsx`, `Layout.tsx`, contrast CSS
- `.github/workflows/solarbharat-ci.yml`
- `POST_AGENT_AUDIT_STATUS.md` (this file)

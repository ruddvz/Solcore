# SolarBharat implementation status (vs product plan)

This file tracks **what is implemented in the repo** versus [`SOLAR_BHARAT_PRODUCT_PLAN.md`](./SOLAR_BHARAT_PRODUCT_PLAN.md). The AI-oriented spec in [`Plan0.md`](./Plan0.md) mirrors the product plan for coding assistants. **Phase 2 operations** (cron, email, moderation) are documented in [`OPS_PHASE2.md`](./OPS_PHASE2.md). Items that still need **real-world partnerships** (NBFC underwriting, OEM SCADA APIs, app store releases) remain external — see Phase 3 hub and `MANUAL_TASKS.md`.

### Plan0 (AI implementation guide) — in-repo coverage

| Area | Status |
|------|--------|
| §2 Design tokens | Done — `globals.css`, Tailwind `sb.*`, `.sb-overline`, `.sb-body` |
| §3 Financial model | Done — `src/lib/finance.ts` via `src/lib/calcEngine.ts` |
| §5 `/api/solar` | Done — NREL → NASA → heuristic; `Cache-Control` on success |
| §6 PWA | Done — `next-pwa`, manifest, icons, screenshot, `/offline` |
| §7 Report 6 tabs | Done — overview / costs / model / risks / action / suppliers |
| §8 Routing | Done — all routes under `src/app/` |
| §9 Store | Done — `calculatorStore` + `hooks/useStore.ts` |
| §10 i18n | Done — **EN + HI + GU** full locale files (`npm run i18n:translate` regenerates HI/GU from EN) |
| §11 SEO | Done — metadata, sitemap, `/locations/*` |
| §12 PDF | Done — `exportPdf.ts`, watermark, `data-report-section` |
| §13 Supabase | Done — migrations + Phase 2 ops migration `20260509130000_*` |
| §14 Common bugs | Enforced in code paths (PR 0.78, land row, Year 11, etc.) |
| §15 Performance | **CI** — Lighthouse job with thresholds (performance ≥0.5, a11y/SEO/BP ≥0.85) |
| §16 Testing | **CI** — `validate`, `verify:pwa`, Playwright Chromium + WebKit iPhone; see `solarbharat/POST_AGENT_AUDIT_STATUS.md` |

## Phase 1 MVP (plan §5 + §10.5)

| Item | Status |
|------|--------|
| Next.js 14 App Router | Done |
| All states / districts | Done |
| Land units + technologies | Done |
| Report 6 tabs + PDF + PWA | Done |
| Solar APIs | Done |
| Legal draft pages | Done — counsel review before reliance |
| i18n | Done — EN / HI / GU parity of keys |

## Phase 2 (plan §6)

| Item | Status |
|------|--------|
| NREL / NASA solar | Done |
| Supabase schema + SSR clients | Done |
| Contractors, forum, quota UI, quotes, reviews, financing intake | Done |
| Leaflet + shading | Done |
| **Quota ingest cron** | Done — `POST /api/cron/quota-ingest` + `CRON_SECRET` |
| **Email alerts + double opt-in** | Done — `POST /api/cron/send-alert-confirmations` (Resend), `GET /api/alerts/confirm` |
| **Forum moderation** | Done — `forum_topics.hidden`, `/api/admin/forum`, `/preview/moderation` |
| Production scrapers for every DISCOM | **External** — hook your scraper output into `quota-ingest` JSON |

## Phase 3 (plan §7)

| Item | Status |
|------|--------|
| Spec hub `/phase3` | Done |
| NBFC embed, performance DB, verification network, native app | **Partner / multi-repo** — not simulated in production in this codebase |

---

*Update this file when major milestones ship.*

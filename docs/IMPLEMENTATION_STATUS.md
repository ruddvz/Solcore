# SolarBharat implementation status (vs product plan)

This file tracks **what is implemented in the repo** versus [`SOLAR_BHARAT_PRODUCT_PLAN.md`](./SOLAR_BHARAT_PRODUCT_PLAN.md). The AI-oriented spec in [`Plan0.md`](./Plan0.md) mirrors the product plan for coding assistants; keep the three docs aligned when behavior changes. Full India-scale Phase 2/3 items require backend, scrapers, and partnerships — see [`MANUAL_TASKS.md`](./MANUAL_TASKS.md) for what only humans can do.

### Plan0 (AI implementation guide) — in-repo coverage

| Area | Notes |
|------|--------|
| §2 Design tokens | CSS variables in `globals.css` + Tailwind `sb.*`; shared `.sb-overline` / `.sb-body`; 12px radii on controls, 20px hero containers |
| §3 Financial model | `solarbharat/src/lib/finance.ts` — exported via `src/lib/calcEngine.ts` per spec path |
| §5 `/api/solar` | NREL → NASA → heuristic; `Cache-Control` on success |
| §6 PWA | `next-pwa`, manifest + icons + `screenshots/mobile.png`, `/offline` |
| §7 Report 6 tabs | Overview (40yr gold chart, KPIs, warnings), costs, model (sortable table), risks, action (nodal portal links + checklist), suppliers (ALMM + ratings) |
| §8 Routing | All listed routes present under `src/app/` |
| §9 Store | `store/calculatorStore.ts` + `hooks/useStore.ts` alias |
| §10 i18n | EN full; HI/GU extended for calculator + `tech.warranty`; `plan0.*` mirror keys in EN |
| §11 SEO | Per-route metadata, sitemap (states/districts + optional Supabase URLs), `/locations/*` |
| §12 PDF | jsPDF + html2canvas + diagonal watermark; `data-report-section` on tabs |
| §13 Supabase | Migrations under `solarbharat/supabase/migrations/` |
| §15–16 | Performance/Lighthouse: measure on deploy; manual checklist in Plan0 |

## Phase 1 MVP (plan §5 + §10.5)

| Item | Status |
|------|--------|
| Vite → **Next.js 14** (SSR shell, App Router) | Done (`solarbharat/`) |
| **All states / districts** (762 districts) | Done — data + dropdowns |
| Land units (acre, bigha, guntha, hectare) | Done |
| Technology selector (3 options) | Done |
| Financial model (PR 78%, O&M step-up, loan 30% / 10 yr, etc.) | Done |
| Report **6 tabs** | Done |
| Agrivoltaics section | Done |
| Homepage hero + features | Done |
| **Solar resource** (district centroid) | Done — `/api/solar` uses **NREL PVWatts** when `NREL_API_KEY` is set, else **NASA POWER**, else heuristic fallback |
| **PDF export** (client jsPDF + html2canvas, watermarked footer) | Done |
| **SEO**: metadata, `sitemap.xml`, `robots.txt` | Done |
| **PWA**: `@ducanh2912/next-pwa`, `manifest.ts`, icons `public/icons/`, `/offline` fallback | Done — install prompt after `npm run build` + `npm run start` or HTTPS deploy |
| **`/preview`** testing hub | Done — noindex |
| **PostHog** (optional key) | Done — `Providers.tsx` |
| i18n EN + partial HI/GU | Done (extend strings as needed) |
| Performance / mobile polish | Ongoing — test on real devices |
| Deploy domain | **Manual** — see `MANUAL_TASKS.md` (Vercel or optional **GitHub Pages** static preview) |
| Legal surface (draft) | **`/terms`**, **`/privacy`**, **`/contact`** — counsel review required before reliance |

## Phase 2 (plan §6)

| Item | Status |
|------|--------|
| **NREL NSRDB** via PVWatts v8 (`solrad_monthly`) | Done — server-only `NREL_API_KEY`, see `src/lib/nrelSolar.ts` |
| **Supabase** SSR clients + cookie middleware | Done — `src/lib/supabase/*`, optional env |
| **Contractor directory** (plan §6.3): `/contractors`, apply form → Supabase `contractor_applications`, detail `?slug=` | Done — seed listings when DB empty; migration `20260505200000_seed_demo_contractors.sql` |
| Pin-drop **Leaflet** + **shading** (§6.1–6.2), `/api/solar?lat&lon` | Done |
| **Public Q&A forum** (plan §6.9): `/forum`, `/forum/new`, `/forum/topic?slug=` | Done — anon insert policies migration; seed topics + replies |
| **PM-KUSUM quota tracker UI** (plan §6.5): `/quota` | Done — reads `quota_snapshots`; seed migration |
| **Email alerts signup** (plan §6.10): `/alerts` → `email_alert_subscriptions` | Done — UI only; sending requires worker |
| **Quote comparison** (§6.6): `/quotes` | Done — client-side table + flags (`src/lib/quotes/compareQuotes.ts`) |
| **Review intake** (§6.4): `/reviews/submit` → `review_intake` | Done — Supabase direct or `/api/reviews/intake` fallback |
| **Financing lead intake** (ties to §7.2): `/financing/interest` → `financing_leads` | Done — Supabase direct or `/api/financing/lead` fallback |
| Roadmap page | Done — `/plan` (`RoadmapPage.tsx`) |
| Scrapers (automated quota ingest), Resend/email worker, moderation dashboard | **Not** done |

Next engineering steps: Edge Function or cron for quota ingest, Resend + confirm links, forum moderation UI.

## Phase 3 (plan §7)

| Item | Status |
|------|--------|
| Performance DB, NBFC embed, verification network, OA calc, battery, rooftop, mobile, consultant dash, tariff trends | **Spec pages** — `/phase3` hub + `/phase3/[slug]` describe scope from the plan (no production integrations in-repo) |

Mobile app, NBFC underwriting, SCADA ingestion, etc. remain **external** or multi-repo efforts — see hub pages and `MANUAL_TASKS.md`.

---

*Update this file when major milestones ship.*

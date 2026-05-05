# SolarBharat implementation status (vs product plan)

This file tracks **what is implemented in the repo** versus [`SOLAR_BHARAT_PRODUCT_PLAN.md`](./SOLAR_BHARAT_PRODUCT_PLAN.md). Full India-scale Phase 2/3 items require backend, scrapers, and partnerships — see [`MANUAL_TASKS.md`](./MANUAL_TASKS.md) for what only humans can do.

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

## Phase 2 (plan §6)

| Item | Status |
|------|--------|
| **NREL NSRDB** via PVWatts v8 (`solrad_monthly`) | Done — server-only `NREL_API_KEY`, see `src/lib/nrelSolar.ts` |
| **Supabase** SSR clients + cookie middleware | Done — `src/lib/supabase/*`, optional env |
| **Contractor directory** (plan §6.3): `/contractors`, apply form → Supabase `contractor_applications`, detail `?slug=` | Done — seed listings when DB empty; migration `20260505200000_seed_demo_contractors.sql` |
| Pin-drop **Leaflet** + **shading** (§6.1–6.2), `/api/solar?lat&lon` | Done |
| Scrapers, forum UI, email jobs, verified reviews | **Not** done |

Next engineering steps: forum topics UI, quota tracker ingest, email (Resend), review moderation dashboard.

## Phase 3 (plan §7)

Mobile app, NBFC integration, verification network, etc. — **not** started.

---

*Update this file when major milestones ship.*

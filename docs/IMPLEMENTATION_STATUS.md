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
| **NASA POWER** solar resource (district centroid) | Done — `/api/solar` |
| **PDF export** (client jsPDF + html2canvas, watermarked footer) | Done |
| **SEO**: metadata, `sitemap.xml`, `robots.txt` | Done |
| **PostHog** (optional key) | Done — `Providers.tsx` |
| i18n EN + partial HI/GU | Done (extend strings as needed) |
| Performance / mobile polish | Ongoing — test on real devices |
| Deploy domain | **Manual** — see `MANUAL_TASKS.md` |

## Phase 2 (plan §6)

Requires **Supabase**, scrapers, forum, email — **not** completed in this codebase iteration. Next engineering steps: DB schema, auth, NREL wrapper service, Leaflet map page.

## Phase 3 (plan §7)

Mobile app, NBFC integration, verification network, etc. — **not** started.

---

*Update this file when major milestones ship.*

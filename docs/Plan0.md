# SolarBharat — AI Coding Prompt & Implementation Guide
> **Version 1.0 | May 2026 | repo: github.com/ruddvz/Solcore**
> For use with Claude, Cursor, Copilot, or any AI coding assistant

---

## 1. Project Context

**SolarBharat** is India's solar intelligence platform — an open, honest, district-specific solar feasibility engine for every Indian farmer, landowner, and rooftop owner. Think EnergySage + Google Project Sunroof + HomeStars, but built for India's 762 districts and 250 million farms.

**Stack:** Next.js 14 (App Router), TypeScript, Tailwind CSS, Recharts, Zustand, next-pwa, Supabase, i18next, jsPDF + html2canvas.

**Repo layout:**
```
/solarbharat         ← Next.js 14 app (all work happens here)
  /src
    /app             ← App Router pages
    /components      ← Shared UI components
    /lib             ← Calc engine, API wrappers, Supabase clients
    /data            ← india-geography.json, statePolicies.generated.ts
    /hooks           ← Zustand store, custom hooks
    /i18n            ← EN/HI/GU translation strings
  /public/icons      ← PWA icons (192, 384, 512px)
  /supabase/migrations
/docs
  SOLAR_BHARAT_PRODUCT_PLAN.md  ← Full product plan (56KB, ground truth)
  IMPLEMENTATION_STATUS.md      ← What's done vs Phase 2/3
  MANUAL_TASKS.md               ← Human-only steps (domain, keys, etc.)
```

---

## 2. Design System (Non-Negotiable)

Always apply these exact tokens. Never deviate.

### Colors
```css
--c-bg:       #0a0f1e;   /* page background */
--c-surface:  #0d1a2e;   /* card surfaces */
--c-surface2: #0f2040;   /* inputs, elevated cards */
--c-green-bg: #071a0e;   /* green-tinted sections */
--c-gold:     #fbbf24;   /* CTAs, active states, highlights */
--c-gold-dk:  #f59e0b;   /* hover */
--c-green:    #22c55e;   /* positive numbers, success */
--c-green-dk: #16a34a;
--c-green-lt: #86efac;   /* text on dark green bg */
--c-orange:   #f97316;   /* cash/cost warnings */
--c-red:      #ef4444;   /* HIGH risk, critical */
--c-blue:     #0ea5e9;   /* inverters, info */
--c-purple:   #8b5cf6;   /* tech/robot features */
--c-grey:     #6b7280;   /* disabled, footnotes */
--c-txt:      #ffffff;
--c-txt-dim:  rgba(255,255,255,.55);
--c-txt-sub:  rgba(255,255,255,.35);
--c-bdr:      rgba(255,255,255,.06);
--c-bdr-gold: rgba(251,191,36,.2);
```

### Typography
| Element | Spec |
|---------|------|
| Hero H1 | Syne, clamp(28px,5vw,50px), weight 800 |
| Section H2 | Syne, 22–24px, weight 700 |
| Card labels | 11–12px, weight 700, UPPERCASE, letter-spacing .08em |
| Body | DM Sans, 14–15px, weight 400 |
| Data values | JetBrains Mono, 22px, weight 700 |
| Tables | DM Sans, 12.5px |

### Border Radius
- Cards: `12px`
- Buttons: `12px`
- Inputs: `12px`
- Large containers: `20px`

---

## 3. Financial Model — Exact Specification

This is the core engine. Every number must be correct. Entry: `src/lib/calcEngine.ts` (re-exports the implementation in `src/lib/finance.ts`).

### Inputs
| Input | Type | Unit |
|-------|------|------|
| state | string | state key (e.g. 'GJ') |
| district | string | district name |
| area | number | user-entered number |
| areaUnit | enum | 'acres' \| 'bigha' \| 'guntha' \| 'hectares' |
| techKey | enum | 'topcon' \| 'perc_bi' \| 'perc_mono' |

### Unit Conversions (to acres)
```typescript
const UNIT_TO_ACRES = {
  acres: 1,
  bigha: 0.6198,   // 1 bigha = 0.6198 acres (standard Indian bigha)
  guntha: 0.02500, // 1 guntha = 0.025 acres
  hectares: 2.4711 // 1 hectare = 2.471 acres
};
```

### System Sizing
```typescript
const acres = area * UNIT_TO_ACRES[areaUnit];
const capacityMW = acres * 0.2;          // 0.2 MW per acre — ground mount standard
const capacityKWp = capacityMW * 1000;
const panelCount = Math.round(capacityKWp * 1000 / 560); // 560W panels
const inverterCount = Math.ceil(capacityKWp / 100);       // 100kW inverters
```

### Generation Model
```typescript
const PR = 0.78; // Performance Ratio — honest (NOT marketing's 0.85)
const BIFACIAL_GAIN = { topcon: 0.12, perc_bi: 0.08, perc_mono: 0 };
const year1GenKWh = capacityKWp * state.ghi * 365 * PR * (1 + BIFACIAL_GAIN[tech]);
const year1GenLakh = year1GenKWh / 100_000; // convert to lakh units
```

### Technology Specs
```typescript
export const TECHNOLOGIES = {
  topcon: {
    name: 'TOPCon N-Type Bifacial',
    efficiency: 22.5,       // %
    degradationPct: 0.35,   // per year
    costPerWp: 38,          // Rs/Wp (Phase 1 hardcoded)
    bifacialGain: 0.12,
    warrantyYears: 30,
    badge: 'Best Choice',
    badgeColor: 'gold'
  },
  perc_bi: {
    name: 'Mono-PERC Bifacial',
    efficiency: 21.0,
    degradationPct: 0.45,
    costPerWp: 36,
    bifacialGain: 0.08,
    warrantyYears: 25,
    badge: 'Good',
    badgeColor: 'blue'
  },
  perc_mono: {
    name: 'Mono-PERC Monofacial',
    efficiency: 20.5,
    degradationPct: 0.50,
    costPerWp: 34,
    bifacialGain: 0,
    warrantyYears: 25,
    badge: 'Acceptable',
    badgeColor: 'grey'
  }
};
```

### Cost Breakdown (Rs.)
```typescript
function calcCosts(capacityKWp: number, tech: TechSpec): CostBreakdown {
  const w = capacityKWp; // shorthand
  return {
    panels:        w * tech.costPerWp * 1000,
    inverters:     w * 8_000,
    mounting:      w * 6_500,
    transformer:   w > 500 ? 1_500_000 : w * 2_500,
    civil:         w * 3_500,
    gridConnect:   Math.max(w * 1_500, 300_000),
    cables:        w * 2_000,
    scada:         w * 1_200,
    robot:         capacityKWp >= 1000 ? 900_000 : 0,  // 1 MW+ gets robot
    approvals:     Math.max(w * 500, 100_000),
    // Calculated after subtotal:
    epc:           0,   // 8% of above subtotal
    contingency:   0    // 3% of above subtotal
  };
}
// After calculating sum: costs.epc = subtotal * 0.08; costs.contingency = subtotal * 0.03;
```

### Funding Stack
```typescript
const totalCost = sum(allCosts);
const subsidy   = totalCost * (state.subsidyPct / 100);  // state-specific %
const loan      = (totalCost - subsidy) * 0.30;           // 30% of after-subsidy cost
const yourCash  = totalCost - subsidy - loan;
// NOTE: yourCash should be ≥ 16% of totalCost (10% down + 6% operating reserve)
```

### Loan EMI Calculation
```typescript
// Standard reducing balance EMI
const loanTermMonths = 120; // 10 years
const monthlyRate    = state.loanRate / 100 / 12;
const emi = loan * monthlyRate * Math.pow(1 + monthlyRate, loanTermMonths)
          / (Math.pow(1 + monthlyRate, loanTermMonths) - 1);
```

### 25-Year Financial Model
```typescript
function buildYearlyModel(inputs: CalcInputs): YearRow[] {
  return Array.from({ length: 25 }, (_, i) => {
    const year = i + 1;
    const degradeFactor = Math.pow(1 - tech.degradationPct / 100, i);
    const genKWh        = year1GenKWh * degradeFactor;
    const revenue       = genKWh * state.tariff;
    // O&M: Rs.4,500/kWp base, step up 15% every 5 years
    const omMultiplier  = Math.pow(1.15, Math.floor(i / 5));
    const omCost        = capacityKWp * 4_500 * omMultiplier;
    const emiAnnual     = year <= 10 ? emi * 12 : 0;
    const netProfit     = revenue - omCost - emiAnnual;
    const cumulative    = /* sum of all previous net profits */;
    return { year, genLakh: genKWh/100_000, revenue, omCost, emiAnnual, netProfit, cumulative };
  });
}
```

### Derived KPIs
```typescript
const breakevenYear    = yearlyModel.findIndex(y => y.cumulative > yourCash) + 1;
const totalNetProfit25 = yearlyModel.at(-1)!.cumulative;
const returnMultiple   = totalNetProfit25 / yourCash;
const monthlyPostLoan  = yearlyModel[10].netProfit / 12; // Year 11 = post-loan
```

---

## 4. State Data Structure

All 762 districts are in `src/data/india-geography.json`. Phase 1 supports 6 states. The state policy data lives in `src/data/statePolicies.generated.ts` with this shape:

```typescript
export type StatePolicy = {
  key: string;               // 'GJ', 'RJ', etc.
  name: string;              // 'Gujarat'
  ghi: number;               // kWh/m²/day — district centroid average
  peakHours: number;
  tariff: number;            // Rs./unit — midpoint of DISCOM range
  tariffRange: [number, number];
  subsidyPct: number;        // PM-KUSUM + state top-up %
  loanRate: number;          // Preferred solar loan rate %
  nodal: string;             // 'GEDA', 'RREC', etc.
  nodalPhone: string;
  nodalUrl: string;
  discom: string;
  monthlyFactors: number[];  // [Jan..Dec] relative generation factors, sum=12
};
```

Phase 1 states:
| Key | State | GHI | Tariff | Subsidy% | Nodal |
|-----|-------|-----|--------|----------|-------|
| GJ | Gujarat | 5.5 | 2.80 | 60% | GEDA |
| RJ | Rajasthan | 6.0 | 2.95 | 60% | RREC |
| MH | Maharashtra | 5.2 | 3.10 | 50% | MEDA |
| MP | Madhya Pradesh | 5.4 | 2.85 | 60% | MPUVNL |
| KA | Karnataka | 5.3 | 3.15 | 50% | KREDL |
| UP | Uttar Pradesh | 5.1 | 2.75 | 55% | UPNEDA |

---

## 5. API Route — `/api/solar`

`src/app/api/solar/route.ts` — server-only, never runs client-side.

**Priority order:**
1. **NREL PVWatts v8** (if `NREL_API_KEY` env is set)
2. **NASA POWER** (free, no key needed, covers all India)
3. **Latitude heuristic** (fallback: estimate from lat)

```typescript
// NREL PVWatts v8
GET https://developer.nrel.gov/api/pvwatts/v8.json
  ?api_key=${NREL_API_KEY}
  &lat=${lat}&lon=${lon}
  &system_capacity=1
  &azimuth=180
  &tilt=10
  &array_type=1        // fixed open rack
  &module_type=0
  &losses=14

// NASA POWER (fallback, no key needed)
GET https://power.larc.nasa.gov/api/temporal/climatology/point
  ?parameters=ALLSKY_SFC_SW_DWN,T2M
  &community=RE
  &longitude=${lon}&latitude=${lat}
  &format=JSON
```

The response is merged into the base state data. NREL-sourced numbers override state averages. Cache aggressively (1 day) per coordinate.

---

## 6. PWA Configuration

`src/app/manifest.ts` — App Router manifest route:
```typescript
import type { MetadataRoute } from 'next';
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'SolarBharat',
    short_name: 'SolarBharat',
    description: "India's Solar Intelligence Platform",
    start_url: '/',
    display: 'standalone',
    background_color: '#0a0f1e',
    theme_color: '#0a0f1e',
    orientation: 'portrait-primary',
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
      { src: '/icons/icon-384.png', sizes: '384x384', type: 'image/png' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
    ],
    screenshots: [
      { src: '/screenshots/mobile.png', sizes: '390x844', type: 'image/png', form_factor: 'narrow' }
    ]
  };
}
```

`next.config.mjs` — next-pwa with Workbox:
```javascript
import withPWA from '@ducanh2912/next-pwa';
const config = withPWA({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/power\.larc\.nasa\.gov\/api\//,
      handler: 'CacheFirst',
      options: { cacheName: 'nasa-power', expiration: { maxAgeSeconds: 86400 } }
    },
    {
      urlPattern: /^https:\/\/fonts\.googleapis\.com\//,
      handler: 'StaleWhileRevalidate',
      options: { cacheName: 'google-fonts' }
    }
  ],
  fallbacks: { document: '/offline' }
});
```

**Testing PWA:** `npm run build && npm run start` — dev mode (`npm run dev`) does NOT register the service worker.

---

## 7. Report: 6 Tabs Specification

The report renders after the user completes the calculator. It uses React state for active tab.

### Tab 1: Overview
- System summary card: MW capacity, panel count, inverter count, technology badge
- Location & climate card: state, district, GHI, peak sun hours, grid quality note
- **40-year cumulative cash flow chart** (Recharts LineChart, SVG, gold line)
  - X-axis: Year 1–40, Y-axis: Rs. Crore
  - Mark Year 11 (loan paid) with a vertical dashed line
- 4 KPI boxes: Breakeven Year | Cash Recovered Year | Monthly Yr11+ | 25yr Net Profit
- **Warning panel** (non-dismissible, red/orange):
  1. Cash required upfront: `₹{yourCash.toFixed(2)}L`
  2. PPA tariff risk: "Rate is locked for [X] years only"
  3. Grid connection lead time: "8–14 week DISCOM approval, apply Day 1"
  4. Dust loss: "Rajasthan users: budget for robot cleaning"

### Tab 2: Costs & Subsidies
- **Cost donut chart** (SVG, labelled segments):
  - Panels | Inverters | Mounting | Civil | Grid | Cables | EPC | Others
- Line-by-line cost table: all items including Rs.0 land cost (psychological anchor)
- **Funding stack bar** (full width, 3 segments):
  - 🟢 GOVT: `subsidyPct%` | 🔵 LOAN: `30%` | 🟠 YOU: remainder
  - Below: "Land cost: ₹0 — you own it"
- Reality check box (gold bordered):
  - "Subsidy disbursement: 4–9 months after COD, not at sanction"
  - "Operating reserve: keep 6% of project cost liquid for Year 1–2"
- GST note: "Solar panels attract 5% GST (not 18%)"

### Tab 3: 25-Year Financial Model
- Line chart: cumulative cashflow (green line, Year 11 marked)
- Full sortable table: Year | Units (lakh) | Gross Revenue | O&M | EMI | Net Profit | Cumulative
- Year 11 row: bold, highlighted in green (#071a0e background)
- Footer row: 25-Year Total
- Note: "After Year 10, EMI ends. Monthly income triples. This is your 'golden phase'."

### Tab 4: Risk Register
Grid of 8 risk cards, each with:
- Risk name + probability badge (HIGH/MED/LOW)
- Financial impact in Rs. where calculable
- Mitigation: specific action, not generic advice

Risks (location-aware — vary by state):
1. Grid connection delay (HIGH) — all states
2. PM-KUSUM quota full (HIGH) — all states
3. Transformer lead time 14–20 weeks (HIGH) — rural states
4. Subsidy disbursement 4–9 months (MED)
5. Dust/soiling loss 8–12% (HIGH for RJ, MED for others)
6. Monsoon generation loss (MED — Maharashtra, Karnataka higher)
7. PPA tariff revision risk (MED)
8. EPC contractor abandonment after advance (MED)

### Tab 5: Action Plan
Timeline with 6 phases. Each phase has specific, actionable steps with real contact information.

| Phase | Label | Color | Actions |
|-------|-------|-------|---------|
| 1 | This Week | Gold | Verify DISCOM quota; get land ownership docs |
| 2 | Week 2–3 | Blue | Apply for grid feasibility; approach GEDA/nodal |
| 3 | Month 1 | Green | Get 3 EPC quotes (using our standard template) |
| 4 | Month 2–3 | Purple | Sanction letter + subsidy application |
| 5 | Month 5–9 | Orange | Construction, SCADA setup, COD |
| 6 | Month 10–14 | Green | First generation bill; subsidy disbursement |

Include real phone numbers and portal URLs for the selected state's nodal agency and DISCOM.

Document checklist (10 items, checkbox UI):
- [ ] 7/12 land record (Satbara utara)
- [ ] Survey number certificate
- [ ] Land ownership title
- [ ] PAN card
- [ ] Aadhaar card
- [ ] Bank account details (for subsidy)
- [ ] Electricity bill (for grid-connection)
- [ ] Three EPC quotes (standard format)
- [ ] Loan pre-approval letter
- [ ] Nodal agency registration

### Tab 6: Suppliers
Four sections: EPC Contractors | Panel Manufacturers | Inverter Brands | Financing

Each supplier card: logo/icon, name, detail line, VERIFIED/ALMM badge, rating stars.

Show state-specific EPC contractors (from the product plan §12.4 data).

---

## 8. Routing Map

```
/                    → Homepage (hero + features + state grid + CTA)
/calculator          → 4-step wizard
/report              → 6-tab report (reads Zustand store for calc results)
/contractors         → Verified contractor directory (Supabase or seed data)
/contractors/apply   → EPC application form
/contractors/company → Single contractor detail page (?slug=)
/quota               → PM-KUSUM quota tracker
/forum               → Q&A community (Phase 2)
/forum/new           → Post a question
/forum/topic         → Thread view (?slug=)
/alerts              → Email alert subscriptions
/quotes              → Quote comparison tool
/financing/interest  → Financing interest form
/reviews/submit      → Installation review intake
/plan                → Product roadmap (public)
/phase3              → Phase 3 spec hub
/phase3/[slug]       → Individual Phase 3 feature page
/terms               → Terms of service
/privacy             → Privacy policy
/contact             → Contact page
/offline             → PWA offline fallback
/preview             → Dev testing hub (noindex)
```

---

## 9. Zustand Store Shape

`src/hooks/useStore.ts`:
```typescript
interface CalcState {
  // Inputs
  stateKey:   string | null;
  districtKey: string | null;
  area:       number;
  areaUnit:   'acres' | 'bigha' | 'guntha' | 'hectares';
  techKey:    'topcon' | 'perc_bi' | 'perc_mono';
  
  // Derived (from NREL/NASA API)
  ghi:        number | null;  // fetched GHI, overrides state default
  
  // Results
  results:    CalcResults | null;
  isLoading:  boolean;
  error:      string | null;
  
  // Actions
  setField:   (key: string, value: unknown) => void;
  runCalc:    () => Promise<void>;
  reset:      () => void;
}
```

---

## 10. i18n Keys (Critical Strings)

Always use `useTranslation()` for user-facing text. Critical keys:
```json
{
  "hero.title": "India's Solar Intelligence Platform",
  "hero.subtitle": "Honest, district-specific solar feasibility for every Indian landowner",
  "calc.cta": "Calculate My Solar ROI",
  "calc.step1": "Select State",
  "calc.step2": "Your Land",
  "calc.step3": "Technology",
  "report.tab.overview": "Overview",
  "report.tab.costs": "Costs",
  "report.tab.model": "25-Year Model",
  "report.tab.risk": "Risk Register",
  "report.tab.action": "Action Plan",
  "report.tab.suppliers": "Suppliers",
  "kpi.breakeven": "Breakeven",
  "kpi.cashback": "Cash Recovered",
  "kpi.monthly": "Monthly (Yr 11+)",
  "kpi.return": "Return Multiple",
  "warning.cash": "Cash Required Upfront",
  "warning.ppa": "PPA Tariff Lock Warning",
  "disclaimer": "Estimates only. Always verify with a qualified solar engineer and current DISCOM/scheme guidelines before making financial decisions."
}
```

---

## 11. SEO & Metadata

Every page must have proper `generateMetadata()` export:
```typescript
export function generateMetadata({ params }): Metadata {
  return {
    title: `${state.name} Solar Calculator — SolarBharat`,
    description: `Free district-specific solar feasibility for ${state.name}. Real PM-KUSUM data, honest financial model, verified contractors.`,
    keywords: [`solar ${state.name}`, `PM KUSUM ${state.name}`, `${state.name} solar subsidy`],
    openGraph: { ... },
    twitter: { ... }
  };
}
```

`sitemap.xml` — auto-generated. Must include:
- All state pages (6–28)
- All district pages (762 eventual, 60 Phase 1)
- All forum Q&A threads
- All contractor profiles

---

## 12. PDF Export

`src/lib/exportPdf.ts` — client-side jsPDF + html2canvas (Plan0 originally named `exportPDF.ts`; repo uses camelCase for tooling compatibility):
```typescript
export async function exportReport(elementId: string, filename: string) {
  const canvas = await html2canvas(document.getElementById(elementId)!, {
    backgroundColor: '#0a0f1e',
    scale: 2,
    useCORS: true
  });
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  // Add SolarBharat header
  // Add all 6 tab sections as pages
  // Add watermark: "Generated by SolarBharat.in — Estimates only"
  // Add disclaimer footer on each page
  pdf.save(filename);
}
```

---

## 13. Supabase Schema (Phase 2 Tables)

Run migrations from `supabase/migrations/`:
```sql
-- contractors
CREATE TABLE contractors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  state_key text NOT NULL,
  districts text[],
  geda_number text,
  mnre_number text,
  projects_completed int DEFAULT 0,
  rating numeric(3,2) DEFAULT 0,
  verified boolean DEFAULT false,
  featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- contractor_applications  
-- forum_topics, forum_replies
-- quota_snapshots
-- email_alert_subscriptions
-- review_intake
-- financing_leads
```

---

## 14. Common Bugs to Avoid

1. **Never** use `performance_ratio = 0.85` — always use `0.78` (conservative, honest)
2. **Never** show subsidy as arriving at sanction — always "4–9 months post-COD"
3. **Never** use non-ALMM panel brands in supplier listings
4. **Never** run the service worker in `NODE_ENV === 'development'`
5. **Always** add `data-report-section` attributes to all 6 tab panels for jsPDF capture
6. **Always** normalize district names before lookup (trim, lowercase, handle diacritics)
7. **Always** show the "Land cost: ₹0" line in the cost table — it's a psychological anchor
8. **Always** highlight Year 11 row in the 25-year table (loan paid → profit triples)
9. **NASA POWER** returns `ALLSKY_SFC_SW_DWN` in Wh/m²/day — divide by 1000 for kWh
10. **Bigha** conversion varies by state (Bihar bigha ≠ Gujarat bigha) — use 0.6198 acres as standard with a note

---

## 15. Performance Targets

| Metric | Target |
|--------|--------|
| LCP | < 2.5s on 4G |
| CLS | < 0.1 |
| FID/INP | < 200ms |
| Bundle size (JS) | < 180KB gzipped |
| Time to interactive | < 3.5s |
| Lighthouse PWA score | 100 |
| Lighthouse Performance | ≥ 90 |

Calculator must compute and render full report in **< 200ms** (all client-side, no await needed for Phase 1).

---

## 16. Testing Checklist

Before every PR:
- [ ] Calculator → Report full flow (all 6 states × all 3 technologies)
- [ ] Area unit conversions correct (esp. bigha and guntha)
- [ ] Financial model: Year 11 EMI = 0 ✓
- [ ] Financial model: cumulative matches manual spot-check
- [ ] PWA install prompt appears (build + start, HTTPS)
- [ ] Offline fallback renders `/offline` page
- [ ] PDF export: all 6 tabs included, watermark present
- [ ] Mobile: all 6 tabs scrollable, bottom nav correct
- [ ] Desktop: report layout uses 2-column where applicable
- [ ] i18n: EN / HI / GU all render without broken strings
- [ ] `sitemap.xml` generates all expected URLs
- [ ] All Supabase policies allow anonymous read on contractors/quota
- [ ] No `console.error` in production

---

## 17. Environment Variables

```bash
# .env.local — copy from .env.example

# Required
NEXT_PUBLIC_SITE_URL=https://solarbharat.in

# Optional Phase 2
NREL_API_KEY=your_key_from_developer.nrel.gov
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx

# Optional analytics
NEXT_PUBLIC_POSTHOG_KEY=phc_xxx
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# Optional email
NEXT_PUBLIC_SUPPORT_EMAIL=hello@solarbharat.in
```

---

## 18. Deployment

**Vercel (recommended):**
```bash
cd solarbharat
vercel --prod
```
Set env vars in Vercel dashboard. Enable Edge Functions for `/api/solar` route.

**GitHub Pages (static preview only):**
```bash
NEXT_PUBLIC_BASE_PATH=/Solcore NEXT_PUBLIC_SITE_URL=https://ruddvz.github.io \
  npm run export:github-pages
```
Note: No API routes on Pages. Solar data uses NASA POWER client-side.

---

*SolarBharat — India's Solar Intelligence Platform*
*Prompt v1.0 | May 2026 | github.com/ruddvz/Solcore*

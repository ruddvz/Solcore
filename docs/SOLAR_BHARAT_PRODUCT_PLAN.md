# SolarBharat — Full Product Plan

### India's Solar Intelligence Platform

**Version 1.0 | May 2026 | Confidential**

-----

## Table of Contents

1. [Vision & Mission](#1-vision--mission)
1. [The Problem We Solve](#2-the-problem-we-solve)
1. [What Canada & the US Does Better](#3-what-canada--the-us-does-better)
1. [Product Overview](#4-product-overview)
1. [Core Features — Phase 1 MVP](#5-core-features--phase-1-mvp)
1. [Core Features — Phase 2](#6-core-features--phase-2)
1. [Core Features — Phase 3](#7-core-features--phase-3)
1. [Data Architecture](#8-data-architecture)
1. [Financial Model & Monetization](#9-financial-model--monetization)
1. [Technology Stack](#10-technology-stack)
1. [State Coverage Roadmap](#11-state-coverage-roadmap)
1. [Supplier & Contractor Directory](#12-supplier--contractor-directory)
1. [Content Strategy — The Wikipedia Layer](#13-content-strategy--the-wikipedia-layer)
1. [Design System](#14-design-system)
1. [SEO & Growth Strategy](#15-seo--growth-strategy)
1. [Risk Register — Business Risks](#16-risk-register--business-risks)
1. [Competitive Landscape](#17-competitive-landscape)
1. [Team & Hiring Plan](#18-team--hiring-plan)
1. [Phase-by-Phase Build Plan](#19-phase-by-phase-build-plan)
1. [Success Metrics (KPIs)](#20-success-metrics-kpis)
1. [Appendix — Data Sources](#21-appendix--data-sources)

-----

## 1. Vision & Mission

### Vision

To become the single most trusted source of solar information in India — the platform that every farmer, landowner, and rooftop owner turns to before making any solar decision.

### Mission

Give every Indian land and property owner honest, district-specific solar feasibility data — for free — with the depth, accuracy, and transparency that currently only exists for the wealthy who can afford a consultant.

### The One-Line Pitch

**"EnergySage + Google Project Sunroof + HomeStars + a performance database — built specifically for India."**

### Why Now

- India has a target of 500 GW renewable by 2030. It is at ~200 GW today.
- PM-KUSUM has Rs.34,422 crore allocated but awareness and application rates are far below target.
- 250 million farms are eligible. Only a fraction have applied.
- No consumer-facing platform exists that gives honest, location-specific guidance.
- The information gap is being filled by commission-hungry EPC salespeople — costing farmers crores in bad decisions.

-----

## 2. The Problem We Solve

### What currently happens when a farmer in Bharuch wants to go solar

1. Hears about PM-KUSUM from a neighbour or a bank agent
1. Calls an EPC contractor who gives an inflated quote with misleading numbers (25L units/year, 10% cash only, 60-day subsidy)
1. Has no way to verify if numbers are honest
1. Signs a contract without understanding the PPA tariff risk, NA conversion risk, or grid connection cost
1. Either loses money, gets delayed 18 months, or abandons the project entirely

### The information asymmetry is total

|What the farmer knows       |What the EPC salesperson knows                           |
|----------------------------|---------------------------------------------------------|
|"Solar is good"             |Exact subsidy benchmark to exploit                       |
|"Government pays most of it"|Real grid connection cost at that land                   |
|"I'll earn lakhs"           |That PM-KUSUM quota for that district is almost full     |
|"My neighbour did it"       |That the tariff they quoted is optimistic by Rs.0.40/unit|

SolarBharat closes this gap entirely. We give the farmer the same information the EPC contractor has — plus independent verification they cannot get anywhere else.

-----

## 3. What Canada & the US Does Better

These are direct product inspiration points, not just observations. Each one maps to a specific SolarBharat feature.

### 3.1 EnergySage (US) — Standardised Quote Comparison

EnergySage forces all installers to submit quotes in a standardised format. The homeowner gets 3–5 quotes they can actually compare side by side. In India, every EPC quote comes in a different format with different assumptions hidden in footnotes.

**SolarBharat response:** Quote Standardisation Layer (Phase 2). Every contractor on our platform submits quotes using our template. Customers see a clean comparison table. Contractors who refuse to use our format are not listed.

### 3.2 Google Project Sunroof (US/Canada) — Satellite Solar Analysis

Google uses satellite imagery to calculate the exact solar potential of your specific roof or land — accounting for trees, buildings, and shading by hour of day. India has no equivalent.

**SolarBharat response:** Pin-drop satellite analysis (Phase 2). User drops a pin on their land. We overlay NREL solar data + Google Maps satellite imagery to give location-specific yield estimates, not district averages.

### 3.3 HomeStars / Houzz (Canada) — Verified Contractor Reviews

Every trades contractor in Canada has verified reviews from actual customers. You know who is good before you hire. In India's solar market, contractor quality is completely opaque.

**SolarBharat response:** Installation-Verified Reviews (Phase 2). Only verified customers — matched to actual COD records from DISCOM/GEDA — can leave reviews. Not Google reviews that anyone can fake.

### 3.4 pvoutput.org + PVWatts (US/Canada/Global) — Public Performance Benchmarks

Plant owners share their actual generation data publicly. A farmer in Rajasthan can look up what a similar 1.5 MW plant in Gujarat is actually producing month by month.

**SolarBharat response:** Performance Database (Phase 2–3). Opt-in SCADA data sharing. Plant owners connect their inverter monitoring (Sungrow, Growatt, Huawei all have APIs). We aggregate anonymised benchmarks by state/size/technology. First public solar performance database in India.

### 3.5 Digital-First Solar Financing (US/Canada)

In Canada you can finance a solar installation like a car loan — online application, instant pre-approval, cash-flow positive from Month 1. SBI and NABARD have solar loans but the process is 3-week, branch-visit, physical documents.

**SolarBharat response:** Embedded Financing (Phase 3). Partner with one progressive NBFC (Electronica Finance, Muthoot, or new-age lender). Single form, 24-hour pre-approval, contractor gets paid digitally. We earn referral fee.

### 3.6 Post-Installation Accountability (Ontario ESA Model)

Every solar installation in Ontario requires a licensed electrician sign-off, ESA inspection, and utility interconnection approval — all tracked in a government system.

**SolarBharat response:** Independent Verification Service (Phase 3). Network of qualified engineers who visit installations 30 days after COD. Paid by contractor as part of listing fee. Customer gets a verified report. This is what RERA did for real estate — we do it for solar.

### 3.7 Live Scheme Status (IESO Model, Canada)

In Canada, the grid operator publishes exactly what incentives are available, what the waitlist is, and what the current tariff is — updated in real time.

**SolarBharat response:** Live Scheme Tracker (Phase 2). PM-KUSUM quota status by state/district. Crowdsourced + scraped from official portals. "PM-KUSUM Bharuch District: Last reported 42 MW remaining (updated 3 days ago, source: 3 contractor reports)."

### 3.8 Active Solar Communities (Reddit r/solar, EnergySage Forums)

North American solar communities are extremely active, public, and searchable. Every question answered becomes a permanent Google-indexed resource.

**SolarBharat response:** Public Q&A Forum (Phase 2). Solar-specific, organised by state/scheme/technology. Searchable. Over time this becomes the SEO backbone. Every answered question becomes a Google-indexed page.

-----

## 4. Product Overview

SolarBharat is a web platform (desktop and mobile) that does one thing: give any Indian land or property owner a complete, honest, district-specific solar feasibility report — instantly and for free.

### The Core User Journey

```
Land owner hears about solar
        ↓
Goes to SolarBharat.in
        ↓
Enters: State → District → Land Area → Land Unit → Technology
        ↓
Gets: Full personalised report in 2 seconds
        ↓
Report contains:
  • System capacity calculation
  • Real cost breakdown (line by line)
  • Subsidy stack (PM-KUSUM + state)
  • Honest cash requirement
  • Year-by-year 25-year financial model
  • Monthly generation chart
  • 40-year degradation analysis
  • Risk register (location-specific)
  • Step-by-step action plan with real contacts
  • Verified contractor directory
  • Agrivoltaics options and crop income
        ↓
Connects with verified contractor via platform
        ↓
Gets pre-approved loan via embedded partner
        ↓
Installs plant. Posts performance data.
```

### What Makes This Different From Every Other Solar Website in India

|Feature                           |Solar company websites  |Generic govt portals|SolarBharat                 |
|----------------------------------|------------------------|--------------------|----------------------------|
|District-specific data            |No — state averages only|No                  |Yes                         |
|Honest cash requirement           |Never                   |Unclear             |Always                      |
|Real subsidy disbursement timeline|Lies (30-60 days)       |Not mentioned       |Truth (4-9 months)          |
|Grid connection cost warning      |Never                   |Not mentioned       |Yes — first step            |
|40-year financial model           |Sales-optimised         |Not available       |Conservative and honest     |
|Risk register                     |None                    |None                |Location-specific           |
|Contractor verification           |Self-certified          |Empaneled only      |Independent verified reviews|
|Performance benchmarks            |Not available           |Not available       |Opt-in database (Phase 2)   |
|Language support                  |English only            |English/Hindi       |EN + HI + Regional          |
|Agrivoltaics guidance             |Not available           |Basic               |Full with crop data         |

-----

## 5. Core Features — Phase 1 MVP

**Timeline: 6–8 weeks | Stack: React + Tailwind | States: Gujarat, Rajasthan, Maharashtra, MP, Karnataka, UP**

### 5.1 Location Selector

- State dropdown → District dropdown
- State cards: GHI, peak sun hours, tariff range, subsidy scheme, DISCOM, nodal agency
- Monthly generation bar chart (visual, colour-coded by season)
- "State at a glance" fact panel

### 5.2 Land & System Configurator

- Land area input with unit selector: Acres, Bigha, Guntha, Hectare
- Auto-conversion between units displayed live
- System capacity calculated: 0.2 MW per acre (ground mount standard)
- Panel count, AC capacity, DC:AC ratio shown
- Technology selector: TOPCon N-Type Bifacial, Mono-PERC Bifacial, Mono-PERC Monofacial
  - Each shows: efficiency, degradation rate, cost/Wp, bifacial gain
  - Verdict badge: Best Choice / Good / Acceptable

### 5.3 Financial Model Engine

All calculations run client-side in real time. No backend needed for Phase 1.

**Inputs used:**

- State GHI (kWh/m²/day)
- Peak sun hours
- Performance Ratio: 78% default (honest, not 85% marketing)
- Bifacial rear gain: 12% for TOPCon, 8% for PERC Bifacial, 0% for Monofacial
- Degradation rate per technology
- Tariff: midpoint of state tariff range
- Subsidy percentage per state
- Loan: 30% at state-specific rate over 10 years
- O&M: Rs.4,500/kWp/year, +15% after Year 5

**Outputs:**

- Year 1 generation (lakh units)
- Total project cost (line-by-line breakdown)
- Subsidy amount
- Bank loan amount
- Your cash required (10% + 6% operating reserve)
- Monthly EMI
- Year-by-year net profit table (25 years)
- Cumulative cash flow chart
- Breakeven year
- Cash recovery year
- Post-loan monthly income (Year 11+)
- 25-year and 40-year total net profit
- Return multiple on cash invested

### 5.4 Report — 6 Tabs

**Tab 1: Overview**

- System summary card (MW, panels, inverters, tech)
- Location and climate card (GHI, monsoon, grid quality)
- 40-year cumulative cash flow chart
- 4 key metric boxes: Breakeven / Cash Back / Monthly Yr 11+ / Return Multiple
- Key warnings panel (non-dismissible): cash needed, PPA rule, transformer lead time, dust loss

**Tab 2: Costs and Subsidies**

- Donut chart: cost breakdown by category
- Line-by-line cost table: panels, inverters, mounting, transformer, civil, grid, cables, SCADA, robot, EPC, approvals, contingency
- Land cost shown as Rs.0 (you own it — psychological anchor)
- Funding stack visual bar: GOVT / LOAN / YOU with amounts
- Reality check box: subsidy disbursement warning, operating reserve requirement
- Additional benefits: GST 5%, accelerated depreciation, RECs, NABARD rate

**Tab 3: 25-Year Financial Model**

- Line chart of cumulative cash flow
- Full year-by-year table: Year, Units, Gross Revenue, O&M + EMI, Net Profit, Cumulative
- Year 11 highlighted (loan repaid — profit triples)
- 25-year total net profit footer row
- Note explaining the Year 11 golden phase

**Tab 4: Risk Register**

- 3-column grid: Risk / Financial Impact / Mitigation
- 8 risks, each probability-weighted (HIGH / MED / LOW)
- Location-specific risks: dust (inland), monsoon duration, grid distance
- Financial impact shown in rupees where calculable
- Mitigation is actionable, not generic

**Tab 5: Action Plan**

- Timeline with colour-coded phases: This Week / Week 2 / Week 3 / Month 1–2 / Month 5–9 / Month 10–14
- Each phase has 2–3 specific actions
- Real contact info: nodal agency phone number, DISCOM office name, bank branch
- Document checklist: 10 documents needed, each with a checkbox UI

**Tab 6: Suppliers**

- EPC Contractors (state-specific, 4 listed, VERIFIED badge)
- Panel Manufacturers (ALMM-listed, 5 listed, Gujarat/National tag)
- Inverter Brands (4 listed, warranty badge)
- Cleaning Robot Systems (3 options, Recommended badge)
- Financing Partners (3 options, interest rate displayed)

### 5.5 Agrivoltaics Section (within report)

- Layout options: Interspace / Stilt 2.5m / High Stilt 4–5m
- Crop recommendations by soil type and state
- Income estimates per acre per year
- Extra capital cost for stilt mount vs standard
- Phase 1/2/3 implementation plan
- NA conversion avoidance note

### 5.6 Homepage

- Hero: headline + subline + 5 stat pills
- CTA button: "Calculate My Solar ROI"
- 8 feature cards with icons
- State coverage section: live states (green) + coming soon states (grey)

-----

## 6. Core Features — Phase 2

**Timeline: Month 3–6 | Requires backend**

### 6.1 NREL API Integration

Replace hardcoded state GHI averages with live coordinate-based data.

- User drops a pin on an interactive map (Leaflet.js)
- Backend calls NREL NSRDB API with lat/lon
- Returns: GHI, DNI, DHI, temperature, wind speed — all monthly
- Every financial number recalculates from actual coordinate data
- District-average fallback if pin is not dropped

**NREL NSRDB API:** Free, covers all of India, returns 20+ years of hourly data.

### 6.2 Satellite Shading Analysis (Basic)

- Google Maps Static API overlay on pin-drop map
- Manual shading input slider (0–30% shading estimate)
- Adjusts PR downward based on shading input
- Phase 2 basic: manual input. Phase 3 upgrade: computer vision analysis.

### 6.3 Contractor Directory (Full)

- Submission form for contractors: company details, GEDA/MNRE empanelment number, projects completed, service districts, contact
- Manual verification by SolarBharat team (checked against GEDA/MNRE lists)
- Contractor profile pages: about, certifications, projects, reviews
- Filter by: state, district, project size, subsidy experience, technology
- "Request Quote" button sends lead to verified contractors

### 6.4 Installation-Verified Review System

- Only verified customers can leave reviews
- Verification: customer submits their COD certificate + plant ID
- We cross-check against DISCOM interconnection records
- Review fields: timeline accuracy, quality of work, post-installation support, overall rating
- EPC contractors can respond to reviews
- Fake review detection: IP + device fingerprinting + manual moderation

### 6.5 PM-KUSUM Quota Tracker

Live scheme status by state and district.

- Official portal scraper (GEDA, MNRE, RREC, MEDA etc.) running daily
- Crowdsourced reports from contractors: "I applied today for Bharuch — quota status was X"
- Displayed as: Available / Limited / Nearly Full / Quota Closed
- Last updated timestamp + source count
- Email alert: "Sign up to be notified when Bharuch quota reopens"

### 6.6 Quote Standardisation Tool

- Contractors submit quotes via SolarBharat form
- System generates standardised comparison format
- Customer sees: cost per Wp, panel brand + ALMM status, inverter brand, warranty terms, COD timeline, penalty clauses
- Side-by-side comparison table
- Flag: "This quote uses non-ALMM panels" / "This quote has no COD penalty clause"

### 6.7 Multi-Language UI

- English (complete)
- Hindi (complete)
- Gujarati (complete — already built in original HTML)
- Marathi, Rajasthani (basic — key terms translated)
- Language auto-detected from browser, manually switchable

### 6.8 PDF Report Export

- Full report exported as branded PDF
- Includes: all 6 tabs, charts, financial table, action plan, contacts
- Watermarked: "Generated by SolarBharat.in — estimates only"
- Download free for all users
- Premium version: removes watermark, adds custom logo (for consultants)

### 6.9 Public Q&A Forum

- Categories: By state, By scheme (PM-KUSUM, Rooftop, Open Access), By technology, By crop
- Search: full-text indexed
- Upvoting + verified answers (marked by SolarBharat team or verified installer)
- Every answered question becomes a Google-indexed page
- Thread permalinks, shareable on WhatsApp

### 6.10 Email Alerts

- "Notify me when [State] [District] PM-KUSUM quota opens"
- "Monthly solar news digest for [State]"
- "Tariff update for [State] DISCOM"
- "My report reminder: 3 months since you generated your report — have you applied yet?"

-----

## 7. Core Features — Phase 3

**Timeline: Month 7–12 | Full production platform**

### 7.1 Performance Database (India's First)

- Plant owners register their installation on SolarBharat
- Connect inverter monitoring via API: Sungrow, Growatt, Huawei, Fronius all have open APIs
- Data uploaded automatically: daily generation, PR, peak output
- Anonymised and aggregated: state, technology, size band, year of installation
- Public benchmark tool: "How does my plant compare to similar installations in Gujarat?"
- Contractor accountability: EPC contractors' installed plants are tracked. Poor performance = visible on their profile.

### 7.2 Embedded Financing

- Partnership with 1–2 progressive NBFCs or fintech lenders
- Single form inside SolarBharat report: income, land ownership, project details
- 24-hour pre-approval
- Approved loan letter downloadable (for GEDA application)
- Contractor gets paid digitally via platform escrow
- SolarBharat earns: Rs.500–2,000 referral per qualified lead

### 7.3 Independent Verification Service

- Network of 50+ freelance solar engineers across India (verified credentials)
- Post-installation site visit 30 days after COD
- Checks: panel count vs contract, ALMM sticker verification, inverter model, cable quality, grounding, SCADA working
- Digital report with photos uploaded to SolarBharat
- Cost: Rs.3,000–8,000 per inspection (paid by contractor as part of listing)
- Customer gets: peace of mind + verified report
- Contractor gets: credibility badge on their profile

### 7.4 Open Access Calculator

- For landowners near industrial zones or commercial areas
- Models direct sale to commercial/industrial consumers (Rs.5–8/unit vs Rs.3/unit PPA)
- Open access charges by state (wheeling, banking, cross-subsidy)
- ROI comparison: PPA vs Open Access vs Captive
- Potential buyer directory: industries in your district looking for green energy

### 7.5 Battery Storage Modelling

- Add-on to base solar calculation
- Models: grid-tied with export, hybrid with battery, off-grid
- Battery options: LFP, NMC, lead-acid
- Round-trip efficiency, cycle life, cost per kWh stored
- ROI calculation: peak-shift value + backup hours
- Recommendation: when battery addition is worth it vs not

### 7.6 Rooftop Solar Module

- Separate flow for urban rooftop users (not farmers)
- PM Surya Ghar Yojana (rooftop scheme) integration
- Roof area input (sq ft) instead of land area
- Shading analysis via Google Maps
- DISCOM rooftop connection process by city
- Net metering calculation

### 7.7 Mobile App

- React Native, same design system
- Offline report viewing (generated reports cached locally)
- Push notifications: quota alerts, tariff changes, scheme updates
- Camera: scan your land documents to extract survey number and area
- QR code: share your report with your CA or bank manager

### 7.8 Consultant Dashboard (B2B)

- For solar consultants, CAs, and financial advisors
- Generate reports for clients with their own branding
- Bulk report generation
- Client management: track which clients have applied, follow up reminders
- API access (Phase 3+): integrate SolarBharat data into their own tools
- Pricing: Rs.999/month for up to 20 reports/month

### 7.9 Tariff History & Trend Data

- Historical GERC/KERC/MERC tariff orders (public)
- Tariff trend charts by state: where is it going?
- Tariff comparison: states with best long-term rates
- Alert: "Your state's next tariff order is due in 3 months"

-----

## 8. Data Architecture

### 8.1 Solar Resource Data

|Source      |What it provides                          |Cost         |Update frequency|
|------------|------------------------------------------|-------------|----------------|
|NREL NSRDB  |GHI, DNI, DHI, temperature for any lat/lon|Free API     |Annual          |
|IMD India   |Ground-station verified data              |Free (public)|Monthly         |
|NREL PVWatts|System output estimates                   |Free API     |On-demand       |
|NASA POWER  |Backup solar resource                     |Free API     |Monthly         |

### 8.2 Scheme & Policy Data

|Source                    |What it provides             |How we get it       |
|--------------------------|-----------------------------|--------------------|
|MNRE pmkusum.mnre.gov.in  |Scheme guidelines, quota     |Web scraper         |
|GEDA geda.gujarat.gov.in  |Gujarat quota, empaneled EPCs|Web scraper + manual|
|RREC rrec.rajasthan.gov.in|Rajasthan quota              |Web scraper         |
|GERC gerc.in              |Gujarat tariff orders        |PDF scraper         |
|MERC mercindia.org.in     |Maharashtra tariff orders    |PDF scraper         |
|All state DISCOM websites |Connectivity charges         |Manual quarterly    |

### 8.3 Contractor Data

|Data point       |Source                |Verification                  |
|-----------------|----------------------|------------------------------|
|GEDA empanelment |GEDA list (public PDF)|Manual quarterly check        |
|MNRE empanelment |MNRE list             |Manual quarterly check        |
|Project count    |Self-reported         |Verified against COD documents|
|Review scores    |User-submitted        |Installation-verified only    |
|Panel brands used|Self-reported         |Spot-checked                  |

### 8.4 Market Pricing Data

|Data point           |Source                        |Update     |
|---------------------|------------------------------|-----------|
|Panel prices (Rs./Wp)|EPC submissions + MNRE tenders|Monthly    |
|Inverter prices      |Distributor surveys           |Quarterly  |
|O&M rates            |Contractor submissions        |Quarterly  |
|Labour costs         |Regional surveys              |Semi-annual|

### 8.5 Performance Data (Phase 2+)

|Data point       |Source                          |Frequency|
|-----------------|--------------------------------|---------|
|Daily generation |Sungrow/Growatt/Huawei API      |Daily    |
|Performance Ratio|Calculated from generation + GHI|Daily    |
|Availability     |SCADA downtime data             |Real-time|
|Degradation      |Year-over-year comparison         |Annual   |

-----

## 9. Financial Model & Monetization

### 9.1 Revenue Streams

**Stream 1: Contractor Listings (Primary Revenue)**

- Free tier: basic listing, 3 leads/month
- Standard: Rs.2,000/month — unlimited leads, standard profile
- Premium: Rs.5,000/month — featured placement, verified badge, quote tool, review management
- Enterprise: Rs.12,000/month — multi-district, API access, white-label reports
- Addressable market: 5,000+ solar EPCs and installers in India

**Stream 2: Financing Referral Fees**

- Rs.500–2,000 per qualified lead passed to NBFC partner
- Qualified = pre-approved + passed to contractor
- Estimated 15% conversion rate from report to lead
- Year 2 target: 500 leads/month = Rs.5–10L/month

**Stream 3: Premium PDF Reports**

- Basic report: Free (with watermark)
- Consultant version: Rs.499 one-time (branded, no watermark)
- Bulk pack for consultants: Rs.1,999/month for 20 reports

**Stream 4: Independent Verification Service**

- Rs.3,000–8,000 per installation inspection
- SolarBharat takes 30% (Rs.900–2,400 per inspection)
- Remainder goes to freelance engineer
- Target: 200 inspections/month by Year 2

**Stream 5: Training & Certification**

- "SolarBharat Verified Installer" certification course
- Online, self-paced, Rs.4,999 per person
- Includes: scheme knowledge test, financial modelling test, technical standards test
- Certified installers get a badge that increases trust

**Stream 6: Data Licensing (Year 3+)**

- Anonymised performance benchmark data to:
  - Panel manufacturers (warranty benchmarking)
  - Insurance companies (risk modelling)
  - Banks (solar loan portfolio analysis)
  - Government agencies (scheme effectiveness)

### 9.2 Unit Economics (Year 2 Target)

|Revenue Stream                               |Monthly Target|Annual        |
|---------------------------------------------|--------------|--------------|
|Contractor listings (500 × Rs.3,000 avg)     |Rs.15L        |Rs.1.8 Cr     |
|Financing referrals (200 × Rs.1,000 avg)     |Rs.2L         |Rs.24L        |
|Premium PDFs (300 × Rs.499)                  |Rs.1.5L       |Rs.18L        |
|Verification inspections (100 × Rs.2,000 net)|Rs.2L         |Rs.24L        |
|Training certifications (50 × Rs.4,999)      |Rs.2.5L       |Rs.30L        |
|**Total**                                    |**Rs.23L**    |**Rs.2.96 Cr**|

### 9.3 Cost Structure (Year 1)

|Cost                       |Monthly     |Notes                              |
|---------------------------|------------|-----------------------------------|
|Hosting (Vercel + Supabase)|Rs.5,000    |Scales with traffic                |
|NREL + Google Maps APIs    |Rs.8,000    |Usage-based                        |
|Developer (1 full-stack)   |Rs.80,000   |Can be self if founder is technical|
|Content writer (part-time) |Rs.20,000   |State guides, Q&A moderation       |
|Marketing (SEO + ads)      |Rs.30,000   |Mostly SEO in Year 1               |
|Legal + compliance         |Rs.5,000    |Monthly retainer                   |
|**Total**                  |**Rs.1.48L**|Rs.17.76L/year                     |

### 9.4 Break-Even Analysis

- Break-even at 50 paying contractor listings at Rs.3,000/month = Rs.1.5L/month
- Timeline to break-even: Month 8–10 (after Phase 2 contractor directory goes live)
- Cash needed to reach break-even: Rs.15–20L
- Can be bootstrapped if founder does own development

-----

## 10. Technology Stack

### 10.1 Frontend

- **Framework:** React 18 (Vite build)
- **Styling:** Tailwind CSS
- **Charts:** Recharts (line, bar, donut)
- **Maps:** Leaflet.js (free, no API cost for basic) + Mapbox (for satellite, Phase 2)
- **PDF Export:** jsPDF + html2canvas (client-side, Phase 1) → Puppeteer serverside (Phase 2)
- **State management:** Zustand (lightweight, no Redux overhead)
- **Forms:** React Hook Form + Zod validation
- **i18n:** react-i18next (English, Hindi, Gujarati)

### 10.2 Backend (Phase 2+)

- **Runtime:** Node.js with Express or Fastify
- **Database:** PostgreSQL via Supabase (managed, free tier generous)
- **ORM:** Prisma
- **Auth:** Supabase Auth (email, Google, phone OTP)
- **File storage:** Supabase Storage (COD certificates, inspection photos)
- **Background jobs:** BullMQ (scraping, alerts, report generation)
- **Search:** Meilisearch (Q&A forum full-text search)

### 10.3 Data Pipeline

- **Scrapers:** Playwright (headless browser for govt portals)
- **PDF parsing:** PyMuPDF + GPT-4 Vision for GERC tariff orders
- **Solar API wrapper:** FastAPI (Python) for NREL + NASA POWER calls
- **Data store:** TimescaleDB extension in Postgres for time-series performance data

### 10.4 Infrastructure

- **Frontend hosting:** Vercel (CDN, edge, free tier → Pro at scale)
- **Backend hosting:** Railway or Render (Phase 2), AWS ECS (Phase 3)
- **Database:** Supabase (managed Postgres, free 500MB → Pro Rs.2,000/month)
- **Email:** Resend.com (Rs.0 for first 100K emails/month)
- **Analytics:** Posthog (open source, self-hosted, free)
- **Error tracking:** Sentry (free tier)
- **Monitoring:** Uptime Robot (free)

### 10.5 Phase 1 Stack (MVP — no backend needed)

- Vite + React + Tailwind
- All calculations in client-side JavaScript
- State data hardcoded as JSON
- Deploy to Vercel: `git push` → live in 30 seconds
- Zero monthly cost until traffic needs scaling
- Domain: solarbharat.in (check availability, Rs.800/year on GoDaddy)

-----

## 11. State Coverage Roadmap

### Phase 1 — 6 States (May–June 2026)

|State         |Nodal Agency|Key Districts                       |GHI|Subsidy|
|--------------|------------|------------------------------------|---|-------|
|Gujarat       |GEDA        |Bharuch, Surat, Ahmedabad, Rajkot   |5.5|60%    |
|Rajasthan     |RREC        |Jodhpur, Jaisalmer, Bikaner, Barmer |6.0|60%    |
|Maharashtra   |MEDA        |Nashik, Pune, Solapur, Nagpur       |5.2|50%    |
|Madhya Pradesh|MPUVNL      |Bhopal, Indore, Rewa, Gwalior       |5.4|60%    |
|Karnataka     |KREDL       |Tumkur, Bellary, Raichur, Vijayapura|5.3|50%    |
|Uttar Pradesh |UPNEDA      |Agra, Jhansi, Lucknow, Mathura      |5.1|55%    |

### Phase 2 — 6 More States (Month 4–6)

|State         |Nodal Agency|Priority Reason                                |
|--------------|------------|-----------------------------------------------|
|Tamil Nadu    |TEDA        |3rd largest solar state, strong industrial base|
|Andhra Pradesh|NREDCAP     |Massive PM-KUSUM allocation, agricultural focus|
|Telangana     |TSREDCO     |Active solar market, good grid                 |
|Haryana       |HAREDA      |Close to Delhi NCR, rooftop + ground mount     |
|Punjab        |PEDA        |Agricultural land + tube-well solar potential  |
|Odisha        |OREDA       |Emerging market, low competition               |

### Phase 3 — Full India Coverage (Month 7–12)

All remaining states added. Includes:

- Northeast states (Assam, Meghalaya) — lower GHI but high energy cost = good ROI
- Hilly states (Himachal, Uttarakhand) — rooftop focus, different terrain calculations
- Island territories (Andaman, Lakshadweep) — off-grid and battery storage priority

-----

## 12. Supplier & Contractor Directory

### 12.1 Panel Manufacturers (ALMM Listed Only)

|Manufacturer    |Location       |Technology           |ALMM Status|Notes                                                |
|----------------|---------------|---------------------|-----------|-----------------------------------------------------|
|Waaree Energies |Surat, Gujarat |TOPCon Bifacial, PERC|Listed     |Largest Indian manufacturer. Gujarat presence strong.|
|Adani Solar     |Mundra, Gujarat|TOPCon, PERC         |Listed     |Integrated cell-to-module. Reliable supply.          |
|Vikram Solar    |Kolkata, WB    |TOPCon HiDM, PERC    |Listed     |Strong TOPCon range. National service.               |
|Goldi Solar     |Surat, Gujarat |PERC, TOPCon         |Listed     |Competitive pricing. Growing fast.                   |
|Premier Energies|Hyderabad, TS  |TOPCon, HJT          |Listed     |New HJT line coming 2026.                            |
|Tata Power Solar|Bengaluru, KA  |PERC, TOPCon         |Listed     |Tata brand trust. Premium pricing.                   |
|Saatvik Solar   |Noida, UP      |PERC                 |Listed     |Budget option. ALMM compliant.                       |

**ALMM verification:** Cross-check against MNRE's official ALMM list at mnre.gov.in before every contractor submission. Non-ALMM panels disqualify subsidy.

### 12.2 Inverter Brands (Gujarat + National Service)

|Brand  |Origin |Model (100kW) |Warranty|India Presence     |Notes                                 |
|-------|-------|--------------|--------|-------------------|--------------------------------------|
|Sungrow|China  |SG100CX       |5 years |15+ service centres|Market leader in India. Most reliable.|
|Huawei |China  |SUN2000-100KTL|5 years |12 service centres |Best monitoring platform. Smart IV.   |
|SMA    |Germany|Sunny Tripower|5 years |8 service centres  |Premium reliability. Higher cost.     |
|Growatt|China  |MAX 100KTL3-X |5 years |10 service centres |Budget-friendly. Good for sub-500kW.  |
|Fronius|Austria|Eco 99.9kW    |5 years |6 service centres  |Premium. Long life expectancy.        |
|Delta  |Taiwan |M100A         |5 years |8 service centres  |Good reliability. Competitive.        |

### 12.3 Cleaning Robot Systems

|Brand              |Origin     |Type                |Capital Cost|Annual Running|Coverage  |Notes                                               |
|-------------------|-----------|--------------------|------------|--------------|----------|----------------------------------------------------|
|Solabot            |Pune, India|Rail-mounted        |Rs.8–12L    |Rs.50–80K     |Up to 5 MW|Nightly auto-run. No water. RECOMMENDED.            |
|Taypro             |India      |Portable semi-auto  |Rs.6–9L     |Rs.40–70K     |Flexible  |Dual-pass air + microfibre. Good for varied layouts.|
|Aegeus Technologies|India      |Autonomous          |Rs.10–15L   |Rs.60K–1L     |Up to 5 MW|Self-charging. Auto-scheduling. Premium.            |
|Ecoppia            |Israel     |AI-driven autonomous|Rs.20–30L   |Rs.1–1.5L     |5+ MW     |Used by NTPC, Adani. Overkill for under 3 MW.       |

### 12.4 EPC Contractors by State

**Gujarat**

- Waaree Energies (EPC division) — waaree.com
- KPI Green Energy — kpigreenenergy.com
- Heaven Green Energy — GEDA-empaneled
- Enerparc India — enerparc.in
- Goldi Solar EPC — goldisolar.com

**Rajasthan**

- Rays Power Experts — rayspowerexperts.com
- ACME Solar — acmesolar.in
- Sterling and Wilson — sterlingandwilson.com
- Azure Power — azurepower.com

**Maharashtra**

- Tata Power Solar EPC — tatapowersolar.com
- SunSource Energy — sunsourceenergy.com
- Goldi Solar — goldisolar.com
- Hero Future Energies — herofutureenergies.com

**Madhya Pradesh**

- NTPC Renewable — ntpc.co.in
- Greenko — greenkogroup.com
- ReNew Power — renewpower.in

**Karnataka**

- Greenko — greenkogroup.com
- Fourth Partner Energy — fourthpartnerenergy.com
- CleanMax Solar — cleanmaxsolar.com

**Uttar Pradesh**

- NTPC Solar — ntpc.co.in
- SB Energy (SoftBank) — sbenergy.in
- Hero Future Energies — herofutureenergies.com

### 12.5 Financing Partners

|Institution               |Scheme                 |Rate  |Tenure     |Notes                            |
|--------------------------|-----------------------|------|-----------|---------------------------------|
|SBI                       |Kisan Solar Energy Loan|7–7.5%|10–15 years|Best rate. Branch visit needed.  |
|NABARD                    |Solar Refinance        |7.5–8%|10 years   |For cooperatives + farmer groups.|
|IREDA                     |Term Loan              |8–8.5%|15 years   |For projects above 500 kW.       |
|SIDBI                     |Green Energy Loan      |8.5–9%|10 years   |For MSME + agri-solar.           |
|Rural Electrification Corp|Project Finance        |8–8.5%|15 years   |Large projects.                  |

-----

## 13. Content Strategy — The Wikipedia Layer

### 13.1 Content Pillars

**Pillar 1: Scheme Guides**
Deep-dive guides for every government solar scheme:

- PM-KUSUM Component A (ground mount, farmers)
- PM-KUSUM Component B (pump solarisation)
- PM-KUSUM Component C (feeder solarisation)
- PM Surya Ghar Yojana (rooftop, urban)
- Kisan Suryoday Yojana (Gujarat)
- State-specific top-up schemes (all 29 states)

Each guide covers: eligibility, application process, documents needed, subsidy calculation, timeline, real disbursement experience, common pitfalls.

**Pillar 2: Technology Explainers**
Plain-language guides:

- TOPCon vs PERC vs HJT — which is right for your climate?
- Bifacial panels — does the extra cost pay off?
- String inverters vs central inverters — for what scale?
- Battery storage — when does it make sense in India?
- ALMM — what it means and why it matters
- Agrivoltaics — complete guide to solar + farming

**Pillar 3: State Guides**
One deep page per state:

- Solar resource (GHI map, peak sun hours by district)
- Subsidy scheme details
- DISCOM connection process
- Tariff history and current rate
- Top EPC contractors
- Case studies: real plants, real numbers
- Common pitfalls in this state

**Pillar 4: Financial Literacy**

- How to read a solar EPC quote — 10 red flags
- What PM-KUSUM benchmark cost means (and why it matters)
- Understanding PPA vs open access vs captive
- Solar depreciation benefits — how to claim 40%
- REC income — what it is and how to apply

**Pillar 5: Scam & Fraud Awareness**

- "10 solar scams targeting Indian farmers in 2026"
- How to verify if an EPC is GEDA-empaneled
- How to check if panels are ALMM-listed
- Red flags in solar EPC contracts
- What to do if your contractor disappears after advance

### 13.2 SEO Content Calendar

|Month|Primary Content               |Target Keywords                                   |
|-----|------------------------------|--------------------------------------------------|
|1    |PM-KUSUM guide (Gujarat)      |PM KUSUM Gujarat apply, GEDA solar subsidy        |
|1    |PM-KUSUM guide (Rajasthan)    |PM KUSUM Rajasthan, RREC solar                    |
|2    |TOPCon vs PERC India          |TOPCon bifacial India, best solar panel India 2026|
|2    |Gujarat solar plant calculator|Gujarat solar plant cost calculator               |
|3    |All state guides              |[State] solar subsidy, [State] solar plant cost   |
|4    |EPC scam awareness            |Solar EPC fraud India, how to check GEDA empaneled|
|5    |Agrivoltaics India            |Agri solar India, solar panel farming crops       |
|6    |Open access solar India       |Open access solar [State], industrial solar India |

### 13.3 Distribution Channels

- **SEO:** Primary driver. Each deep guide is a dedicated URL optimised for long-tail keywords.
- **WhatsApp:** Solar-specific groups. Share infographics of key risk warnings and subsidy data.
- **YouTube:** "SolarBharat Explains" shorts — 60-second clips on specific topics (subsidy reality, how to read a quote)
- **LinkedIn:** Targeting solar industry professionals, financial advisors, CA firms
- **Facebook:** Farmer groups in Gujarat, Rajasthan, Maharashtra
- **Partnerships:** NABARD rural branches, Krishi Vigyan Kendras (KVKs), district collector offices

-----

## 14. Design System

### 14.1 Brand Identity

**Name:** SolarBharat

**Tagline options:**

- "India's Solar Truth Engine"
- "Every Number. No Guesswork."
- "Solar Intelligence. For Every Indian."

**Logo concept:** Sun icon (☀) in a square with rounded corners. Gradient: gold (#fbbf24) to orange (#f97316). Clean, not busy.

### 14.2 Color Palette

|Token            |Hex                   |Usage                           |
|-----------------|----------------------|--------------------------------|
|Background Dark  |#0a0f1e               |Page background                 |
|Background Medium|#0d1a2e               |Card surfaces                   |
|Background Accent|#071a0e               |Green-tinted sections           |
|Gold Primary     |#fbbf24               |CTAs, highlights, active states |
|Gold Dark        |#f59e0b               |Hover states                    |
|Green Primary    |#22c55e               |Positive numbers, success states|
|Green Dark       |#16a34a               |Dark version of green           |
|Green Muted      |#86efac               |Light text on dark green bg     |
|Orange Accent    |#f97316               |Cash/cost warnings              |
|Red Alert        |#ef4444               |HIGH risk, critical warnings    |
|Blue Info        |#0ea5e9               |Inverters, informational        |
|Purple Feature   |#8b5cf6               |Robot/tech features             |
|Grey Muted       |#6b7280               |Disabled, footnotes             |
|White Primary    |#ffffff               |Primary text                    |
|White Dimmed     |rgba(255,255,255,0.55)|Body text                       |
|White Subtle     |rgba(255,255,255,0.35)|Labels, captions                |

### 14.3 Typography

|Element    |Font             |Size                  |Weight        |
|-----------|-----------------|----------------------|--------------|
|Hero H1    |Segoe UI / System|clamp(28px, 5vw, 50px)|900           |
|Section H2 |Segoe UI / System|22–24px               |800           |
|Card title |Segoe UI / System|12px                  |800, uppercase|
|Body text  |Segoe UI / System|14–15px               |400           |
|Data values|Monospace        |22px                  |800           |
|Labels     |Segoe UI / System|11–12px               |700, uppercase|
|Table      |Segoe UI / System|12.5px                |400/700       |

### 14.4 Component Library (built in Phase 1)

- `Card` — container with accent border
- `KV` (Key-Value row) — label + value, three states: normal/highlight/warn
- `Pill` (Stat pill) — large number + small label
- `MonthBars` — monthly generation bar chart
- `LineChart` — SVG cumulative cash flow
- `Donut` — SVG cost breakdown
- `Tab` — tab bar with active state
- `StepBar` — progress stepper
- `Select` — styled dropdown
- `RangeInput` — styled slider with live value display
- `TechCard` — radio-style technology selector
- `FundingStack` — horizontal bar split (Govt / Loan / You)
- `RiskGrid` — 3-column risk register
- `Timeline` — dot-and-line action plan

-----

## 15. SEO & Growth Strategy

### 15.1 Technical SEO

- Server-side rendering (SSR) for all report pages via Next.js (Phase 2 migration)
- Every state guide and Q&A answer is a static page (SSG)
- Schema markup: FAQPage, HowTo, LocalBusiness for contractor profiles
- Core Web Vitals: target LCP < 2.5s, CLS < 0.1
- Sitemap auto-generation for 500+ content pages
- Robots.txt: allow all, disallow admin
- Canonical URLs on all pages

### 15.2 Keyword Strategy

**Tier 1 (high volume, competitive):**

- "solar panel subsidy India" — 40K searches/month
- "PM KUSUM scheme" — 90K searches/month
- "solar plant cost India" — 25K searches/month

**Tier 2 (medium volume, low competition):**

- "solar plant cost per acre Gujarat" — 2K/month
- "PM KUSUM Gujarat apply" — 5K/month
- "GEDA empaneled EPC list" — 800/month

**Tier 3 (long-tail, zero competition, high intent):**

- "how much cash do I need for 1.5 MW solar plant"
- "PM KUSUM subsidy comes after how many months"
- "is agrivoltaics allowed under PM KUSUM"
- "TOPCon vs PERC which is better for Gujarat climate"

These long-tail terms have almost zero competition and extremely high buying intent. Target 500+ of them.

### 15.3 Growth Loops

**Loop 1: SEO → Report → Share**
User finds article about PM-KUSUM → generates report → shares PDF with neighbour → neighbour generates their own report

**Loop 2: Contractor → Customer → Review**
Contractor lists on platform → sends customers to SolarBharat for unbiased report → customer leaves verified review → review attracts more customers

**Loop 3: Performance Data → Benchmark → Traffic**
Plant owner uploads performance data → we publish "Gujarat 1.5 MW plants average PR 78%" → this is a quotable fact that gets linked to by news sites, bloggers, MNRE reports → massive SEO authority

**Loop 4: Forum → Google → New Users**
Every Q&A answered becomes a Google-indexed page → long-tail searches find the forum → new user generates a report → they stay and ask their own question

-----

## 16. Risk Register — Business Risks

|Risk                                                    |Probability|Impact|Mitigation                                                                                                        |
|--------------------------------------------------------|-----------|------|------------------------------------------------------------------------------------------------------------------|
|NREL API rate limits                                    |LOW        |Medium|Cache all API calls. Fallback to hardcoded state data.                                                            |
|Government portal structure changes (breaks scrapers)   |HIGH       |Low   |Manual quarterly update fallback. Alert system for scraper failures.                                              |
|EPC contractors gaming reviews                          |MED        |HIGH  |Installation-verified-only reviews. IP + device fingerprinting. Manual moderation.                                |
|PM-KUSUM scheme discontinued                            |LOW        |HIGH  |Platform stays relevant for open access + rooftop schemes. Diversify beyond PM-KUSUM from Day 1.                  |
|Large competitor (Google, MNRE, EnergySage India) enters|MED        |HIGH  |Build data moat (contractor reviews, performance database) early. Community is the defensible asset.              |
|Data accuracy claims / legal liability                  |MED        |MED   |Clear disclaimer on every page. "Estimates only" watermark on PDFs. No specific financial advice. T&C covers this.|
|Low contractor adoption                                 |MED        |HIGH  |Free listings in Phase 1. Only ask for money once we have user traffic. Show value first.                         |
|Regulatory change to solar subsidies                    |MED        |LOW   |Tracker built for this. Alerts to users. Platform adapts quickly to new scheme rules.                             |
|Domain / trademark conflict                             |LOW        |MED   |Check SolarBharat.in availability. Alternatives: SolarSaathi.in, SolarNiti.in, KisanSolar.in                      |

-----

## 17. Competitive Landscape

### 17.1 Direct Competitors (India)

|Platform                 |What they do           |Weakness                          |Our advantage                        |
|-------------------------|-----------------------|----------------------------------|-------------------------------------|
|SolarDukan.com           |Lead gen for installers|No financial model, no honest data|Deep financial model + honest numbers|
|Zunroof                  |Rooftop solar focus    |Urban only, not farmer-focused    |Rural + agricultural land focus      |
|Luminous/Havells websites|Product sales          |No planning tool                  |Planning tool, not product sales     |
|MNRE portals             |Official info          |Opaque, not user-friendly         |UX + honest interpretation           |
|EPC company websites     |Self-promotion         |Biased, inflated numbers          |Independent, honest                  |

### 17.2 Indirect Competitors

|Platform                     |How they compete     |Our advantage                               |
|-----------------------------|---------------------|--------------------------------------------|
|YouTube solar channels       |Information          |Interactive, personalised, location-specific|
|WhatsApp groups              |Community advice     |Searchable, verified, not anecdotal         |
|Solar consultants            |Same service but paid|Free, instant, scalable                     |
|CA firms with solar knowledge|Financial advice     |Specialised + free tier                     |

### 17.3 Global Benchmarks We Are Building Toward

|Platform                |Country  |Valuation |What they do              |
|------------------------|---------|----------|--------------------------|
|EnergySage              |USA      |$200M+    |Solar marketplace + quotes|
|Project Sunroof (Google)|USA      |Internal  |Satellite solar analysis  |
|pvoutput.org            |Australia|Community |Performance database      |
|SolarQuotes             |Australia|Profitable|Reviews + guides          |
|EnergyGuide.com         |Canada   |Acquired  |Comparison + guides       |

India's market is larger than all of these combined in terms of addressable installations.

-----

## 18. Team & Hiring Plan

### 18.1 Founding Team (Phase 1 — Can be solo)

|Role               |Skills needed                          |Phase 1             |
|-------------------|---------------------------------------|--------------------|
|Founder / Product  |Vision, product decisions, partnerships|You                 |
|Developer          |React, Node.js, PostgreSQL             |Self or 1 hire      |
|Solar domain expert|Scheme knowledge, EPC verification     |Part-time consultant|

### 18.2 Phase 2 Hires (Month 4–6)

|Role                                      |Salary Range   |Priority|
|------------------------------------------|---------------|--------|
|Full-stack developer (India, remote)      |Rs.60–90K/month|HIGH    |
|Content writer — solar domain             |Rs.25–40K/month|HIGH    |
|Operations (contractor onboarding)        |Rs.20–30K/month|MED     |
|Solar engineer (verification network lead)|Rs.50–70K/month|MED     |

### 18.3 Phase 3 Hires (Month 7–12)

|Role                                  |Salary Range          |Notes                           |
|--------------------------------------|----------------------|--------------------------------|
|Head of Sales (contractor acquisition)|Rs.60–80K + commission|Builds contractor base          |
|Data engineer                         |Rs.80–120K            |SCADA integration, data pipeline|
|Mobile developer (React Native)       |Rs.70–100K            |App development                 |
|Community manager                     |Rs.25–40K             |Forum moderation, WhatsApp      |

### 18.4 Advisors to Recruit

- **Solar EPC veteran** — 10+ years in Indian solar market. Brings credibility and contractor relationships.
- **GEDA / MNRE bureaucrat (retired)** — Policy knowledge and government relationships.
- **Fintech / NBFC professional** — Embedded financing partnerships.
- **Data scientist** — Performance database architecture.

-----

## 19. Phase-by-Phase Build Plan

### Phase 1 — MVP (Weeks 1–8)

**Week 1–2:**

- [ ] Set up Vite + React + Tailwind project
- [ ] Build location selector component (6 states, 10 districts each)
- [ ] Build land configurator with unit conversion
- [ ] Build technology selector (3 options)
- [ ] Build financial model engine (calcAll function)

**Week 3–4:**

- [ ] Build report header with 6 stat pills
- [ ] Build Overview tab (system summary, climate, chart, warnings)
- [ ] Build Costs tab (donut chart, funding stack, line items)
- [ ] Build line chart component (SVG, 40-year data)

**Week 5–6:**

- [ ] Build 25-Year Model tab (table + chart)
- [ ] Build Risk Register tab (3-column grid)
- [ ] Build Action Plan tab (timeline + contacts + checklist)
- [ ] Build Suppliers tab (all 4 sections)

**Week 7–8:**

- [ ] Build Agrivoltaics section
- [ ] Build homepage (hero + features + state coverage)
- [ ] Add language toggle (EN/HI/GU) — strings only
- [ ] Performance testing and mobile optimisation
- [ ] Deploy to Vercel on custom domain
- [ ] Basic analytics (Posthog)

**Launch deliverable:** Working web app, 6 states, full report flow, deployed on solarbharat.in

-----

### Phase 2 — Backend + Community (Month 3–6)

**Month 3:**

- [ ] Set up Supabase (database + auth)
- [ ] Migrate to Next.js (SSR for SEO)
- [ ] NREL API integration (replace hardcoded state data)
- [ ] Interactive pin-drop map (Leaflet.js)

**Month 4:**

- [ ] Contractor submission form + admin dashboard
- [ ] Contractor profile pages
- [ ] Basic contractor search and filter
- [ ] PDF export (client-side jsPDF)

**Month 5:**

- [ ] PM-KUSUM quota tracker (scraper + display)
- [ ] Q&A forum (basic)
- [ ] Email alert system (quota + scheme updates)
- [ ] 6 additional states added (Tamil Nadu, AP, Telangana, Haryana, Punjab, Odisha)

**Month 6:**

- [ ] Installation-verified review system (COD document upload)
- [ ] Quote standardisation tool (beta)
- [ ] Multi-language complete (HI + GU)
- [ ] SEO content launch (10 state guides, scheme guides)

-----

### Phase 3 — Scale + Monetisation (Month 7–12)

**Month 7–8:**

- [ ] Performance database (SCADA API integrations)
- [ ] Embedded financing (NBFC partner integration)
- [ ] Rooftop solar module
- [ ] Mobile app (React Native) — iOS + Android

**Month 9–10:**

- [ ] Independent verification service (engineer network)
- [ ] Open access calculator
- [ ] Battery storage modelling
- [ ] Consultant dashboard (B2B)

**Month 11–12:**

- [ ] Full India coverage (all states)
- [ ] Data licensing API (pilot with 1 NBFC or insurer)
- [ ] Tariff history + trend data
- [ ] Training and certification programme (beta)

-----

## 20. Success Metrics (KPIs)

### Product Metrics

|Metric                    |Month 3|Month 6|Month 12|
|--------------------------|-------|-------|--------|
|Monthly report generations|500    |5,000  |25,000  |
|Unique monthly visitors   |2,000  |15,000 |80,000  |
|States covered            |6      |12     |28+     |
|Districts covered         |60     |150    |500+    |
|Average session duration  |4 min  |6 min  |8 min   |
|PDF downloads/report      |20%    |35%    |45%     |
|Return visitor rate       |15%    |25%    |35%     |

### Business Metrics

|Metric                    |Month 6|Month 12|Month 18|
|--------------------------|-------|--------|--------|
|Paying contractor listings|20     |200     |800     |
|Monthly revenue           |Rs.0   |Rs.6L   |Rs.25L  |
|Contractor leads sent     |50     |500     |3,000   |
|Verified reviews          |10     |200     |1,000   |
|Forum Q&As answered       |50     |500     |3,000   |

### Data Quality Metrics

|Metric                         |Target                   |
|-------------------------------|-------------------------|
|State tariff data accuracy     |±5% of actual GERC order |
|Contractor empanelment accuracy|100% (verified quarterly)|
|PM-KUSUM quota freshness       |Updated within 7 days    |
|Performance database plants    |50 plants by Month 12    |

### Community Health Metrics

|Metric                           |Month 12 Target      |
|---------------------------------|---------------------|
|Forum posts / month              |200+                 |
|Verified answers / month         |100+                 |
|Contractor response rate to leads|> 80% within 24 hours|
|Average contractor review score  |> 4.0/5.0            |

-----

## 21. Appendix — Data Sources

### Solar Resource

- NREL NSRDB: https://nsrdb.nrel.gov/data-viewer (free, API available)
- NASA POWER: https://power.larc.nasa.gov (backup, free)
- NREL PVWatts: https://pvwatts.nrel.gov (free, India coverage)
- IMD India: https://mausam.imd.gov.in (ground station validation)

### Government Scheme Portals

- MNRE PM-KUSUM: https://pmkusum.mnre.gov.in
- GEDA Gujarat: https://geda.gujarat.gov.in
- RREC Rajasthan: https://rrec.rajasthan.gov.in
- MEDA Maharashtra: https://mahaurja.com
- MPUVNL MP: https://mpuvnl.nic.in
- KREDL Karnataka: https://kredlinfo.kar.nic.in
- UPNEDA UP: https://upneda.org.in
- TEDA Tamil Nadu: https://teda.in
- NREDCAP AP: https://nredcap.in

### Tariff Regulation

- GERC Gujarat: https://gerc.in
- MERC Maharashtra: https://mercindia.org.in
- KERC Karnataka: https://karunadu.karnataka.gov.in/kerc
- RERC Rajasthan: https://rerc.rajasthan.gov.in
- UPERC Uttar Pradesh: https://uperc.org

### Technology & Industry Data

- MNRE ALMM List: https://mnre.gov.in (Official Approved List)
- NSEFI: https://nsefi.in (industry data)
- MERCOM India: https://mercomindia.com (market reports)
- Bridge to India: https://bridgetoindia.com (benchmark reports)

### Financial Data

- SBI Solar Loan: https://sbi.co.in (Kisan Solar Energy Loan)
- NABARD Solar: https://nabard.org
- IREDA: https://www.ireda.in
- RBI base rates: https://rbi.org.in

### Supplier Verification

- ALMM List: https://mnre.gov.in/solar/domestic-content-requirement
- GEDA Empaneled EPC List: https://geda.gujarat.gov.in/empaneled-vendors
- MNRE Empaneled List: https://mnre.gov.in

-----

*SolarBharat Product Plan v1.0 | May 2026*

*This document is confidential and intended for internal use and investor/partner discussions.*

*Not for public distribution.*

-----

**Document prepared by:** Rudra (Founder)

**Next review date:** June 2026

**Status:** Active development — Phase 1 MVP in progress*

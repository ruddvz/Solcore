# SolarBharat — Manual tasks checklist

For **what the codebase already delivers** vs the product plan, see [`IMPLEMENTATION_STATUS.md`](./IMPLEMENTATION_STATUS.md).

Use this list for anything that **cannot** be automated in code or that requires **your** credentials, legal judgment, or ongoing operational discipline. Tick items as you complete them.

---

## One-time setup (you)

1. **Domain**
   - [ ] Register `solarbharat.in` (or chosen domain) at your registrar.
   - [ ] Point DNS **A/AAAA** or **CNAME** to Vercel (or your host) per their dashboard instructions.

2. **Hosting (recommended: Vercel)**
   - [ ] Import the GitHub repo and set **Root Directory** to `solarbharat`.
   - [ ] Set **Production Branch** (e.g. `main` after merge).
   - [ ] Enable automatic deployments on push.

3. **Environment variables (production)**
   - [ ] Copy `solarbharat/.env.example` → Vercel **Environment Variables**.
   - [ ] Add **PostHog** (optional): `NEXT_PUBLIC_POSTHOG_KEY`, optionally `NEXT_PUBLIC_POSTHOG_HOST`.
   - [ ] Set **`NEXT_PUBLIC_SITE_URL`** to your canonical URL (e.g. `https://solarbharat.in`) so `sitemap.xml` and metadata URLs are correct.

4. **Analytics**
   - [ ] Create PostHog project (if using) and paste keys into Vercel.

5. **Search Console**
   - [ ] Verify domain in Google Search Console.
   - [ ] Submit `https://<your-domain>/sitemap.xml`.

---

## Data accuracy & compliance (ongoing — you or hired roles)

6. **Tariff & subsidy numbers**
   - [ ] Replace **fallback** policy rows: states flagged `isFallbackPolicy` in `statePolicies.generated.ts` need **real** tariff bands and subsidy % from current **GERC/MERC/SERC** orders and **MNRE/nodal** circulars (not guesswork).
   - [ ] Establish a **quarterly** calendar reminder to refresh `scripts/generate-state-policies.mjs` inputs or a future DB.

7. **District list refresh**
   - [ ] When India reorganises districts, re-run `npm run generate:data` and verify Photon/OSM coordinates for changed names (script is deterministic but upstream data changes).

8. **Legal**
   - [ ] Have a lawyer review **disclaimers** (“estimates only”, no investment advice) for India-facing financial tools.
   - [ ] Add published **Terms**, **Privacy**, and **Contact** pages when you go live (not optional for consumer trust).

9. **Empanelment & suppliers**
   - [ ] **ALMM**: Before quoting panel brands to users, cross-check [MNRE ALMM list](https://mnre.gov.in).
   - [ ] **EPC lists**: Curate state-wise verified contractors (GEDA/MNRE empanelment) — the app shows placeholders where no curated list exists.

---

## Product plan — Phase 1 launch checklist (remaining human steps)

10. **Marketing & SEO content**
    - [ ] Write first **PM-KUSUM state guides** (plan §13) — even one strong Gujarat guide drives SEO.
    - [ ] Optional: create social assets / WhatsApp infographics pointing to the calculator.

11. **Support**
    - [ ] Decide support email or form for “report looks wrong” feedback.

---

## Phase 2+ (explicitly not automated in repo yet)

12. **Backend**
    - [ ] Provision **Supabase** (or equivalent): Postgres, Auth, Storage per plan §10.2.

13. **Scrapers & jobs**
    - [ ] Government portal scrapers need **monitoring** when sites change layout (plan §8.2).

14. **NREL / pin-drop**
    - [ ] Obtain NREL API key if required for NSRDB beyond NASA POWER; implement pin-map flow.

15. **Community**
    - [ ] Forum moderation policy and moderator hiring per plan §6.9.

---

## Technical maintenance (you or dev)

16. **Dependencies**
    - [ ] Run `npm audit` periodically; upgrade **Next.js** when security advisories apply (Node 20+ recommended for latest tooling).

17. **Secrets**
    - [ ] Never commit `.env.local`; rotate keys if leaked.

18. **Phase 2+ engineering** (not “click here” tasks — require dev time)
    - [ ] Follow [`SOLAR_BHARAT_PRODUCT_PLAN.md`](./SOLAR_BHARAT_PRODUCT_PLAN.md) §6–§7 in priority order (Supabase, NREL, forum, scrapers, mobile app, etc.).

---

*Last updated with the codebase — align this file when phases advance.*

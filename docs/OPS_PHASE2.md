# SolarBharat — Phase 2 operations (Plan0 §6)

Cron and admin routes require **server-side secrets**. Never commit `.env.local`.

## Environment variables

| Variable | Purpose |
|----------|---------|
| `CRON_SECRET` | Bearer token for `POST /api/cron/*` |
| `MODERATION_SECRET` | Bearer token for `/api/admin/forum` and `/preview/moderation` UI |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role — bypasses RLS for cron + moderation |
| `RESEND_API_KEY` | Resend API key for confirmation emails |
| `RESEND_FROM_EMAIL` | Verified sender, e.g. `SolarBharat <onboarding@resend.dev>` |
| `QUOTA_INGEST_SEED` | Set to `1` to insert a demo quota row when cron body is empty |

Also keep `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `NEXT_PUBLIC_SITE_URL`.

## SQL migration

Apply `supabase/migrations/20260509130000_phase2_ops_moderation_confirm.sql` in Supabase (adds `forum_topics.hidden`, alert confirmation columns).

## Cron examples (curl)

```bash
# Quota ingest — send snapshots JSON
curl -X POST "$SITE/api/cron/quota-ingest" \
  -H "Authorization: Bearer $CRON_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"snapshots":[{"state_id":"gujarat","status_band":"limited","source":"manual","source_detail":"scraper v0"}]}'

# Email confirmations (Resend)
curl -X POST "$SITE/api/cron/send-alert-confirmations" \
  -H "Authorization: Bearer $CRON_SECRET"
```

Vercel: `vercel.json` registers schedules when the project uses Vercel Cron (plan-dependent).

## Moderation UI

Set `ENABLE_MODERATION_UI=1` on the server (see `solarbharat/.env.example`). Middleware redirects `/preview/moderation` to `/preview` when the flag is off.

Open `/preview/moderation` (noindex), paste `MODERATION_SECRET`, load topics, hide/unhide spam. API calls use `withBasePath` so GitHub Pages project URLs work when moderation is hosted on the same origin with API routes.

## Static export (GitHub Pages)

API routes, middleware, and rate limits are **not** included in `npm run export:github-pages`. See **`docs/OPS_STATIC_EXPORT.md`** for env vars and which forms still work via Supabase anon inserts.

## Full translations

Run `cd solarbharat && npm run i18n:translate` to regenerate `hi.json` / `gu.json` from `en.json` (uses a public translate endpoint; review legal copy with counsel).

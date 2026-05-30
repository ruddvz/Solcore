# SolarBharat — static export (GitHub Pages)

Use this when deploying with `npm run export:github-pages` (see `solarbharat/scripts/run-static-export.mjs`). Vercel and `next start` keep full server features; static export does not.

## What is stripped at build time

| Feature | Static export | Vercel / Node server |
|---------|---------------|----------------------|
| `src/app/api/**` routes | Removed during export | Available |
| `middleware.ts` (session refresh, moderation gate) | Not deployed | Runs on edge/Node |
| Rate limits (`src/lib/rateLimit.ts`) | N/A | Per-IP on API routes |
| Cron (`/api/cron/*`) | N/A | Requires `CRON_SECRET` |
| Alert email confirm (`/api/alerts/confirm`) | N/A | Requires hosted API |
| NREL `/api/solar` proxy | N/A | Uses `NREL_API_KEY` or NASA fallback in client |

The export script temporarily moves API routes aside, sets `STATIC_EXPORT=1`, builds, post-processes `out/`, then restores the repo.

## Environment variables (static)

Set in GitHub Actions or Pages build settings:

```bash
NEXT_PUBLIC_SITE_URL=https://<user>.github.io/<repo>
NEXT_PUBLIC_BASE_PATH=/<repo>   # project pages only; empty for user sites
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
NEXT_PUBLIC_SUPPORT_EMAIL=...
```

Optional: `NEXT_PUBLIC_POSTHOG_*`, `NEXT_PUBLIC_SHOW_PREVIEW=1` for the preview hub.

Do **not** rely on server-only secrets for static hosting (`CRON_SECRET`, `MODERATION_SECRET`, `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_*`) — they are not available in the browser bundle and API routes are not shipped.

## Forms and community features on static sites

These pages write through the **Supabase anon client** when `NEXT_PUBLIC_SUPABASE_*` is set and RLS allows insert:

- Contractor apply, forum topics/posts, alerts subscribe, review intake, financing leads (direct table insert).

If Supabase is unset, users see the configured “not configured” / `apiUnavailable` copy. Hosted API fallbacks (`/api/reviews/intake`, `/api/financing/lead`) only work on Vercel-like deploys.

**Alerts:** double opt-in confirmation links point at `/api/alerts/confirm` on the **canonical hosted** `NEXT_PUBLIC_SITE_URL`, not the static Pages origin, unless you run a separate API host.

## Moderation UI

`/preview/moderation` is blocked unless `ENABLE_MODERATION_UI=1` in server middleware. Static export has no middleware — treat moderation as **hosted-only** (enable the flag on Vercel, use `MODERATION_SECRET` with `/api/admin/forum`).

## Build command

```bash
cd solarbharat
npm ci
npm run export:github-pages
# artifact: solarbharat/out/
```

See also `docs/OPS_PHASE2.md` for cron, Resend, and moderation secrets on full server deploys.

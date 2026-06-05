# PWA deployment notes

## Production (Vercel)

- Service worker is **enabled** on `npm run build` when `STATIC_EXPORT` is not set.
- Installable PWA: HTTPS, valid manifest, icons under `public/icons/`, screenshots under `public/screenshots/`.
- Offline document fallback: `/offline` (see `next.config.mjs`).

Regenerate assets after UI changes:

```bash
npm run generate:pwa-icons
npm run generate:pwa-screenshot
npm run build
npm run verify:pwa
```

## GitHub Pages (static export)

- PWA is **disabled** during `STATIC_EXPORT=1` builds (`next.config.mjs`).
- GitHub Pages is a static preview only; use Vercel for installable PWA.

## iOS

- Safari: Share → Add to Home Screen.
- In-app install hint: `IosInstallPrompt` (dismissible, localStorage).

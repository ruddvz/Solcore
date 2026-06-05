# iOS PWA UI/UX Redesign — Completion Status

Branch: `cursor/ios-pwa-ui-ux-redesign-373e`  
Plan: `SOLCORE_IOS_PWA_UI_UX_REDESIGN_MASTER_PLAN_8788.md`

## Summary

Replaced the dark/neon dashboard visual system with a light, trustworthy, iOS-first design language across the SolarBharat app shell, tokens, primitives, and all major routes.

## Phase 1 — Design tokens & typography

- [x] `globals.css` — light warm palette, system fonts, `.sb-page`, typography utilities
- [x] `tailwind.config.ts` — `sb.*` token mapping including `cardStrong`, `inverse`
- [x] `layout.tsx` — removed Google web fonts; `themeColor` `#fff8df`
- [x] `manifest.ts` — light `background_color` / `theme_color`

## Phase 2 — App shell

- [x] `Layout.tsx` — sticky light header, floating pill bottom nav (Home / Calculate / Report / Contractors / More)
- [x] `MoreMenuSheet.tsx` — bottom sheet for secondary routes + legal/offline
- [x] `PageFrame.tsx` — optional narrow page wrapper
- [x] Desktop footer nav for terms/privacy/contact

## Phase 3 — UI primitives

- [x] `AppCard`, `MetricCard`, `InfoBanner`
- [x] Updated `Button`, `Card`, `Select`, `FormField`, `PageHeader`, `EmptyState`, `TabBar`, `BottomActionBar`
- [x] `Pill`, `KV`, `TechCard`, `StepIndicator`, `Skeleton`, `DataSourceBadge`, `FundingStack` — light theme

## Phase 4–8 — Routes & bulk migration

- [x] Bulk migration of `text-white`, `border-white/*`, dark surfaces across sections (39 files)
- [x] `HomePage` — warm hero gradient, dominant location selector, light cards
- [x] `ReportPage`, `CalculatorPage`, contractors, forum, quota, legal, locations, phase3, quotes, preview, offline, PWA prompts — light tokens
- [x] Charts/map components use `sb-muted` / token colors
- [x] `calculatorStore.setLocation` — atomic URL hydration (fixes district reset race)

## Verification

| Check | Result |
|-------|--------|
| `npm run validate` | Pass (lint, typecheck, unit tests, build, verify:pwa) |
| `npm run test:e2e` | Run in CI / agent after push |

## Notes

- PWA screenshots in `public/screenshots/` remain from prior theme; regenerate when capturing `ui-audit/` manifest screenshots.
- Visual regression snapshots (`test:e2e:visual`) are optional and not in default `test:e2e`.

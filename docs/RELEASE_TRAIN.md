# SolarBharat release train (stacked PRs → `main`)

Audit and polish work landed in a **stack of draft PRs**. Merge in order, or use the consolidated release branch.

## Recommended merge order

| PR | Branch | Focus |
|----|--------|--------|
| [#14](https://github.com/ruddvz/Solcore/pull/14) | `cursor/mobile-a11y-ios-polish-3e8c` | Mobile nav, a11y, i18n locations, RLS |
| [#15](https://github.com/ruddvz/Solcore/pull/15) | `cursor/phase2-forms-quotes-api-3e8c` | Quotes, forms, API rate limits |
| [#16](https://github.com/ruddvz/Solcore/pull/16) | `cursor/phase3-parallel-polish-3e8c` | Skeletons, moderation gate |
| [#17](https://github.com/ruddvz/Solcore/pull/17) | `cursor/phase4-parallel-wave-3e8c` | Base paths, detail pages, Next 14.2.35 |
| [#18](https://github.com/ruddvz/Solcore/pull/18) | `cursor/phase5-forms-ops-docs-3e8c` | Reviews/alerts forms, static export docs |
| Latest | `cursor/phase6-optional-wave-3e8c` or `cursor/release-train-3e8c` | Legal/roadmap UI, calculator a11y, CI export smoke |

## One-shot merge (consolidated branch)

After rebasing onto current `main`:

```bash
git fetch origin main
git checkout cursor/release-train-3e8c   # or phase6 branch
git rebase origin/main
# resolve conflicts, then:
cd solarbharat && npm run lint && npm run build
git push -u origin cursor/release-train-3e8c --force-with-lease
```

Open **one PR** from `cursor/release-train-3e8c` → `main` and close superseded stack PRs when satisfied.

## Post-merge checks

- Vercel preview: API routes, middleware, `ENABLE_MODERATION_UI`, cron secrets
- GitHub Pages: `deploy-github-pages` workflow; confirm `NEXT_PUBLIC_BASE_PATH` matches repo name
- `docs/OPS_STATIC_EXPORT.md` for static-only limitations

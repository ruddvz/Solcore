import type { Page } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

/** Fail CI on critical/serious axe violations; color-contrast enabled globally. */
export async function analyzeAccessibility(page: Page, path: string) {
  await page.goto(path, { waitUntil: 'networkidle' })
  await page.waitForTimeout(300)
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa'])
    .exclude('.leaflet-container')
    .analyze()
  const blocked = results.violations.filter(
    (v) => v.impact === 'critical' || v.impact === 'serious',
  )
  return blocked
}

export const PUBLIC_ROUTES: { path: string; heading?: RegExp }[] = [
  { path: '/', heading: /solar/i },
  { path: '/calculator' },
  { path: '/report', heading: /report|scenario/i },
  { path: '/plan' },
  { path: '/contractors', heading: /contractor/i },
  { path: '/forum' },
  { path: '/quota' },
  { path: '/quotes' },
  { path: '/financing/interest' },
  { path: '/alerts' },
  { path: '/locations' },
  { path: '/contact' },
  { path: '/privacy' },
  { path: '/terms' },
  { path: '/offline', heading: /offline/i },
  { path: '/phase3' },
  { path: '/reviews/submit' },
]

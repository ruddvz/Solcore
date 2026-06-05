import { test, expect } from '@playwright/test'

const VIEWPORTS = [
  { name: 'iphone-se', width: 375, height: 667 },
  { name: 'iphone-14', width: 390, height: 844 },
  { name: 'iphone-pro-max', width: 430, height: 932 },
  { name: 'ipad', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
] as const

const SNAPSHOT_PAGES = ['/', '/calculator', '/report', '/contractors', '/offline'] as const

test.describe('Visual snapshots', () => {
  for (const vp of VIEWPORTS) {
    for (const path of SNAPSHOT_PAGES) {
      test(`${path} @ ${vp.name}`, async ({ page }) => {
        await page.setViewportSize({ width: vp.width, height: vp.height })
        await page.goto(path)
        await expect(page).toHaveScreenshot(`${path.replace(/\//g, '_') || 'home'}-${vp.name}.png`, {
          fullPage: true,
          maxDiffPixelRatio: 0.02,
        })
      })
    }
  }
})

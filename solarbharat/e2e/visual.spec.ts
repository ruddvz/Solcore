import { test, expect, type Page } from '@playwright/test'

async function prepareForScreenshot(page: Page) {
  await page.evaluate(() => document.fonts.ready)
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.waitForTimeout(300)
}

const VIEWPORTS = [
  { name: 'iphone-se', width: 375, height: 667 },
  { name: 'iphone-14', width: 390, height: 844 },
  { name: 'iphone-pro-max', width: 430, height: 932 },
  { name: 'ipad', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
] as const

const SNAPSHOT_PAGES = [
  '/',
  '/calculator',
  '/report?sample=1',
  '/contractors',
  '/forum',
  '/quota',
  '/offline',
] as const

test.describe('Visual snapshots', () => {
  for (const vp of VIEWPORTS) {
    for (const path of SNAPSHOT_PAGES) {
      test(`${path} @ ${vp.name}`, async ({ page }) => {
        await page.setViewportSize({ width: vp.width, height: vp.height })
        await page.goto(path, { waitUntil: 'networkidle' })
        if (path.startsWith('/report')) {
          await expect(page.getByRole('tab', { name: /overview/i })).toBeVisible({ timeout: 15_000 })
        } else if (path === '/') {
          await expect(page.getByRole('heading', { level: 1 })).toBeVisible({ timeout: 15_000 })
        }
        await prepareForScreenshot(page)
        const slug = path.replace(/[/?=&]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '') || 'home'
        await expect(page).toHaveScreenshot(`${slug}-${vp.name}.png`, {
          fullPage: true,
          maxDiffPixelRatio: 0.03,
          animations: 'disabled',
        })
      })
    }

    test(`calculator step 2 @ ${vp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height })
      await page.goto('/calculator?stateId=gujarat&districtId=surat', { waitUntil: 'networkidle' })
      await page.getByRole('button', { name: /^Continue$/i }).first().click()
      await expect(page.getByLabel(/land/i)).toBeVisible({ timeout: 10_000 })
      await prepareForScreenshot(page)
      await expect(page).toHaveScreenshot(`calculator-step2-${vp.name}.png`, {
        fullPage: true,
        maxDiffPixelRatio: 0.03,
        animations: 'disabled',
      })
    })

    test(`report costs tab @ ${vp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height })
      await page.goto('/report?sample=1', { waitUntil: 'networkidle' })
      await expect(page.getByRole('tab', { name: /overview/i })).toBeVisible({ timeout: 15_000 })
      await page.getByRole('tab', { name: /cost/i }).click()
      await expect(page.locator('[data-report-section="costs"]')).toBeVisible({ timeout: 10_000 })
      await prepareForScreenshot(page)
      await expect(page).toHaveScreenshot(`report-costs-${vp.name}.png`, {
        fullPage: true,
        maxDiffPixelRatio: 0.03,
        animations: 'disabled',
      })
    })
  }

  test('more sheet mobile @ iphone-14', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/')
    await page.locator('nav').getByRole('button', { name: /^more$/i }).click()
    await expect(page.getByRole('dialog', { name: /^more$/i })).toBeVisible()
    await prepareForScreenshot(page)
    await expect(page).toHaveScreenshot('more-sheet-iphone-14.png', {
      fullPage: false,
      maxDiffPixelRatio: 0.03,
      animations: 'disabled',
    })
  })
})

import { test, expect } from '@playwright/test'
import { analyzeAccessibility, PUBLIC_ROUTES } from './helpers'

test.describe('SolarBharat smoke', () => {
  test('home loads with primary CTA', async ({ page }) => {
    await page.goto('/')
    await expect(
      page.getByRole('link', { name: 'Calculate my solar potential', exact: true }).first(),
    ).toBeVisible()
  })

  test('calculator rejects invalid land on step 2', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/calculator?stateId=gujarat&districtId=surat', { waitUntil: 'networkidle' })
    await expect(page.locator('#district')).toHaveValue('surat', { timeout: 15_000 })
    const continueBtn = page.getByRole('button', { name: /^Continue$/i }).filter({ visible: true })
    await continueBtn.click()
    const landInput = page.getByLabel(/land/i)
    await landInput.clear()
    await landInput.fill('0')
    await landInput.blur()
    await continueBtn.click()
    await expect(page.getByText(/land area greater than 0/i)).toBeVisible({ timeout: 10_000 })
  })

  test('report shows empty state without scenario', async ({ page }) => {
    await page.goto('/report')
    await expect(page.getByText(/no report yet/i)).toBeVisible()
  })

  test('contractors page loads', async ({ page }) => {
    await page.goto('/contractors')
    await expect(page.getByRole('heading', { name: /contractor/i })).toBeVisible()
  })

  test('offline page loads', async ({ page }) => {
    await page.goto('/offline')
    await expect(page.getByRole('heading', { name: /offline/i })).toBeVisible()
  })

  test('forum page loads gracefully', async ({ page }) => {
    await page.goto('/forum')
    await expect(page.locator('body')).toBeVisible()
  })
})

test.describe('Accessibility', () => {
  const a11yPaths = ['/', '/calculator', '/report', '/contractors', '/offline', '/quotes', '/privacy']

  for (const path of a11yPaths) {
    test(`axe ${path}`, async ({ page }) => {
      const violations = await analyzeAccessibility(page, path)
      expect(violations, JSON.stringify(violations, null, 2)).toEqual([])
    })
  }
})

test.describe('Route headings', () => {
  for (const { path } of PUBLIC_ROUTES.slice(0, 8)) {
    test(`no blank body on ${path}`, async ({ page }) => {
      await page.goto(path)
      const text = await page.locator('body').innerText()
      expect(text.trim().length).toBeGreaterThan(20)
    })
  }
})

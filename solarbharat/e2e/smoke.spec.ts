import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('SolarBharat smoke', () => {
  test('home loads with primary CTA', async ({ page }) => {
    await page.goto('/')
    await expect(
      page.getByRole('link', { name: 'Calculate my solar potential', exact: true }).first(),
    ).toBeVisible()
  })

  test('calculator rejects invalid land on step 2', async ({ page }) => {
    await page.goto('/calculator')
    await page.getByRole('button', { name: /continue/i }).first().click()
    await page.getByRole('spinbutton').fill('0')
    await page.getByRole('button', { name: /continue/i }).first().click()
    await expect(page.getByText(/land area greater than 0/i)).toBeVisible()
  })

  test('report shows empty state without scenario', async ({ page }) => {
    await page.goto('/report')
    await expect(page.getByText(/no solar scenario/i)).toBeVisible()
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
  for (const path of ['/', '/calculator', '/report', '/contractors', '/offline']) {
    test(`axe ${path}`, async ({ page }) => {
      await page.goto(path)
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa'])
        .disableRules(['color-contrast'])
        .analyze()
      expect(results.violations.filter((v) => v.impact === 'critical')).toEqual([])
    })
  }
})

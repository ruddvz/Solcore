import { test, expect } from '@playwright/test'

test.describe('Core funnel', () => {
  test('home CTA opens calculator', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: 'Calculate my solar potential', exact: true }).first().click()
    await expect(page).toHaveURL(/\/calculator/)
  })

  test('calculator valid land advances', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/calculator?stateId=gujarat&districtId=surat', { waitUntil: 'networkidle' })
    await expect(page.locator('#district')).toHaveValue('surat', { timeout: 15_000 })
    const continueBtn = page.getByRole('button', { name: /^Continue$/i }).filter({ visible: true })
    await continueBtn.click()
    await page.getByRole('spinbutton').fill('5')
    await continueBtn.click()
    await expect(page.getByRole('button', { name: /TOPCon|PERC|bifacial/i }).first()).toBeVisible({
      timeout: 10_000,
    })
  })

  test('mobile More sheet opens and closes with Escape', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/')
    const moreBtn = page.locator('nav').getByRole('button', { name: /^more$/i })
    await moreBtn.click()
    const sheet = page.getByRole('dialog', { name: /^more$/i })
    await expect(sheet).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(sheet).toHaveCount(0)
  })

  test('bottom tab navigation', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/')
    await page.getByRole('link', { name: /calculator/i }).first().click()
    await expect(page).toHaveURL(/\/calculator/)
    await page.getByRole('link', { name: /report/i }).first().click()
    await expect(page).toHaveURL(/\/report/)
  })
})

import { test, expect } from '@playwright/test'
import { PUBLIC_ROUTES } from './helpers'

test.describe('Route inventory', () => {
  for (const { path, heading } of PUBLIC_ROUTES) {
    test(`${path} loads`, async ({ page }) => {
      const res = await page.goto(path)
      expect(res?.ok() || res?.status() === 304).toBeTruthy()
      await expect(page.locator('body')).toBeVisible()
      if (heading) {
        await expect(page.getByRole('heading', { name: heading }).first()).toBeVisible({
          timeout: 15_000,
        })
      }
    })
  }

  test('manifest is served', async ({ request }) => {
    const res = await request.get('/manifest.webmanifest')
    expect(res.ok()).toBeTruthy()
    const json = await res.json()
    expect(json.name).toBeTruthy()
    expect(json.icons?.length).toBeGreaterThan(0)
  })

  test('robots.txt', async ({ request }) => {
    const res = await request.get('/robots.txt')
    expect(res.ok()).toBeTruthy()
    const text = await res.text()
    expect(text.toLowerCase()).toContain('user-agent')
  })

  test('sitemap.xml', async ({ request }) => {
    const res = await request.get('/sitemap.xml')
    expect(res.ok()).toBeTruthy()
    const text = await res.text()
    expect(text).toContain('urlset')
  })

  test('/api/solar requires stateId', async ({ request }) => {
    const res = await request.get('/api/solar')
    expect(res.status()).toBe(400)
    const body = await res.json()
    expect(body.error).toMatch(/stateId/i)
  })

  test('/api/solar returns solar for Gujarat', async ({ request }) => {
    const res = await request.get('/api/solar?stateId=gujarat&districtId=surat')
    expect(res.ok()).toBeTruthy()
    const body = await res.json()
    expect(body.ghiKwhM2Day).toBeGreaterThan(0)
    expect(['nrel_nsrdb', 'nasa_power', 'fallback']).toContain(body.source)
  })

  test('/api/solar rejects pin outside India', async ({ request }) => {
    const res = await request.get('/api/solar?stateId=gujarat&lat=51&lon=0')
    expect(res.status()).toBe(400)
  })
})

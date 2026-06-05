import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { GET } from './route'

describe('GET /api/solar', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async (url: string) => {
        if (url.includes('power.larc.nasa.gov')) {
          return new Response(
            JSON.stringify({
              properties: {
                parameter: {
                  ALLSKY_SFC_SW_DWN: {
                    JAN: 4,
                    FEB: 4.5,
                    MAR: 5,
                    APR: 5.5,
                    MAY: 5.8,
                    JUN: 4.2,
                    JUL: 3.8,
                    AUG: 3.9,
                    SEP: 4.5,
                    OCT: 5,
                    NOV: 4.8,
                    DEC: 4.2,
                    ANN: 4.7,
                  },
                },
              },
            }),
            { status: 200 },
          )
        }
        return new Response('{}', { status: 404 })
      }),
    )
    delete process.env.NREL_API_KEY
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('returns 400 without stateId', async () => {
    const res = await GET(new Request('http://localhost/api/solar'))
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toMatch(/stateId/i)
  })

  it('returns 404 for unknown state', async () => {
    const res = await GET(new Request('http://localhost/api/solar?stateId=not-a-state'))
    expect(res.status).toBe(404)
  })

  it('returns 400 for partial pin', async () => {
    const res = await GET(new Request('http://localhost/api/solar?stateId=gujarat&lat=21'))
    expect(res.status).toBe(400)
  })

  it('returns 400 for pin outside India bbox', async () => {
    const res = await GET(
      new Request('http://localhost/api/solar?stateId=gujarat&lat=40&lon=10'),
    )
    expect(res.status).toBe(400)
  })

  it('returns solar resource for valid Gujarat district', async () => {
    const res = await GET(
      new Request('http://localhost/api/solar?stateId=gujarat&districtId=surat'),
    )
    expect(res.ok).toBe(true)
    const body = await res.json()
    expect(body.ghiKwhM2Day).toBeGreaterThan(0)
    expect(body.source).toBe('nasa_power')
  })
})

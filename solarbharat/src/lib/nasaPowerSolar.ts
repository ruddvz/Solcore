import type { SolarMonthly, SolarResource } from '@/types'
import { monthlyShapeFromGhi } from '@/lib/region'

function parseNasaMonthly(p: Record<string, number>): SolarMonthly | null {
  const req = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC', 'ANN']
  for (const k of req) {
    if (typeof p[k] !== 'number') return null
  }
  return {
    jan: p.JAN,
    feb: p.FEB,
    mar: p.MAR,
    apr: p.APR,
    may: p.MAY,
    jun: p.JUN,
    jul: p.JUL,
    aug: p.AUG,
    sep: p.SEP,
    oct: p.OCT,
    nov: p.NOV,
    dec: p.DEC,
    ann: p.ANN,
  }
}

/** NASA POWER climatology — safe to call from browser (public API). */
export async function fetchNasaPowerClimatology(lat: number, lon: number): Promise<SolarResource | null> {
  const url =
    `https://power.larc.nasa.gov/api/temporal/climatology/point` +
    `?parameters=ALLSKY_SFC_SW_DWN&community=RE&longitude=${lon}&latitude=${lat}&format=JSON`

  try {
    const res = await fetch(url)
    if (!res.ok) return null
    const data = (await res.json()) as {
      properties?: { parameter?: Record<string, Record<string, number>> }
    }
    const raw = data.properties?.parameter?.ALLSKY_SFC_SW_DWN
    const monthly = raw ? parseNasaMonthly(raw) : null
    if (!monthly) return null

    const shape = monthlyShapeFromGhi(monthly)
    return {
      source: 'nasa_power',
      ghiKwhM2Day: monthly.ann,
      peakSunHours: monthly.ann,
      monthlyGenShape: shape,
      monthlyGhi: monthly,
    }
  } catch {
    return null
  }
}

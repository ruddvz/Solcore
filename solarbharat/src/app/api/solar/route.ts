import { NextResponse } from 'next/server'
import type { SolarMonthly, SolarResource } from '@/types'
import { getGeographyDistrict, getGeographyState, fallbackSolar, monthlyShapeFromGhi } from '@/lib/region'

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

function coordsForLocation(stateId: string, districtId: string | null): { lat: number; lon: number } | null {
  if (districtId) {
    const d = getGeographyDistrict(stateId, districtId)
    if (d) return { lat: d.lat, lon: d.lon }
  }
  const st = getGeographyState(stateId)
  if (!st?.districts.length) return null
  let lat = 0
  let lon = 0
  for (const x of st.districts) {
    lat += x.lat
    lon += x.lon
  }
  const n = st.districts.length
  return { lat: lat / n, lon: lon / n }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const stateId = searchParams.get('stateId')
  const districtId = searchParams.get('districtId')
  if (!stateId) {
    return NextResponse.json({ error: 'stateId required' }, { status: 400 })
  }

  const c = coordsForLocation(stateId, districtId)
  if (!c) {
    return NextResponse.json({ error: 'unknown location' }, { status: 404 })
  }

  const url =
    `https://power.larc.nasa.gov/api/temporal/climatology/point` +
    `?parameters=ALLSKY_SFC_SW_DWN&community=RE&longitude=${c.lon}&latitude=${c.lat}&format=JSON`

  try {
    const res = await fetch(url, { next: { revalidate: 86400 } })
    if (!res.ok) {
      return NextResponse.json(fallbackSolar(c.lat))
    }
    const data = (await res.json()) as {
      properties?: { parameter?: Record<string, Record<string, number>> }
    }
    const raw = data.properties?.parameter?.ALLSKY_SFC_SW_DWN
    const monthly = raw ? parseNasaMonthly(raw) : null

    if (!monthly) {
      return NextResponse.json(fallbackSolar(c.lat))
    }

    const shape = monthlyShapeFromGhi(monthly)
    const out: SolarResource = {
      source: 'nasa_power',
      ghiKwhM2Day: monthly.ann,
      peakSunHours: monthly.ann,
      monthlyGenShape: shape,
      monthlyGhi: monthly,
    }
    return NextResponse.json(out)
  } catch {
    return NextResponse.json(fallbackSolar(c.lat))
  }
}

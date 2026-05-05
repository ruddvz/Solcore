import { NextResponse } from 'next/server'
import type { SolarMonthly, SolarResource } from '@/types'
import {
  coordsForLocation,
  fallbackSolar,
  monthlyShapeFromGhi,
} from '@/lib/region'
import { fetchNrelPvwattsSolar } from '@/lib/nrelSolar'

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

async function fetchNasaSolar(lat: number, lon: number): Promise<SolarResource | null> {
  const url =
    `https://power.larc.nasa.gov/api/temporal/climatology/point` +
    `?parameters=ALLSKY_SFC_SW_DWN&community=RE&longitude=${lon}&latitude=${lat}&format=JSON`

  try {
    const res = await fetch(url, { next: { revalidate: 86400 } })
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

  const nrelKey = process.env.NREL_API_KEY
  if (nrelKey) {
    const nrel = await fetchNrelPvwattsSolar({ lat: c.lat, lon: c.lon, apiKey: nrelKey })
    if (nrel) return NextResponse.json(nrel)
  }

  const nasa = await fetchNasaSolar(c.lat, c.lon)
  if (nasa) return NextResponse.json(nasa)

  return NextResponse.json(fallbackSolar(c.lat))
}

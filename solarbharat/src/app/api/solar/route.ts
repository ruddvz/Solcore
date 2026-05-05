import { NextResponse } from 'next/server'
import { coordsForLocation, fallbackSolar } from '@/lib/region'
import { fetchNasaPowerClimatology } from '@/lib/nasaPowerSolar'
import { fetchNrelPvwattsSolar } from '@/lib/nrelSolar'

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

  const nasa = await fetchNasaPowerClimatology(c.lat, c.lon)
  if (nasa) return NextResponse.json(nasa)

  return NextResponse.json(fallbackSolar(c.lat))
}

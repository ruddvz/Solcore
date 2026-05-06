import { NextResponse } from 'next/server'
import { createSupabaseRouteClient } from '@/lib/supabase/route'

export async function POST(req: Request) {
  let body: Record<string, unknown>
  try {
    body = (await req.json()) as Record<string, unknown>
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 })
  }

  const email = typeof body.email === 'string' ? body.email.trim() : ''
  const phone = typeof body.phone === 'string' ? body.phone.trim() : ''
  const stateId = typeof body.stateId === 'string' ? body.stateId : ''
  const districtId = typeof body.districtId === 'string' ? body.districtId : ''
  const capacityKwp =
    typeof body.capacityKwp === 'number'
      ? body.capacityKwp
      : typeof body.capacityKwp === 'string'
        ? Number(body.capacityKwp)
        : null
  const notes = typeof body.notes === 'string' ? body.notes.trim() : ''

  if (!email) {
    return NextResponse.json({ error: 'email required' }, { status: 400 })
  }

  const sb = createSupabaseRouteClient()
  if (!sb) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 503 })
  }

  const { error } = await sb.from('financing_leads').insert({
    email,
    phone: phone || null,
    state_id: stateId || null,
    district_id: districtId || null,
    capacity_kwp: Number.isFinite(capacityKwp as number) ? capacityKwp : null,
    notes: notes || null,
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

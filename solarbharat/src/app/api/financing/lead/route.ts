import { NextResponse } from 'next/server'
import { guardPublicPost } from '@/lib/apiGuards'
import { createSupabaseRouteClient } from '@/lib/supabase/route'
import { clampString, isValidEmail, publicApiError } from '@/lib/validate'

export async function POST(req: Request) {
  const limited = guardPublicPost(req, 'financing-lead')
  if (limited) return limited

  let body: Record<string, unknown>
  try {
    body = (await req.json()) as Record<string, unknown>
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 })
  }

  const email = typeof body.email === 'string' ? clampString(body.email, 254) : ''
  const phone = typeof body.phone === 'string' ? clampString(body.phone, 32) : ''
  const stateId = typeof body.stateId === 'string' ? clampString(body.stateId, 64) : ''
  const districtId = typeof body.districtId === 'string' ? clampString(body.districtId, 64) : ''
  const capacityKwp =
    typeof body.capacityKwp === 'number'
      ? body.capacityKwp
      : typeof body.capacityKwp === 'string'
        ? Number(body.capacityKwp)
        : null
  const notes = typeof body.notes === 'string' ? clampString(body.notes, 2000) : ''

  if (!email || !isValidEmail(email)) {
    return NextResponse.json({ error: 'valid email required' }, { status: 400 })
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

  if (error) return NextResponse.json({ error: publicApiError() }, { status: 500 })
  return NextResponse.json({ ok: true })
}

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
  const contractorReference =
    typeof body.contractorReference === 'string' ? body.contractorReference.trim() : ''
  const rating =
    typeof body.ratingOverall === 'number'
      ? body.ratingOverall
      : typeof body.ratingOverall === 'string'
        ? Number(body.ratingOverall)
        : NaN
  const textBody = typeof body.body === 'string' ? body.body.trim() : ''
  const codHint = typeof body.codHint === 'string' ? body.codHint.trim() : ''

  if (!email || !textBody || rating < 1 || rating > 5) {
    return NextResponse.json({ error: 'email, body, rating 1-5 required' }, { status: 400 })
  }

  const sb = createSupabaseRouteClient()
  if (!sb) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 503 })
  }

  const { error } = await sb.from('review_intake').insert({
    email,
    contractor_reference: contractorReference || null,
    rating_overall: rating,
    body: textBody,
    cod_hint: codHint || null,
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

import { NextResponse } from 'next/server'
import { guardPublicPost } from '@/lib/apiGuards'
import { createSupabaseRouteClient } from '@/lib/supabase/route'
import { clampString, isValidEmail, publicApiError } from '@/lib/validate'

export async function POST(req: Request) {
  const limited = guardPublicPost(req, 'reviews-intake')
  if (limited) return limited

  let body: Record<string, unknown>
  try {
    body = (await req.json()) as Record<string, unknown>
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 })
  }

  const email = typeof body.email === 'string' ? clampString(body.email, 254) : ''
  const contractorReference =
    typeof body.contractorReference === 'string' ? clampString(body.contractorReference, 200) : ''
  const rating =
    typeof body.ratingOverall === 'number'
      ? body.ratingOverall
      : typeof body.ratingOverall === 'string'
        ? Number(body.ratingOverall)
        : NaN
  const textBody = typeof body.body === 'string' ? clampString(body.body, 5000) : ''
  const codHint = typeof body.codHint === 'string' ? clampString(body.codHint, 500) : ''

  if (!email || !isValidEmail(email) || !textBody || rating < 1 || rating > 5) {
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

  if (error) return NextResponse.json({ error: publicApiError() }, { status: 500 })
  return NextResponse.json({ ok: true })
}

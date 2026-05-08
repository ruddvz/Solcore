import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServiceClient } from '@/lib/supabase/serviceAdmin'

/** GET /api/alerts/confirm?token=... — marks subscription confirmed and redirects to /alerts */
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token')
  if (!token) {
    return NextResponse.redirect(new URL('/alerts?confirm=invalid', req.nextUrl.origin))
  }

  const supabase = createSupabaseServiceClient()
  if (!supabase) {
    return NextResponse.redirect(new URL('/alerts?confirm=error', req.nextUrl.origin))
  }

  const { data, error } = await supabase
    .from('email_alert_subscriptions')
    .update({ confirmed: true })
    .eq('confirm_token', token)
    .select('id')
    .maybeSingle()

  if (error || !data) {
    return NextResponse.redirect(new URL('/alerts?confirm=invalid', req.nextUrl.origin))
  }

  return NextResponse.redirect(new URL('/alerts?confirm=ok', req.nextUrl.origin))
}

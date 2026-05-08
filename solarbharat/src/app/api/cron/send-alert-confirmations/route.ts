import { NextRequest, NextResponse } from 'next/server'
import { assertCronSecret } from '@/lib/cronAuth'
import { createSupabaseServiceClient } from '@/lib/supabase/serviceAdmin'
import { Resend } from 'resend'
import { randomBytes } from 'crypto'

/**
 * POST /api/cron/send-alert-confirmations
 * Sends double opt-in email for unconfirmed alert subscriptions (Resend).
 */
export async function POST(req: NextRequest) {
  if (!assertCronSecret(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.RESEND_FROM_EMAIL
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '')

  if (!apiKey || !from) {
    return NextResponse.json(
      { error: 'RESEND_API_KEY and RESEND_FROM_EMAIL must be set' },
      { status: 503 },
    )
  }

  const supabase = createSupabaseServiceClient()
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase service role not configured' }, { status: 503 })
  }

  const resend = new Resend(apiKey)

  const { data: rows, error } = await supabase
    .from('email_alert_subscriptions')
    .select('id, email, alert_type, state_id, district_id, confirmed, confirm_token, confirm_sent_at')
    .eq('confirmed', false)
    .is('confirm_sent_at', null)
    .limit(25)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  let sent = 0
  for (const row of rows ?? []) {
    let token = row.confirm_token as string | null
    if (!token) {
      token = randomBytes(24).toString('hex')
      const { error: uerr } = await supabase
        .from('email_alert_subscriptions')
        .update({ confirm_token: token })
        .eq('id', row.id)
      if (uerr) continue
    }

    const link = `${siteUrl}/api/alerts/confirm?token=${encodeURIComponent(token!)}`
    const { error: sendErr } = await resend.emails.send({
      from,
      to: row.email as string,
      subject: 'Confirm your SolarBharat alerts',
      html: `<p>Confirm your subscription to SolarBharat email alerts.</p><p><a href="${link}">Confirm email</a></p><p>If you did not sign up, ignore this message.</p>`,
    })

    if (sendErr) continue

    await supabase
      .from('email_alert_subscriptions')
      .update({ confirm_sent_at: new Date().toISOString() })
      .eq('id', row.id)
    sent++
  }

  return NextResponse.json({ ok: true, queued: rows?.length ?? 0, sent })
}

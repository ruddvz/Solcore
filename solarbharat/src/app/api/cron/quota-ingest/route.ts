import { NextRequest, NextResponse } from 'next/server'
import { assertCronSecret } from '@/lib/cronAuth'
import { createSupabaseServiceClient } from '@/lib/supabase/serviceAdmin'

type Snapshot = {
  state_id: string
  district_id?: string | null
  status_band: 'available' | 'limited' | 'nearly_full' | 'closed' | 'unknown'
  mw_remaining?: number | null
  source: 'official_portal' | 'crowdsourced' | 'manual'
  source_detail?: string | null
}

/**
 * POST /api/cron/quota-ingest
 * Authorization: Bearer CRON_SECRET
 * Body: { snapshots: Snapshot[] } — inserts quota_snapshots (one per state/district/day).
 * If body empty and QUOTA_INGEST_SEED=1, inserts a single manual unknown snapshot for GUJARAT (demo).
 */
export async function POST(req: NextRequest) {
  if (!assertCronSecret(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createSupabaseServiceClient()
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase service role not configured' }, { status: 503 })
  }

  let snapshots: Snapshot[] = []
  try {
    const body = (await req.json()) as { snapshots?: Snapshot[] }
    snapshots = body.snapshots ?? []
  } catch {
    snapshots = []
  }

  if (snapshots.length === 0 && process.env.QUOTA_INGEST_SEED === '1') {
    snapshots = [
      {
        state_id: 'gujarat',
        district_id: null,
        status_band: 'unknown',
        mw_remaining: null,
        source: 'manual',
        source_detail: 'Seeded by QUOTA_INGEST_SEED — replace with scraper output',
      },
    ]
  }

  if (snapshots.length === 0) {
    return NextResponse.json({ ok: true, inserted: 0, message: 'No snapshots in body' })
  }

  const rows = snapshots.map((s) => ({
    state_id: s.state_id,
    district_id: s.district_id ?? null,
    status_band: s.status_band,
    mw_remaining: s.mw_remaining ?? null,
    source: s.source,
    source_detail: s.source_detail ?? null,
  }))

  const { error, data } = await supabase.from('quota_snapshots').insert(rows).select('id')
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ ok: true, inserted: data?.length ?? rows.length })
}

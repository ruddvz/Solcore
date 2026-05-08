import { NextRequest, NextResponse } from 'next/server'
import { assertModerationSecret } from '@/lib/cronAuth'
import { createSupabaseServiceClient } from '@/lib/supabase/serviceAdmin'

/** GET — list topics (including hidden). POST — set hidden flag. */
export async function GET(req: NextRequest) {
  if (!assertModerationSecret(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const supabase = createSupabaseServiceClient()
  if (!supabase) {
    return NextResponse.json({ error: 'Service not configured' }, { status: 503 })
  }

  const { data, error } = await supabase
    .from('forum_topics')
    .select('id, slug, title, category, hidden, created_at')
    .order('created_at', { ascending: false })
    .limit(200)

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ topics: data })
}

export async function POST(req: NextRequest) {
  if (!assertModerationSecret(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const supabase = createSupabaseServiceClient()
  if (!supabase) {
    return NextResponse.json({ error: 'Service not configured' }, { status: 503 })
  }

  let body: { slug?: string; hidden?: boolean }
  try {
    body = (await req.json()) as { slug?: string; hidden?: boolean }
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  if (!body.slug || typeof body.hidden !== 'boolean') {
    return NextResponse.json({ error: 'slug and hidden required' }, { status: 400 })
  }

  const { error } = await supabase.from('forum_topics').update({ hidden: body.hidden }).eq('slug', body.slug)

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ ok: true })
}

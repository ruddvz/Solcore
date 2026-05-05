import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import type { ForumTopicRow, ForumPostRow, QuotaSnapshotRow } from '@/lib/community/types'
import {
  SEED_FORUM_TOPICS,
  SEED_FORUM_POSTS,
  SEED_QUOTA_ROWS,
} from '@/lib/community/seedCurated'

function topicFromRow(row: Record<string, unknown>): ForumTopicRow | null {
  const slug = row.slug
  const title = row.title
  const bodyMd = row.body_md
  if (typeof slug !== 'string' || typeof title !== 'string' || typeof bodyMd !== 'string')
    return null
  return {
    id: String(row.id ?? slug),
    slug,
    title,
    category: typeof row.category === 'string' ? row.category : 'general',
    stateId: typeof row.state_id === 'string' ? row.state_id : null,
    schemeTag: typeof row.scheme_tag === 'string' ? row.scheme_tag : null,
    bodyMd,
    createdAt:
      typeof row.created_at === 'string'
        ? row.created_at
        : new Date().toISOString(),
  }
}

function postFromRow(row: Record<string, unknown>): ForumPostRow | null {
  const topicId = row.topic_id
  const bodyMd = row.body_md
  if (typeof topicId !== 'string' || typeof bodyMd !== 'string') return null
  return {
    id: String(row.id),
    topicId,
    bodyMd,
    isVerifiedAnswer: row.is_verified_answer === true,
    createdAt:
      typeof row.created_at === 'string'
        ? row.created_at
        : new Date().toISOString(),
  }
}

export async function fetchForumTopics(): Promise<ForumTopicRow[]> {
  const supabase = createSupabaseBrowserClient()
  if (supabase) {
    const { data, error } = await supabase
      .from('forum_topics')
      .select('id, slug, title, category, state_id, scheme_tag, body_md, created_at')
      .order('created_at', { ascending: false })

    if (!error && data?.length) {
      const out: ForumTopicRow[] = []
      for (const row of data as Record<string, unknown>[]) {
        const t = topicFromRow(row)
        if (t) out.push(t)
      }
      if (out.length > 0) return out
    }
  }
  return [...SEED_FORUM_TOPICS].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )
}

export async function fetchForumTopicBySlug(slug: string): Promise<ForumTopicRow | null> {
  const trimmed = slug.trim()
  if (!trimmed) return null

  const supabase = createSupabaseBrowserClient()
  if (supabase) {
    const { data, error } = await supabase
      .from('forum_topics')
      .select('id, slug, title, category, state_id, scheme_tag, body_md, created_at')
      .eq('slug', trimmed)
      .maybeSingle()

    if (!error && data) {
      const t = topicFromRow(data as Record<string, unknown>)
      if (t) return t
    }
  }

  return SEED_FORUM_TOPICS.find((x) => x.slug === trimmed) ?? null
}

export async function fetchForumPosts(topicId: string): Promise<ForumPostRow[]> {
  const supabase = createSupabaseBrowserClient()
  if (supabase) {
    const { data, error } = await supabase
      .from('forum_posts')
      .select('id, topic_id, body_md, is_verified_answer, created_at')
      .eq('topic_id', topicId)
      .order('created_at', { ascending: true })

    if (!error && data?.length) {
      const out: ForumPostRow[] = []
      for (const row of data as Record<string, unknown>[]) {
        const p = postFromRow(row)
        if (p) out.push(p)
      }
      if (out.length > 0) return out
    }
  }

  return SEED_FORUM_POSTS[topicId] ?? []
}

function quotaFromRow(row: Record<string, unknown>): QuotaSnapshotRow | null {
  const stateId = row.state_id
  const statusBand = row.status_band
  const source = row.source
  if (typeof stateId !== 'string' || typeof statusBand !== 'string' || typeof source !== 'string')
    return null
  return {
    id: String(row.id),
    capturedAt:
      typeof row.captured_at === 'string'
        ? row.captured_at
        : new Date().toISOString(),
    stateId,
    districtId: typeof row.district_id === 'string' ? row.district_id : null,
    statusBand,
    mwRemaining:
      typeof row.mw_remaining === 'number'
        ? row.mw_remaining
        : row.mw_remaining === null
          ? null
          : Number(row.mw_remaining),
    source,
    sourceDetail: typeof row.source_detail === 'string' ? row.source_detail : null,
  }
}

/** Latest snapshot per state+district from recent rows (best-effort without RPC). */
export async function fetchQuotaSnapshots(): Promise<QuotaSnapshotRow[]> {
  const supabase = createSupabaseBrowserClient()
  if (supabase) {
    const { data, error } = await supabase
      .from('quota_snapshots')
      .select(
        'id, captured_at, state_id, district_id, status_band, mw_remaining, source, source_detail',
      )
      .order('captured_at', { ascending: false })
      .limit(80)

    if (!error && data?.length) {
      const seen = new Set<string>()
      const out: QuotaSnapshotRow[] = []
      for (const row of data as Record<string, unknown>[]) {
        const q = quotaFromRow(row)
        if (!q) continue
        const key = `${q.stateId}\0${q.districtId ?? ''}`
        if (seen.has(key)) continue
        seen.add(key)
        out.push(q)
      }
      if (out.length > 0) return out
    }
  }
  return [...SEED_QUOTA_ROWS]
}

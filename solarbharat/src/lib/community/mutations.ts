import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { slugify } from '@/lib/community/slug'

export async function createForumTopic(input: {
  title: string
  bodyMd: string
  category: string
  stateId: string | null
  schemeTag: string | null
}): Promise<{ ok: true; slug: string } | { ok: false; message: string }> {
  const supabase = createSupabaseBrowserClient()
  if (!supabase) {
    return { ok: false, message: 'Supabase not configured' }
  }

  let slug = slugify(input.title)
  const { data: clash } = await supabase.from('forum_topics').select('slug').eq('slug', slug).maybeSingle()
  if (clash?.slug) {
    slug = `${slug}-${Date.now().toString(36)}`
  }

  const { error } = await supabase.from('forum_topics').insert({
    slug,
    title: input.title.trim(),
    category: input.category.trim() || 'general',
    state_id: input.stateId,
    scheme_tag: input.schemeTag,
    body_md: input.bodyMd.trim(),
  })

  if (error) return { ok: false, message: error.message }
  return { ok: true, slug }
}

export async function createForumPost(input: {
  topicId: string
  bodyMd: string
}): Promise<{ ok: true } | { ok: false; message: string }> {
  const supabase = createSupabaseBrowserClient()
  if (!supabase) {
    return { ok: false, message: 'Supabase not configured' }
  }

  const { error } = await supabase.from('forum_posts').insert({
    topic_id: input.topicId,
    body_md: input.bodyMd.trim(),
    is_verified_answer: false,
  })

  if (error) return { ok: false, message: error.message }
  return { ok: true }
}

export async function createAlertSubscription(input: {
  email: string
  alertType: 'quota_open' | 'tariff_digest' | 'report_reminder'
  stateId: string | null
  districtId: string | null
}): Promise<{ ok: true } | { ok: false; message: string }> {
  const supabase = createSupabaseBrowserClient()
  if (!supabase) {
    return { ok: false, message: 'Supabase not configured' }
  }

  const { error } = await supabase.from('email_alert_subscriptions').insert({
    email: input.email.trim().toLowerCase(),
    alert_type: input.alertType,
    state_id: input.stateId,
    district_id: input.districtId,
    confirmed: false,
  })

  if (error) return { ok: false, message: error.message }
  return { ok: true }
}

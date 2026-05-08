import type { MetadataRoute } from 'next'
import { INDIA_GEOGRAPHY } from '@/types'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { getPublicBasePath } from '@/lib/publicBasePath'

function abs(path: string): string {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://solarbharat.in').replace(/\/$/, '')
  const basePath = getPublicBasePath()
  const p = path.startsWith('/') ? path : `/${path}`
  return `${baseUrl}${basePath}${p}`
}

const now = new Date()

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [
    { url: abs('/'), lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: abs('/locations'), lastModified: now, changeFrequency: 'weekly', priority: 0.55 },
    { url: abs('/calculator'), lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: abs('/report'), lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: abs('/contractors'), lastModified: now, changeFrequency: 'weekly', priority: 0.75 },
    { url: abs('/contractors/apply'), lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: abs('/forum'), lastModified: now, changeFrequency: 'weekly', priority: 0.65 },
    { url: abs('/forum/new'), lastModified: now, changeFrequency: 'monthly', priority: 0.45 },
    { url: abs('/quota'), lastModified: now, changeFrequency: 'daily', priority: 0.65 },
    { url: abs('/alerts'), lastModified: now, changeFrequency: 'monthly', priority: 0.45 },
    { url: abs('/plan'), lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    { url: abs('/quotes'), lastModified: now, changeFrequency: 'weekly', priority: 0.55 },
    { url: abs('/reviews/submit'), lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    { url: abs('/financing/interest'), lastModified: now, changeFrequency: 'monthly', priority: 0.45 },
    { url: abs('/phase3'), lastModified: now, changeFrequency: 'monthly', priority: 0.45 },
    { url: abs('/terms'), lastModified: now, changeFrequency: 'yearly', priority: 0.35 },
    { url: abs('/privacy'), lastModified: now, changeFrequency: 'yearly', priority: 0.35 },
    { url: abs('/contact'), lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
  ]

  for (const st of INDIA_GEOGRAPHY.states) {
    entries.push({
      url: abs(`/locations/${st.id}`),
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.55,
    })
    for (const d of st.districts) {
      entries.push({
        url: abs(`/locations/${st.id}/${d.id}`),
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.45,
      })
    }
  }

  const supabase = createSupabaseServerClient()
  if (supabase) {
    try {
      const { data: topics } = await supabase.from('forum_topics').select('slug, updated_at').limit(5000)
      for (const row of topics ?? []) {
        if (!row.slug) continue
        entries.push({
          url: abs(`/forum/topic?slug=${encodeURIComponent(row.slug)}`),
          lastModified: row.updated_at ? new Date(row.updated_at) : now,
          changeFrequency: 'weekly',
          priority: 0.4,
        })
      }

      const { data: contractors } = await supabase.from('contractors').select('slug, updated_at').limit(2000)
      for (const row of contractors ?? []) {
        if (!row.slug) continue
        entries.push({
          url: abs(`/contractors/company?slug=${encodeURIComponent(row.slug)}`),
          lastModified: row.updated_at ? new Date(row.updated_at) : now,
          changeFrequency: 'monthly',
          priority: 0.42,
        })
      }
    } catch {
      /* sitemap must not fail build when Supabase is unreachable */
    }
  }

  return entries
}

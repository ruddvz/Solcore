'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import type { ForumTopicRow } from '@/lib/community/types'
import { fetchForumTopics } from '@/lib/community/publicData'
import { listGeographyStates } from '@/lib/region'
import { Card } from '@/components/ui/Card'
import { withBasePath } from '@/lib/publicBasePath'

function categoryLabel(t: (k: string) => string, slug: string) {
  const key = `forum.category.${slug}`
  const label = t(key)
  return label === key ? slug : label
}

export function ForumListPage() {
  const { t } = useTranslation()
  const [topics, setTopics] = useState<ForumTopicRow[]>([])
  const [loading, setLoading] = useState(true)
  const states = listGeographyStates()

  useEffect(() => {
    let c = false
    void (async () => {
      const rows = await fetchForumTopics()
      if (!c) {
        setTopics(rows)
        setLoading(false)
      }
    })()
    return () => {
      c = true
    }
  }, [])

  const stateName = (id: string | null) =>
    id ? states.find((s) => s.id === id)?.name ?? id : null

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-extrabold text-white">{t('forum.title')}</h1>
          <p className="mt-2 max-w-2xl text-base text-white/55">{t('forum.subtitle')}</p>
        </div>
        <Link
          href={withBasePath('/forum/new')}
          className="inline-flex min-h-[44px] items-center rounded-xl bg-sb-gold px-5 py-2.5 text-base font-extrabold text-sb-bg hover:bg-sb-goldDark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sb-gold"
        >
          {t('forum.newTopic')}
        </Link>
      </div>

      {loading ? (
        <p className="text-base text-white/50" role="status">
          {t('forum.loading')}
        </p>
      ) : (
        <div className="space-y-3">
          {topics.map((topic) => (
            <Link
              key={topic.id}
              href={`${withBasePath('/forum/topic')}?slug=${encodeURIComponent(topic.slug)}`}
            >
              <Card className="transition hover:border-sb-gold/35">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <span className="font-extrabold text-white">{topic.title}</span>
                  <span className="rounded bg-white/10 px-2 py-0.5 text-[10px] font-bold uppercase text-white/55">
                    {categoryLabel(t, topic.category)}
                  </span>
                </div>
                <p className="mt-2 line-clamp-2 text-sm text-white/50">{topic.bodyMd}</p>
                <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-white/45">
                  {stateName(topic.stateId) && <span>{stateName(topic.stateId)}</span>}
                  {topic.schemeTag && <span>· {topic.schemeTag}</span>}
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {!loading && topics.length === 0 && (
        <p className="text-base text-white/50">{t('forum.empty')}</p>
      )}

      <p className="text-xs text-white/45">{t('forum.disclaimer')}</p>
    </div>
  )
}

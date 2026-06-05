'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import type { ForumTopicRow } from '@/lib/community/types'
import { fetchForumTopics } from '@/lib/community/publicData'
import { listGeographyStates } from '@/lib/region'
import { withBasePath } from '@/lib/publicBasePath'
import { Card } from '@/components/ui/Card'
import { PageHeader } from '@/components/ui/PageHeader'
import { ButtonLink } from '@/components/ui/Button'
import { SkeletonList } from '@/components/ui/Skeleton'

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

  const categoryLabel = (category: string) => {
    const key = `forum.category.${category}`
    const label = t(key)
    return label === key ? category : label
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <PageHeader title={t('forum.title')} subtitle={t('forum.subtitle')} />
        <ButtonLink href="/forum/new">{t('forum.newTopic')}</ButtonLink>
      </div>

      {loading ? <p className="sr-only">{t('forum.loading')}</p> : null}
      {loading ? (
        <SkeletonList count={4} />
      ) : (
        <div className="space-y-3">
          {topics.map((topic) => (
            <Link
              key={topic.id}
              href={`${withBasePath('/forum/topic')}?slug=${encodeURIComponent(topic.slug)}`}
              className="block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sb-gold"
            >
              <Card className="transition hover:border-sb-gold/35">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <span className="font-extrabold text-sb-ink">{topic.title}</span>
                  <span className="rounded bg-sb-surface-muted px-2 py-0.5 text-[10px] font-bold uppercase text-sb-muted">
                    {categoryLabel(topic.category)}
                  </span>
                </div>
                <p className="mt-2 line-clamp-2 text-sm text-sb-muted">{topic.bodyMd}</p>
                <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-sb-muted">
                  {stateName(topic.stateId) && <span>{stateName(topic.stateId)}</span>}
                  {topic.schemeTag && <span>· {topic.schemeTag}</span>}
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {!loading && topics.length === 0 && (
        <p className="text-center text-base text-sb-muted">{t('forum.empty')}</p>
      )}

      <p className="text-sm text-sb-muted">{t('forum.disclaimer')}</p>
    </div>
  )
}

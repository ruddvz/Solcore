'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import type { ForumTopicRow } from '@/lib/community/types'
import { fetchForumTopics } from '@/lib/community/publicData'
import { listGeographyStates } from '@/lib/region'
import { withBasePath } from '@/lib/publicBasePath'
import { isSupabaseConfigured } from '@/lib/supabase/isConfigured'
import { AppCard } from '@/components/ui/AppCard'
import { PageHeader } from '@/components/ui/PageHeader'
import { ButtonLink } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { InfoBanner } from '@/components/ui/InfoBanner'
import { SkeletonList } from '@/components/ui/Skeleton'

export function ForumListPage() {
  const { t } = useTranslation()
  const [topics, setTopics] = useState<ForumTopicRow[]>([])
  const [loading, setLoading] = useState(true)
  const states = listGeographyStates()
  const usingDemo = !isSupabaseConfigured()

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
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <PageHeader title={t('forum.title')} subtitle={t('forum.subtitle')} />
        <ButtonLink href="/forum/new">{t('forum.newTopic')}</ButtonLink>
      </div>

      {usingDemo ? (
        <InfoBanner tone="info" title={t('forum.previewTitle')}>
          {t('forum.previewBody')}
        </InfoBanner>
      ) : null}

      {loading ? <p className="sr-only">{t('forum.loading')}</p> : null}
      {loading ? (
        <SkeletonList count={3} />
      ) : topics.length > 0 ? (
        <div className="space-y-3">
          {topics.slice(0, usingDemo ? 3 : topics.length).map((topic) => (
            <Link
              key={topic.id}
              href={`${withBasePath('/forum/topic')}?slug=${encodeURIComponent(topic.slug)}`}
              className="block rounded-[26px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sb-gold"
            >
              <AppCard variant="interactive" className="p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <span className="text-[15px] font-bold text-sb-ink">{topic.title}</span>
                  <span className="rounded-sb-pill bg-sb-surface-muted px-2.5 py-0.5 text-[10px] font-bold uppercase text-sb-muted">
                    {categoryLabel(topic.category)}
                  </span>
                </div>
                <p className="mt-2 line-clamp-2 text-sm text-sb-muted">{topic.bodyMd}</p>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] font-semibold text-sb-muted-2">
                  {stateName(topic.stateId) && <span>{stateName(topic.stateId)}</span>}
                  {topic.schemeTag && <span>· {topic.schemeTag}</span>}
                  {usingDemo ? (
                    <span className="rounded-sb-pill border border-sb-orange/30 bg-sb-orangeSoft px-2 py-0.5 text-[10px] font-bold text-sb-ink-soft">
                      {t('forum.demoLabel')}
                    </span>
                  ) : null}
                </div>
              </AppCard>
            </Link>
          ))}
        </div>
      ) : (
        <EmptyState
          title={t('forum.emptyTitle')}
          body={t('forum.emptyBody')}
          primaryAction={{ href: '/forum/new', label: t('forum.newTopic') }}
        />
      )}

      <p className="sb-caption">{t('forum.disclaimer')}</p>
    </div>
  )
}

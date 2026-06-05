'use client'

import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { ForumTopicRow } from '@/lib/community/types'
import { fetchForumTopics } from '@/lib/community/publicData'
import { listGeographyStates } from '@/lib/region'
import { withBasePath } from '@/lib/publicBasePath'
import { isSupabaseConfigured } from '@/lib/supabase/isConfigured'
import { ForumTopicCard } from '@/components/ui/ForumTopicCard'
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
            <ForumTopicCard
              key={topic.id}
              topic={topic}
              href={`${withBasePath('/forum/topic')}?slug=${encodeURIComponent(topic.slug)}`}
              categoryLabel={categoryLabel(topic.category)}
              stateLabel={stateName(topic.stateId)}
              demoLabel={t('forum.demoLabel')}
              showDemoLabel={usingDemo}
            />
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

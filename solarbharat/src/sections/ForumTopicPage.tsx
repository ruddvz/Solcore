'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import type { ForumTopicRow, ForumPostRow } from '@/lib/community/types'
import { fetchForumTopicBySlug, fetchForumPosts } from '@/lib/community/publicData'
import { createForumPost } from '@/lib/community/mutations'
import { listGeographyStates } from '@/lib/region'
import { withBasePath } from '@/lib/publicBasePath'
import { Card } from '@/components/ui/Card'
import { PageHeader } from '@/components/ui/PageHeader'
import { Button } from '@/components/ui/Button'
import { FormField, inputClass } from '@/components/ui/FormField'
import { SkeletonCard } from '@/components/ui/Skeleton'

const backLinkClass =
  'text-xs font-bold text-sb-gold hover:text-sb-goldDark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sb-gold rounded'

export function ForumTopicPage() {
  const { t, i18n } = useTranslation()
  const searchParams = useSearchParams()
  const slug = searchParams.get('slug') ?? ''
  const [loading, setLoading] = useState(true)
  const [topic, setTopic] = useState<ForumTopicRow | null>(null)
  const [posts, setPosts] = useState<ForumPostRow[]>([])
  const [reply, setReply] = useState('')
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)
  const states = listGeographyStates()

  const locale = i18n.language?.startsWith('hi')
    ? 'hi-IN'
    : i18n.language?.startsWith('gu')
      ? 'gu-IN'
      : 'en-IN'

  useEffect(() => {
    let c = false
    void (async () => {
      if (!slug.trim()) {
        setTopic(null)
        setPosts([])
        setLoading(false)
        return
      }
      setLoading(true)
      const trow = await fetchForumTopicBySlug(slug)
      if (c) return
      setTopic(trow)
      if (trow) {
        const ps = await fetchForumPosts(trow.id)
        if (!c) setPosts(ps)
      } else {
        setPosts([])
      }
      setLoading(false)
    })()
    return () => {
      c = true
    }
  }, [slug])

  async function onReply(e: React.FormEvent) {
    e.preventDefault()
    setMsg(null)
    if (!topic || !reply.trim()) return
    setBusy(true)
    const res = await createForumPost({ topicId: topic.id, bodyMd: reply })
    setBusy(false)
    if (!res.ok) {
      setMsg(res.message)
      return
    }
    setReply('')
    const ps = await fetchForumPosts(topic.id)
    setPosts(ps)
  }

  const stateName = (id: string | null) =>
    id ? states.find((s) => s.id === id)?.name ?? id : null

  const categoryLabel = (category: string) => {
    const key = `forum.category.${category}`
    const label = t(key)
    return label === key ? category : label
  }

  if (loading) {
    return (
      <div className="space-y-8">
        <p className="sr-only">{t('forum.loading')}</p>
        <SkeletonCard />
      </div>
    )
  }

  if (!topic) {
    return (
      <div className="space-y-4">
        <Link href={withBasePath('/forum')} className={backLinkClass}>
          ← {t('forum.back')}
        </Link>
        <p className="text-sb-muted">{t('forum.notFound')}</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <Link href={withBasePath('/forum')} className={backLinkClass}>
        ← {t('forum.back')}
      </Link>

      <div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded bg-sb-surface-muted px-2 py-0.5 text-[10px] font-bold uppercase text-sb-muted">
            {categoryLabel(topic.category)}
          </span>
          {stateName(topic.stateId) && (
            <span className="text-xs text-sb-muted">{stateName(topic.stateId)}</span>
          )}
        </div>
        <PageHeader title={topic.title} />
        <div className="mt-4 rounded-xl border border-sb-line bg-sb-surface/50 p-4 text-sm leading-relaxed text-sb-ink-soft">
          {topic.bodyMd}
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-sm font-extrabold uppercase text-sb-muted">{t('forum.replies')}</h2>
        {posts.map((p) => (
          <Card key={p.id}>
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm leading-relaxed text-sb-ink-soft">{p.bodyMd}</p>
              {p.isVerifiedAnswer && (
                <span className="shrink-0 rounded bg-sb-green/20 px-2 py-0.5 text-[10px] font-bold uppercase text-sb-greenMuted">
                  {t('forum.verified')}
                </span>
              )}
            </div>
            <p className="mt-2 text-[10px] text-sb-muted2">
              {new Date(p.createdAt).toLocaleString(locale, {
                dateStyle: 'medium',
                timeStyle: 'short',
              })}
            </p>
          </Card>
        ))}
      </div>

      <Card>
        <form onSubmit={(e) => void onReply(e)} className="space-y-3" noValidate>
          <FormField label={t('forum.yourReply')} required>
            {({ id, describedBy }) => (
              <textarea
                id={id}
                rows={4}
                required
                aria-describedby={describedBy}
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                className={inputClass}
              />
            )}
          </FormField>
          {msg && (
            <p className="text-sm text-sb-orange" role="alert">
              {msg}
            </p>
          )}
          <Button type="submit" disabled={busy} busy={busy} className="w-full">
            {busy ? t('forum.posting') : t('forum.reply')}
          </Button>
        </form>
      </Card>
    </div>
  )
}

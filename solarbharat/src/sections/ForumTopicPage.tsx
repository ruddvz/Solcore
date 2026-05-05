'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import type { ForumTopicRow, ForumPostRow } from '@/lib/community/types'
import { fetchForumTopicBySlug, fetchForumPosts } from '@/lib/community/publicData'
import { createForumPost } from '@/lib/community/mutations'
import { listGeographyStates } from '@/lib/region'
import { Card } from '@/components/ui/Card'

export function ForumTopicPage() {
  const { t } = useTranslation()
  const searchParams = useSearchParams()
  const slug = searchParams.get('slug') ?? ''
  const [loading, setLoading] = useState(true)
  const [topic, setTopic] = useState<ForumTopicRow | null>(null)
  const [posts, setPosts] = useState<ForumPostRow[]>([])
  const [reply, setReply] = useState('')
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)
  const states = listGeographyStates()

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

  if (loading) {
    return <div className="py-16 text-center text-sm text-white/45">{t('forum.loading')}</div>
  }

  if (!topic) {
    return (
      <div className="space-y-4">
        <Link href="/forum" className="text-xs font-bold text-sb-gold">
          ← {t('forum.back')}
        </Link>
        <p className="text-white/70">{t('forum.notFound')}</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <Link href="/forum" className="text-xs font-bold text-sb-gold hover:text-sb-goldDark">
        ← {t('forum.back')}
      </Link>

      <div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded bg-white/10 px-2 py-0.5 text-[10px] font-bold uppercase text-white/55">
            {topic.category}
          </span>
          {stateName(topic.stateId) && (
            <span className="text-xs text-white/45">{stateName(topic.stateId)}</span>
          )}
        </div>
        <h1 className="mt-3 text-2xl font-black text-white">{topic.title}</h1>
        <div className="mt-4 rounded-xl border border-white/10 bg-sb-surface/50 p-4 text-sm leading-relaxed text-white/80">
          {topic.bodyMd}
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-sm font-extrabold uppercase text-white/45">{t('forum.replies')}</h2>
        {posts.map((p) => (
          <Card key={p.id}>
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm leading-relaxed text-white/80">{p.bodyMd}</p>
              {p.isVerifiedAnswer && (
                <span className="shrink-0 rounded bg-sb-green/20 px-2 py-0.5 text-[10px] font-bold uppercase text-sb-greenMuted">
                  {t('forum.verified')}
                </span>
              )}
            </div>
            <p className="mt-2 text-[10px] text-white/35">
              {new Date(p.createdAt).toLocaleString()}
            </p>
          </Card>
        ))}
      </div>

      <Card>
        <form onSubmit={(e) => void onReply(e)} className="space-y-3">
          <label className="flex flex-col gap-1.5">
            <span className="text-[11px] font-bold uppercase text-white/45">{t('forum.yourReply')}</span>
            <textarea
              rows={4}
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              className="rounded-lg border border-white/15 bg-sb-bg px-3 py-2.5 text-sm text-white outline-none ring-sb-gold/40 focus:ring-2"
            />
          </label>
          {msg && <p className="text-sm text-sb-orange">{msg}</p>}
          <button
            type="submit"
            disabled={busy}
            className="rounded-xl bg-sb-gold px-5 py-2.5 text-sm font-extrabold text-sb-bg hover:bg-sb-goldDark disabled:opacity-50"
          >
            {busy ? t('forum.posting') : t('forum.reply')}
          </button>
        </form>
      </Card>
    </div>
  )
}

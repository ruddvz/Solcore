'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { createForumTopic } from '@/lib/community/mutations'
import { listGeographyStates } from '@/lib/region'
import { withBasePath } from '@/lib/publicBasePath'
import { Card } from '@/components/ui/Card'
import { Select } from '@/components/ui/Select'

const CATEGORIES = ['pm-kusum', 'rooftop', 'grid', 'financing', 'general'] as const

export function ForumNewTopicPage() {
  const { t } = useTranslation()
  const states = listGeographyStates()
  const [title, setTitle] = useState('')
  const [bodyMd, setBodyMd] = useState('')
  const [category, setCategory] = useState<string>('general')
  const [stateId, setStateId] = useState('')
  const [schemeTag, setSchemeTag] = useState('')
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setMsg(null)
    if (!title.trim() || !bodyMd.trim()) {
      setMsg({ ok: false, text: t('forum.required') })
      return
    }
    setBusy(true)
    const res = await createForumTopic({
      title,
      bodyMd,
      category,
      stateId: stateId || null,
      schemeTag: schemeTag.trim() || null,
    })
    setBusy(false)
    if (!res.ok) {
      setMsg({ ok: false, text: res.message })
      return
    }
    window.location.href = `${withBasePath('/forum/topic')}?slug=${encodeURIComponent(res.slug)}`
  }

  return (
    <div className="mx-auto max-w-xl space-y-8">
      <div>
        <Link href={withBasePath('/forum')} className="text-xs font-bold text-sb-gold hover:text-sb-goldDark">
          ← {t('forum.back')}
        </Link>
        <h1 className="mt-4 text-2xl font-black text-white">{t('forum.newTitle')}</h1>
      </div>

      <Card>
        <form onSubmit={(e) => void onSubmit(e)} className="space-y-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-[11px] font-bold uppercase text-white/45">{t('forum.fieldTitle')} *</span>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="rounded-lg border border-white/15 bg-sb-bg px-3 py-2.5 text-sm text-white outline-none ring-sb-gold/40 focus:ring-2"
            />
          </label>
          <Select
            id="forum-cat"
            label={t('forum.fieldCategory')}
            value={category}
            onChange={setCategory}
            options={CATEGORIES.map((c) => ({ value: c, label: c }))}
          />
          <Select
            id="forum-state"
            label={t('forum.fieldState')}
            value={stateId}
            onChange={setStateId}
            options={[{ value: '', label: t('forum.optional') }, ...states.map((s) => ({ value: s.id, label: s.name }))]}
          />
          <label className="flex flex-col gap-1.5">
            <span className="text-[11px] font-bold uppercase text-white/45">{t('forum.fieldScheme')}</span>
            <input
              value={schemeTag}
              onChange={(e) => setSchemeTag(e.target.value)}
              placeholder="pm-kusum"
              className="rounded-lg border border-white/15 bg-sb-bg px-3 py-2.5 text-sm text-white outline-none ring-sb-gold/40 focus:ring-2"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-[11px] font-bold uppercase text-white/45">{t('forum.fieldBody')} *</span>
            <textarea
              rows={6}
              value={bodyMd}
              onChange={(e) => setBodyMd(e.target.value)}
              className="rounded-lg border border-white/15 bg-sb-bg px-3 py-2.5 text-sm text-white outline-none ring-sb-gold/40 focus:ring-2"
            />
          </label>
          {msg && (
            <p className={`text-sm ${msg.ok ? 'text-sb-greenMuted' : 'text-sb-orange'}`}>{msg.text}</p>
          )}
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-xl bg-sb-gold py-3 text-sm font-extrabold text-sb-bg hover:bg-sb-goldDark disabled:opacity-50"
          >
            {busy ? t('forum.posting') : t('forum.publish')}
          </button>
        </form>
      </Card>
    </div>
  )
}

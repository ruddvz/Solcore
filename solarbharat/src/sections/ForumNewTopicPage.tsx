'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { createForumTopic } from '@/lib/community/mutations'
import { listGeographyStates } from '@/lib/region'
import { withBasePath } from '@/lib/publicBasePath'
import { AppCard } from '@/components/ui/AppCard'
import { Select } from '@/components/ui/Select'
import { PageHeader } from '@/components/ui/PageHeader'
import { Button } from '@/components/ui/Button'
import { FormField, FormStatus, inputClass } from '@/components/ui/FormField'

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

  const categoryOptions = CATEGORIES.map((c) => {
    const key = `forum.category.${c}`
    const label = t(key)
    return { value: c, label: label === key ? c : label }
  })

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
        <Link
          href={withBasePath('/forum')}
          className="text-xs font-bold text-sb-gold hover:text-sb-goldDark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sb-gold rounded"
        >
          ← {t('forum.back')}
        </Link>
        <PageHeader title={t('forum.newTitle')} />
      </div>

      <AppCard>
        <form onSubmit={(e) => void onSubmit(e)} className="space-y-4" noValidate>
          <FormField label={t('forum.fieldTitle')} required>
            {({ id, describedBy }) => (
              <input
                id={id}
                required
                aria-describedby={describedBy}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={inputClass}
              />
            )}
          </FormField>
          <Select
            id="forum-cat"
            label={t('forum.fieldCategory')}
            value={category}
            onChange={setCategory}
            options={categoryOptions}
          />
          <Select
            id="forum-state"
            label={t('forum.fieldState')}
            value={stateId}
            onChange={setStateId}
            options={[
              { value: '', label: t('forum.optional') },
              ...states.map((s) => ({ value: s.id, label: s.name })),
            ]}
          />
          <FormField label={t('forum.fieldScheme')}>
            {({ id, describedBy }) => (
              <input
                id={id}
                aria-describedby={describedBy}
                value={schemeTag}
                onChange={(e) => setSchemeTag(e.target.value)}
                placeholder="pm-kusum"
                className={inputClass}
              />
            )}
          </FormField>
          <FormField label={t('forum.fieldBody')} required>
            {({ id, describedBy }) => (
              <textarea
                id={id}
                required
                rows={6}
                aria-describedby={describedBy}
                value={bodyMd}
                onChange={(e) => setBodyMd(e.target.value)}
                className={`${inputClass} min-h-[140px]`}
              />
            )}
          </FormField>
          {msg ? <FormStatus message={msg.text} ok={msg.ok} /> : null}
          <Button type="submit" disabled={busy} busy={busy} className="w-full">
            {busy ? t('forum.posting') : t('forum.publish')}
          </Button>
        </form>
      </AppCard>
    </div>
  )
}

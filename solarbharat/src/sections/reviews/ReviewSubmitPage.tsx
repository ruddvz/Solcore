'use client'

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { withBasePath } from '@/lib/publicBasePath'
import { Card } from '@/components/ui/Card'
import { PageHeader } from '@/components/ui/PageHeader'
import { Button } from '@/components/ui/Button'
import { FormField, FormStatus, inputClass } from '@/components/ui/FormField'

export function ReviewSubmitPage() {
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [contractorReference, setContractorReference] = useState('')
  const [ratingOverall, setRatingOverall] = useState(5)
  const [body, setBody] = useState('')
  const [codHint, setCodHint] = useState('')
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setMsg(null)
    const em = email.trim()
    const text = body.trim()
    if (!em || !text || ratingOverall < 1 || ratingOverall > 5) {
      setMsg({ ok: false, text: t('reviews.required') })
      return
    }

    setBusy(true)
    const payload = {
      email: em,
      contractorReference: contractorReference.trim(),
      ratingOverall,
      body: text,
      codHint: codHint.trim(),
    }

    const supabase = createSupabaseBrowserClient()
    if (supabase) {
      const { error } = await supabase.from('review_intake').insert({
        email: em,
        contractor_reference: payload.contractorReference || null,
        rating_overall: ratingOverall,
        body: text,
        cod_hint: payload.codHint || null,
      })
      setBusy(false)
      if (error) {
        setMsg({ ok: false, text: error.message })
        return
      }
      setMsg({ ok: true, text: t('reviews.success') })
      setBody('')
      setCodHint('')
      return
    }

    try {
      const res = await fetch(withBasePath('/api/reviews/intake'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = (await res.json().catch(() => ({}))) as { error?: string }
      setBusy(false)
      if (!res.ok) {
        setMsg({ ok: false, text: data.error || t('reviews.apiUnavailable') })
        return
      }
      setMsg({ ok: true, text: t('reviews.success') })
      setBody('')
      setCodHint('')
    } catch {
      setBusy(false)
      setMsg({ ok: false, text: t('reviews.apiUnavailable') })
    }
  }

  return (
    <div className="mx-auto max-w-xl space-y-8">
      <PageHeader title={t('reviews.title')} subtitle={t('reviews.subtitle')} />

      <Card>
        <form onSubmit={(e) => void onSubmit(e)} className="space-y-4" noValidate>
          <FormField label={t('reviews.email')} required>
            {({ id, describedBy }) => (
              <input
                id={id}
                type="email"
                required
                aria-describedby={describedBy}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
              />
            )}
          </FormField>
          <FormField
            label={t('reviews.contractorRef')}
            hint={t('reviews.contractorPlaceholder')}
          >
            {({ id, describedBy }) => (
              <input
                id={id}
                aria-describedby={describedBy}
                value={contractorReference}
                onChange={(e) => setContractorReference(e.target.value)}
                className={inputClass}
              />
            )}
          </FormField>
          <FormField label={t('reviews.rating')} required>
            {({ id, describedBy }) => (
              <select
                id={id}
                required
                aria-describedby={describedBy}
                value={ratingOverall}
                onChange={(e) => setRatingOverall(Number(e.target.value))}
                className={inputClass}
              >
                {[5, 4, 3, 2, 1].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            )}
          </FormField>
          <FormField label={t('reviews.body')} required>
            {({ id, describedBy }) => (
              <textarea
                id={id}
                required
                rows={5}
                aria-describedby={describedBy}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className={inputClass}
              />
            )}
          </FormField>
          <FormField label={t('reviews.codHint')} hint={t('reviews.codPlaceholder')}>
            {({ id, describedBy }) => (
              <input
                id={id}
                aria-describedby={describedBy}
                value={codHint}
                onChange={(e) => setCodHint(e.target.value)}
                className={inputClass}
              />
            )}
          </FormField>
          <Button type="submit" disabled={busy} busy={busy} className="w-full">
            {busy ? t('reviews.sending') : t('reviews.submit')}
          </Button>
        </form>
      </Card>

      {msg ? <FormStatus message={msg.text} ok={msg.ok} /> : null}
      <p className="text-sm text-white/70">{t('reviews.disclaimer')}</p>
    </div>
  )
}

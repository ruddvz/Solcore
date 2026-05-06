'use client'

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { withBasePath } from '@/lib/publicBasePath'
import { Card } from '@/components/ui/Card'

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
      <div>
        <h1 className="text-2xl font-black text-white">{t('reviews.title')}</h1>
        <p className="mt-2 text-sm text-white/55">{t('reviews.subtitle')}</p>
      </div>

      <Card>
        <form onSubmit={(e) => void onSubmit(e)} className="space-y-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-[11px] font-bold uppercase text-white/45">{t('reviews.email')} *</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-lg border border-white/15 bg-sb-bg px-3 py-2.5 text-sm text-white outline-none ring-sb-gold/40 focus:ring-2"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-[11px] font-bold uppercase text-white/45">{t('reviews.contractorRef')}</span>
            <input
              value={contractorReference}
              onChange={(e) => setContractorReference(e.target.value)}
              placeholder={t('reviews.contractorPlaceholder')}
              className="rounded-lg border border-white/15 bg-sb-bg px-3 py-2.5 text-sm text-white outline-none ring-sb-gold/40 focus:ring-2"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-[11px] font-bold uppercase text-white/45">{t('reviews.rating')} *</span>
            <select
              value={ratingOverall}
              onChange={(e) => setRatingOverall(Number(e.target.value))}
              className="rounded-lg border border-white/15 bg-sb-bg px-3 py-2.5 text-sm text-white outline-none ring-sb-gold/40 focus:ring-2"
            >
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-[11px] font-bold uppercase text-white/45">{t('reviews.body')} *</span>
            <textarea
              required
              rows={5}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="rounded-lg border border-white/15 bg-sb-bg px-3 py-2.5 text-sm text-white outline-none ring-sb-gold/40 focus:ring-2"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-[11px] font-bold uppercase text-white/45">{t('reviews.codHint')}</span>
            <input
              value={codHint}
              onChange={(e) => setCodHint(e.target.value)}
              placeholder={t('reviews.codPlaceholder')}
              className="rounded-lg border border-white/15 bg-sb-bg px-3 py-2.5 text-sm text-white outline-none ring-sb-gold/40 focus:ring-2"
            />
          </label>
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-xl bg-gradient-to-r from-sb-gold to-sb-orange px-4 py-3 text-sm font-black text-sb-bg disabled:opacity-50"
          >
            {busy ? t('reviews.sending') : t('reviews.submit')}
          </button>
        </form>
      </Card>

      {msg && (
        <p className={`text-sm ${msg.ok ? 'text-sb-greenMuted' : 'text-sb-orange'}`}>{msg.text}</p>
      )}
      <p className="text-xs text-white/40">{t('reviews.disclaimer')}</p>
    </div>
  )
}

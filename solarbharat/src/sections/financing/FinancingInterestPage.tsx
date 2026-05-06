'use client'

import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { withBasePath } from '@/lib/publicBasePath'
import { listGeographyStates, getGeographyState } from '@/lib/region'
import { Card } from '@/components/ui/Card'
import { Select } from '@/components/ui/Select'

export function FinancingInterestPage() {
  const { t } = useTranslation()
  const states = listGeographyStates()
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [stateId, setStateId] = useState('')
  const [districtId, setDistrictId] = useState('')
  const districts = getGeographyState(stateId)?.districts ?? []
  const [capacityKwp, setCapacityKwp] = useState('')
  const [notes, setNotes] = useState('')
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null)

  useEffect(() => {
    if (!stateId) {
      setDistrictId('')
      return
    }
    const st = getGeographyState(stateId)
    setDistrictId(st?.districts[0]?.id ?? '')
  }, [stateId])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setMsg(null)
    const em = email.trim()
    if (!em) {
      setMsg({ ok: false, text: t('financingLead.emailRequired') })
      return
    }

    const cap =
      capacityKwp.trim() === '' ? null : Number(capacityKwp.replace(/,/g, ''))
    const row = {
      email: em,
      phone: phone.trim() || null,
      state_id: stateId || null,
      district_id: districtId || null,
      capacity_kwp: cap != null && Number.isFinite(cap) ? cap : null,
      notes: notes.trim() || null,
    }

    setBusy(true)
    const supabase = createSupabaseBrowserClient()
    if (supabase) {
      const { error } = await supabase.from('financing_leads').insert(row)
      setBusy(false)
      if (error) {
        setMsg({ ok: false, text: error.message })
        return
      }
      setMsg({ ok: true, text: t('financingLead.success') })
      setNotes('')
      setCapacityKwp('')
      return
    }

    try {
      const res = await fetch(withBasePath('/api/financing/lead'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: row.email,
          phone: row.phone ?? '',
          stateId: row.state_id ?? '',
          districtId: row.district_id ?? '',
          capacityKwp: row.capacity_kwp,
          notes: row.notes ?? '',
        }),
      })
      const data = (await res.json().catch(() => ({}))) as { error?: string }
      setBusy(false)
      if (!res.ok) {
        setMsg({ ok: false, text: data.error || t('financingLead.apiUnavailable') })
        return
      }
      setMsg({ ok: true, text: t('financingLead.success') })
      setNotes('')
      setCapacityKwp('')
    } catch {
      setBusy(false)
      setMsg({ ok: false, text: t('financingLead.apiUnavailable') })
    }
  }

  return (
    <div className="mx-auto max-w-xl space-y-8">
      <div>
        <h1 className="text-2xl font-black text-white">{t('financingLead.title')}</h1>
        <p className="mt-2 text-sm text-white/55">{t('financingLead.subtitle')}</p>
      </div>

      <Card>
        <form onSubmit={(e) => void onSubmit(e)} className="space-y-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-[11px] font-bold uppercase text-white/45">{t('financingLead.email')} *</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-lg border border-white/15 bg-sb-bg px-3 py-2.5 text-sm text-white outline-none ring-sb-gold/40 focus:ring-2"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-[11px] font-bold uppercase text-white/45">{t('financingLead.phone')}</span>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="rounded-lg border border-white/15 bg-sb-bg px-3 py-2.5 text-sm text-white outline-none ring-sb-gold/40 focus:ring-2"
            />
          </label>
          <Select
            id="fin-state"
            label={t('financingLead.state')}
            value={stateId}
            onChange={setStateId}
            options={[{ value: '', label: t('financingLead.optionalState') }, ...states.map((s) => ({ value: s.id, label: s.name }))]}
          />
          <Select
            id="fin-district"
            label={t('financingLead.district')}
            value={districtId}
            onChange={setDistrictId}
            options={
              districts.length
                ? districts.map((d) => ({ value: d.id, label: d.name }))
                : [{ value: '', label: '—' }]
            }
          />
          <label className="flex flex-col gap-1.5">
            <span className="text-[11px] font-bold uppercase text-white/45">{t('financingLead.capacity')}</span>
            <input
              type="text"
              inputMode="decimal"
              value={capacityKwp}
              onChange={(e) => setCapacityKwp(e.target.value)}
              placeholder="500"
              className="rounded-lg border border-white/15 bg-sb-bg px-3 py-2.5 text-sm text-white outline-none ring-sb-gold/40 focus:ring-2"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-[11px] font-bold uppercase text-white/45">{t('financingLead.notes')}</span>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="rounded-lg border border-white/15 bg-sb-bg px-3 py-2.5 text-sm text-white outline-none ring-sb-gold/40 focus:ring-2"
            />
          </label>
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-xl bg-gradient-to-r from-sb-gold to-sb-orange px-4 py-3 text-sm font-black text-sb-bg disabled:opacity-50"
          >
            {busy ? t('financingLead.sending') : t('financingLead.submit')}
          </button>
        </form>
      </Card>

      {msg && (
        <p className={`text-sm ${msg.ok ? 'text-sb-greenMuted' : 'text-sb-orange'}`}>{msg.text}</p>
      )}
      <p className="text-xs text-white/40">{t('financingLead.disclaimer')}</p>
    </div>
  )
}

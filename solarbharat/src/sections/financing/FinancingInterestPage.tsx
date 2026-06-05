'use client'

import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { withBasePath } from '@/lib/publicBasePath'
import { listGeographyStates, getGeographyState } from '@/lib/region'
import { Card } from '@/components/ui/Card'
import { Select } from '@/components/ui/Select'
import { PageHeader } from '@/components/ui/PageHeader'
import { Button } from '@/components/ui/Button'
import { FormField, FormStatus, inputClass } from '@/components/ui/FormField'

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
          email: em,
          phone: row.phone,
          stateId: row.state_id,
          districtId: row.district_id,
          capacityKwp: row.capacity_kwp,
          notes: row.notes,
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
      <PageHeader title={t('financingLead.title')} subtitle={t('financingLead.subtitle')} />

      <Card>
        <form onSubmit={(e) => void onSubmit(e)} className="space-y-4" noValidate>
          <FormField label={t('financingLead.email')} required>
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
          <FormField label={t('financingLead.phone')}>
            {({ id, describedBy }) => (
              <input
                id={id}
                aria-describedby={describedBy}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={inputClass}
              />
            )}
          </FormField>
          <Select
            id="fin-state"
            label={t('financingLead.state')}
            value={stateId}
            onChange={setStateId}
            options={[
              { value: '', label: t('financingLead.optionalState') },
              ...states.map((s) => ({ value: s.id, label: s.name })),
            ]}
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
          <FormField label={t('financingLead.capacity')} hint={t('financingLead.capacityHint')}>
            {({ id, describedBy }) => (
              <input
                id={id}
                type="text"
                inputMode="decimal"
                aria-describedby={describedBy}
                value={capacityKwp}
                onChange={(e) => setCapacityKwp(e.target.value)}
                placeholder="500"
                className={inputClass}
              />
            )}
          </FormField>
          <FormField label={t('financingLead.notes')}>
            {({ id, describedBy }) => (
              <textarea
                id={id}
                rows={3}
                aria-describedby={describedBy}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className={inputClass}
              />
            )}
          </FormField>
          <Button type="submit" disabled={busy} busy={busy} className="w-full">
            {busy ? t('financingLead.sending') : t('financingLead.submit')}
          </Button>
        </form>
      </Card>

      {msg ? <FormStatus message={msg.text} ok={msg.ok} /> : null}
      <p className="text-sm text-white/70">{t('financingLead.disclaimer')}</p>
    </div>
  )
}

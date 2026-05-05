'use client'

import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { createAlertSubscription } from '@/lib/community/mutations'
import { listGeographyStates, getGeographyState } from '@/lib/region'
import { Card } from '@/components/ui/Card'
import { Select } from '@/components/ui/Select'

export function AlertsSubscribePage() {
  const { t } = useTranslation()
  const states = listGeographyStates()
  const [email, setEmail] = useState('')
  const [alertType, setAlertType] = useState<'quota_open' | 'tariff_digest' | 'report_reminder'>(
    'quota_open',
  )
  const [stateId, setStateId] = useState('')
  const [districtId, setDistrictId] = useState('')
  const districts = getGeographyState(stateId)?.districts ?? []
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
    if (!email.trim()) {
      setMsg({ ok: false, text: t('alerts.emailRequired') })
      return
    }
    setBusy(true)
    const res = await createAlertSubscription({
      email: email.trim(),
      alertType,
      stateId: stateId || null,
      districtId: districtId || null,
    })
    setBusy(false)
    if (!res.ok) {
      setMsg({ ok: false, text: res.message })
      return
    }
    setMsg({ ok: true, text: t('alerts.success') })
    setEmail('')
  }

  return (
    <div className="mx-auto max-w-xl space-y-8">
      <div>
        <h1 className="text-2xl font-black text-white">{t('alerts.title')}</h1>
        <p className="mt-2 text-sm text-white/55">{t('alerts.subtitle')}</p>
      </div>

      <Card>
        <form onSubmit={(e) => void onSubmit(e)} className="space-y-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-[11px] font-bold uppercase text-white/45">{t('alerts.email')} *</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-lg border border-white/15 bg-sb-bg px-3 py-2.5 text-sm text-white outline-none ring-sb-gold/40 focus:ring-2"
            />
          </label>
          <Select
            id="alert-type"
            label={t('alerts.type')}
            value={alertType}
            onChange={(v) => setAlertType(v as typeof alertType)}
            options={[
              { value: 'quota_open', label: t('alerts.typeQuota') },
              { value: 'tariff_digest', label: t('alerts.typeTariff') },
              { value: 'report_reminder', label: t('alerts.typeReminder') },
            ]}
          />
          <Select
            id="alert-state"
            label={t('alerts.state')}
            value={stateId}
            onChange={setStateId}
            options={[{ value: '', label: t('alerts.optional') }, ...states.map((s) => ({ value: s.id, label: s.name }))]}
          />
          <Select
            id="alert-district"
            label={t('alerts.district')}
            value={districtId}
            onChange={setDistrictId}
            options={
              districts.length
                ? districts.map((d) => ({ value: d.id, label: d.name }))
                : [{ value: '', label: '—' }]
            }
          />
          {msg && (
            <p className={`text-sm ${msg.ok ? 'text-sb-greenMuted' : 'text-sb-orange'}`}>{msg.text}</p>
          )}
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-xl bg-sb-gold py-3 text-sm font-extrabold text-sb-bg hover:bg-sb-goldDark disabled:opacity-50"
          >
            {busy ? t('alerts.sending') : t('alerts.submit')}
          </button>
        </form>
      </Card>

      <p className="text-xs text-white/40">{t('alerts.disclaimer')}</p>
    </div>
  )
}

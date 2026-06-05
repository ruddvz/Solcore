'use client'

import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { createAlertSubscription } from '@/lib/community/mutations'
import { listGeographyStates, getGeographyState } from '@/lib/region'
import { AppCard } from '@/components/ui/AppCard'
import { Select } from '@/components/ui/Select'
import { PageHeader } from '@/components/ui/PageHeader'
import { Button } from '@/components/ui/Button'
import { FormField, FormStatus, inputClass } from '@/components/ui/FormField'

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

  useEffect(() => {
    if (typeof window === 'undefined') return
    const c = new URLSearchParams(window.location.search).get('confirm')
    if (c === 'ok') setMsg({ ok: true, text: t('alerts.confirmOk') })
    if (c === 'invalid') setMsg({ ok: false, text: t('alerts.confirmInvalid') })
    if (c === 'error') setMsg({ ok: false, text: t('alerts.confirmError') })
  }, [t])

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
      <PageHeader title={t('alerts.title')} subtitle={t('alerts.subtitle')} />

      <AppCard>
        <form onSubmit={(e) => void onSubmit(e)} className="space-y-4" noValidate>
          <FormField label={t('alerts.email')} required>
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
            options={[
              { value: '', label: t('alerts.optional') },
              ...states.map((s) => ({ value: s.id, label: s.name })),
            ]}
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
          <Button type="submit" disabled={busy} busy={busy} className="w-full">
            {busy ? t('alerts.sending') : t('alerts.submit')}
          </Button>
        </form>
      </AppCard>

      {msg ? <FormStatus message={msg.text} ok={msg.ok} /> : null}
      <p className="text-sm text-sb-muted">{t('alerts.disclaimer')}</p>
    </div>
  )
}

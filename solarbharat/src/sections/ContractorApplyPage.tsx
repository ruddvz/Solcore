'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { listGeographyStates, getGeographyState } from '@/lib/region'
import { withBasePath } from '@/lib/publicBasePath'
import { AppCard } from '@/components/ui/AppCard'
import { Select } from '@/components/ui/Select'
import { PageHeader } from '@/components/ui/PageHeader'
import { Button } from '@/components/ui/Button'
import { FormField, FormStatus, inputClass } from '@/components/ui/FormField'

export function ContractorApplyPage() {
  const { t } = useTranslation()
  const states = listGeographyStates()
  const [stateId, setStateId] = useState(states[0]?.id ?? '')
  const districts = getGeographyState(stateId)?.districts ?? []
  const [districtId, setDistrictId] = useState(districts[0]?.id ?? '')
  const [companyName, setCompanyName] = useState('')
  const [contactName, setContactName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [empanelmentRef, setEmpanelmentRef] = useState('')
  const [notes, setNotes] = useState('')
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null)

  useEffect(() => {
    const st = getGeographyState(stateId)
    setDistrictId(st?.districts[0]?.id ?? '')
  }, [stateId])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setMessage(null)
    const supabase = createSupabaseBrowserClient()
    if (!supabase) {
      setMessage({ ok: false, text: t('contractors.applyNoBackend') })
      return
    }
    if (!companyName.trim() || !email.trim()) {
      setMessage({ ok: false, text: t('contractors.applyRequired') })
      return
    }

    setBusy(true)
    const { error } = await supabase.from('contractor_applications').insert({
      company_name: companyName.trim(),
      contact_name: contactName.trim() || null,
      email: email.trim(),
      phone: phone.trim() || null,
      state_id: stateId,
      district_ids: districtId ? [districtId] : [],
      empanelment_ref: empanelmentRef.trim() || null,
      notes: notes.trim() || null,
    })
    setBusy(false)

    if (error) {
      setMessage({ ok: false, text: error.message })
      return
    }
    setMessage({ ok: true, text: t('contractors.applySuccess') })
    setCompanyName('')
    setContactName('')
    setEmail('')
    setPhone('')
    setEmpanelmentRef('')
    setNotes('')
  }

  return (
    <div className="mx-auto max-w-xl space-y-8">
      <div>
        <Link
          href={withBasePath('/contractors')}
          className="text-xs font-bold text-sb-gold hover:text-sb-goldDark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sb-gold rounded"
        >
          ← {t('contractors.backToDirectory')}
        </Link>
        <PageHeader
          title={t('contractors.applyTitle')}
          subtitle={t('contractors.applySubtitle')}
        />
      </div>

      <AppCard>
        <form onSubmit={(e) => void onSubmit(e)} className="space-y-4" noValidate>
          <FormField label={t('contractors.fieldCompany')} required>
            {({ id, describedBy }) => (
              <input
                id={id}
                required
                aria-describedby={describedBy}
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className={inputClass}
              />
            )}
          </FormField>
          <FormField label={t('contractors.fieldContact')}>
            {({ id, describedBy }) => (
              <input
                id={id}
                aria-describedby={describedBy}
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                className={inputClass}
              />
            )}
          </FormField>
          <FormField label={t('contractors.fieldEmail')} required>
            {({ id, describedBy }) => (
              <input
                id={id}
                type="email"
                required
                autoComplete="email"
                aria-describedby={describedBy}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
              />
            )}
          </FormField>
          <FormField label={t('contractors.fieldPhone')}>
            {({ id, describedBy }) => (
              <input
                id={id}
                type="tel"
                autoComplete="tel"
                aria-describedby={describedBy}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={inputClass}
              />
            )}
          </FormField>

          <div className="grid gap-4 md:grid-cols-2">
            <Select
              id="app-state"
              label={t('contractors.fieldState')}
              value={stateId}
              onChange={setStateId}
              options={states.map((s) => ({ value: s.id, label: s.name }))}
            />
            <Select
              id="app-district"
              label={t('contractors.fieldDistrict')}
              value={districtId}
              onChange={setDistrictId}
              options={districts.map((d) => ({ value: d.id, label: d.name }))}
            />
          </div>

          <FormField label={t('contractors.fieldEmpanelment')}>
            {({ id, describedBy }) => (
              <input
                id={id}
                aria-describedby={describedBy}
                value={empanelmentRef}
                onChange={(e) => setEmpanelmentRef(e.target.value)}
                className={inputClass}
              />
            )}
          </FormField>
          <FormField label={t('contractors.fieldNotes')}>
            {({ id, describedBy }) => (
              <textarea
                id={id}
                rows={3}
                aria-describedby={describedBy}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className={`${inputClass} min-h-[88px]`}
              />
            )}
          </FormField>

          {message ? <FormStatus message={message.text} ok={message.ok} /> : null}

          <Button type="submit" disabled={busy} busy={busy} className="w-full">
            {busy ? t('contractors.applySending') : t('contractors.applySubmit')}
          </Button>
        </form>
      </AppCard>
    </div>
  )
}

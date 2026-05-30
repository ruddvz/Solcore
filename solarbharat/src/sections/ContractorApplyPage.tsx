'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { listGeographyStates, getGeographyState } from '@/lib/region'
import { withBasePath } from '@/lib/publicBasePath'
import { Card } from '@/components/ui/Card'
import { Select } from '@/components/ui/Select'

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
        <Link href={withBasePath('/contractors')} className="text-xs font-bold text-sb-gold hover:text-sb-goldDark">
          ← {t('contractors.backToDirectory')}
        </Link>
        <h1 className="mt-4 text-2xl font-black text-white">{t('contractors.applyTitle')}</h1>
        <p className="mt-2 text-sm text-white/55">{t('contractors.applySubtitle')}</p>
      </div>

      <Card>
        <form onSubmit={(e) => void onSubmit(e)} className="space-y-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wide text-white/45">
              {t('contractors.fieldCompany')} *
            </span>
            <input
              required
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="rounded-lg border border-white/15 bg-sb-bg px-3 py-2.5 text-sm text-white outline-none ring-sb-gold/40 focus:ring-2"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wide text-white/45">
              {t('contractors.fieldContact')}
            </span>
            <input
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              className="rounded-lg border border-white/15 bg-sb-bg px-3 py-2.5 text-sm text-white outline-none ring-sb-gold/40 focus:ring-2"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wide text-white/45">
              {t('contractors.fieldEmail')} *
            </span>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-lg border border-white/15 bg-sb-bg px-3 py-2.5 text-sm text-white outline-none ring-sb-gold/40 focus:ring-2"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wide text-white/45">
              {t('contractors.fieldPhone')}
            </span>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="rounded-lg border border-white/15 bg-sb-bg px-3 py-2.5 text-sm text-white outline-none ring-sb-gold/40 focus:ring-2"
            />
          </label>

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

          <label className="flex flex-col gap-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wide text-white/45">
              {t('contractors.fieldEmpanelment')}
            </span>
            <input
              value={empanelmentRef}
              onChange={(e) => setEmpanelmentRef(e.target.value)}
              className="rounded-lg border border-white/15 bg-sb-bg px-3 py-2.5 text-sm text-white outline-none ring-sb-gold/40 focus:ring-2"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wide text-white/45">
              {t('contractors.fieldNotes')}
            </span>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="rounded-lg border border-white/15 bg-sb-bg px-3 py-2.5 text-sm text-white outline-none ring-sb-gold/40 focus:ring-2"
            />
          </label>

          {message && (
            <p className={`text-sm ${message.ok ? 'text-sb-greenMuted' : 'text-sb-orange'}`}>
              {message.text}
            </p>
          )}

          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-xl bg-sb-gold py-3 text-sm font-extrabold text-sb-bg hover:bg-sb-goldDark disabled:opacity-50"
          >
            {busy ? t('contractors.applySending') : t('contractors.applySubmit')}
          </button>
        </form>
      </Card>
    </div>
  )
}

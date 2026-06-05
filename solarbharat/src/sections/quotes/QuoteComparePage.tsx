'use client'

import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { compareQuotes, type QuoteInput } from '@/lib/quotes/compareQuotes'
import { useCalculatorStore } from '@/store/calculatorStore'
import { Card } from '@/components/ui/Card'
import { PageHeader } from '@/components/ui/PageHeader'
import { inputClass } from '@/components/ui/FormField'

const fieldInputClass = `${inputClass} font-mono`

function emptyQuote(label: string): QuoteInput {
  return {
    label,
    capacityKwp: 500,
    costPerWpRs: 38,
    panelBrand: '',
    panelAlmm: true,
    inverterBrand: '',
    warrantyModulesYears: 12,
    warrantyInverterYears: 5,
    codMonthsEst: 9,
    penaltyClause: true,
  }
}

export function QuoteComparePage() {
  const { t } = useTranslation()
  const getFinancials = useCalculatorStore((s) => s.getFinancials)
  const fin = getFinancials()

  const [rows, setRows] = useState<QuoteInput[]>(() => [
    emptyQuote('Quote A'),
    emptyQuote('Quote B'),
  ])

  const compared = useMemo(() => compareQuotes(rows), [rows])

  const bestCostPerWp = useMemo(() => {
    if (!compared.length) return null
    return Math.min(...compared.map((r) => r.costPerWpRs))
  }, [compared])

  function updateRow(i: number, patch: Partial<QuoteInput>) {
    setRows((prev) => prev.map((r, j) => (j === i ? { ...r, ...patch } : r)))
  }

  function addColumn() {
    setRows((r) => {
      const letter = String.fromCharCode(65 + r.length)
      return [...r, emptyQuote(t('quotes.defaultName', { letter }))]
    })
  }

  return (
    <div className="space-y-8">
      <PageHeader title={t('quotes.title')} subtitle={t('quotes.subtitle')} />

      {fin && (
        <Card accent="green">
          <div className="sb-overline text-sb-greenDark">{t('quotes.modelHint')}</div>
          <p className="mt-2 font-mono text-lg text-sb-ink">
            ₹{Math.round(fin.totalCapexRs).toLocaleString('en-IN')} ({t('quotes.fromCalculator')})
          </p>
        </Card>
      )}

      {/* Mobile: one card per quote */}
      <div className="space-y-4 md:hidden">
        <p className="text-sm text-sb-muted">{t('quotes.mobileHint')}</p>
        {compared.map((r, i) => (
          <Card key={i}>
            <label className="flex flex-col gap-1.5">
              <span className="sb-overline text-sb-muted">{t('quotes.colLabel')}</span>
              <input
                value={rows[i].label}
                onChange={(e) => updateRow(i, { label: e.target.value })}
                className={inputClass}
                aria-label={t('quotes.quoteName', { n: i + 1 })}
              />
            </label>
            <div className="mt-4 space-y-3 text-base">
              <QuoteMobileField
                label={t('quotes.capacityKwp')}
                type="number"
                value={rows[i].capacityKwp}
                onChange={(v) => updateRow(i, { capacityKwp: v })}
              />
              <QuoteMobileField
                label={t('quotes.costPerWp')}
                type="number"
                value={rows[i].costPerWpRs}
                onChange={(v) => updateRow(i, { costPerWpRs: v })}
              />
              <div className="flex justify-between gap-2 border-t border-sb-line pt-2">
                <span className="text-sb-muted">{t('quotes.totalCapex')}</span>
                <span className="font-mono font-bold text-sb-ink">
                  ₹{r.totalCapexRs.toLocaleString('en-IN')}
                  {bestCostPerWp != null && r.costPerWpRs === bestCostPerWp && (
                    <span className="ml-2 text-xs font-semibold text-sb-greenDark">{t('quotes.bestCpp')}</span>
                  )}
                </span>
              </div>
              <QuoteMobileText
                label={t('quotes.panel')}
                value={rows[i].panelBrand}
                onChange={(v) => updateRow(i, { panelBrand: v })}
              />
              <QuoteMobileBool
                label={t('quotes.almm')}
                checked={rows[i].panelAlmm}
                onChange={(v) => updateRow(i, { panelAlmm: v })}
                id={`almm-m-${i}`}
              />
              <QuoteMobileText
                label={t('quotes.inverter')}
                value={rows[i].inverterBrand}
                onChange={(v) => updateRow(i, { inverterBrand: v })}
              />
              <QuoteMobileField
                label={t('quotes.warrantyMod')}
                type="number"
                value={rows[i].warrantyModulesYears}
                onChange={(v) => updateRow(i, { warrantyModulesYears: v })}
              />
              <QuoteMobileField
                label={t('quotes.warrantyInv')}
                type="number"
                value={rows[i].warrantyInverterYears}
                onChange={(v) => updateRow(i, { warrantyInverterYears: v })}
              />
              <QuoteMobileField
                label={t('quotes.codMonths')}
                type="number"
                value={rows[i].codMonthsEst}
                onChange={(v) => updateRow(i, { codMonthsEst: v })}
              />
              <QuoteMobileBool
                label={t('quotes.penalty')}
                checked={rows[i].penaltyClause}
                onChange={(v) => updateRow(i, { penaltyClause: v })}
                id={`penalty-m-${i}`}
              />
            </div>
            {r.flags.length === 0 ? (
              <p className="mt-3 text-sm text-sb-greenDark">{t('quotes.flagsClean')}</p>
            ) : (
              <ul className="mt-3 list-inside list-disc text-sm text-sb-orange">
                {r.flags.map((f) => (
                  <li key={f}>{t(`quotes.flag.${f}`)}</li>
                ))}
              </ul>
            )}
          </Card>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden overflow-x-auto rounded-xl border border-sb-line md:block">
        <p className="sr-only">{t('quotes.tableHint')}</p>
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-sb-line text-[11px] font-bold uppercase text-sb-muted">
              <th className="px-3 py-2" scope="col">
                {t('quotes.colLabel')}
              </th>
              {compared.map((r, i) => (
                <th key={i} className="px-3 py-2 text-sb-goldDark" scope="col">
                  <label className="sr-only">{t('quotes.quoteName', { n: i + 1 })}</label>
                  <input
                    value={r.label}
                    onChange={(e) => updateRow(i, { label: e.target.value })}
                    className="min-h-[44px] w-full rounded-xl border border-sb-line bg-white px-2 py-2 font-bold text-sb-ink"
                  />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-sb-ink-soft">
            <QuoteNumRow
              label={t('quotes.capacityKwp')}
              values={compared.map((_, i) => rows[i].capacityKwp)}
              onChange={(col, v) => updateRow(col, { capacityKwp: v })}
            />
            <QuoteNumRow
              label={t('quotes.costPerWp')}
              values={compared.map((_, i) => rows[i].costPerWpRs)}
              onChange={(col, v) => updateRow(col, { costPerWpRs: v })}
            />
            <tr className="border-t border-sb-line">
              <th className="px-3 py-2 text-left font-bold text-sb-muted" scope="row">
                {t('quotes.totalCapex')}
              </th>
              {compared.map((r, i) => (
                <td key={i} className="px-3 py-2 font-mono">
                  ₹{r.totalCapexRs.toLocaleString('en-IN')}
                  {bestCostPerWp != null && r.costPerWpRs === bestCostPerWp && (
                    <span className="ml-2 text-[10px] font-bold text-sb-greenDark">
                      {t('quotes.bestCpp')}
                    </span>
                  )}
                </td>
              ))}
            </tr>
            <QuoteTextRow
              label={t('quotes.panel')}
              values={compared.map((_, i) => rows[i].panelBrand)}
              onChange={(col, v) => updateRow(col, { panelBrand: v })}
            />
            <QuoteBoolRow
              label={t('quotes.almm')}
              values={compared.map((_, i) => rows[i].panelAlmm)}
              onChange={(col, v) => updateRow(col, { panelAlmm: v })}
            />
            <QuoteTextRow
              label={t('quotes.inverter')}
              values={compared.map((_, i) => rows[i].inverterBrand)}
              onChange={(col, v) => updateRow(col, { inverterBrand: v })}
            />
            <QuoteNumRow
              label={t('quotes.warrantyMod')}
              values={compared.map((_, i) => rows[i].warrantyModulesYears)}
              onChange={(col, v) => updateRow(col, { warrantyModulesYears: v })}
            />
            <QuoteNumRow
              label={t('quotes.warrantyInv')}
              values={compared.map((_, i) => rows[i].warrantyInverterYears)}
              onChange={(col, v) => updateRow(col, { warrantyInverterYears: v })}
            />
            <QuoteNumRow
              label={t('quotes.codMonths')}
              values={compared.map((_, i) => rows[i].codMonthsEst)}
              onChange={(col, v) => updateRow(col, { codMonthsEst: v })}
            />
            <QuoteBoolRow
              label={t('quotes.penalty')}
              values={compared.map((_, i) => rows[i].penaltyClause)}
              onChange={(col, v) => updateRow(col, { penaltyClause: v })}
            />
          </tbody>
        </table>
      </div>

      <div className="hidden gap-4 md:grid md:grid-cols-2">
        {compared.map((r, i) => (
          <Card key={i}>
            <div className="font-extrabold text-sb-ink">{r.label}</div>
            {r.flags.length === 0 ? (
              <p className="mt-2 text-sm text-sb-greenDark">{t('quotes.flagsClean')}</p>
            ) : (
              <ul className="mt-2 list-inside list-disc text-sm text-sb-orange">
                {r.flags.map((f) => (
                  <li key={f}>{t(`quotes.flag.${f}`)}</li>
                ))}
              </ul>
            )}
          </Card>
        ))}
      </div>

      <button
        type="button"
        onClick={addColumn}
        className="inline-flex min-h-[44px] items-center rounded-xl border border-sb-line-strong px-4 py-2 text-base font-bold text-sb-ink-soft hover:border-sb-gold/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sb-gold"
      >
        {t('quotes.addColumn')}
      </button>

      <p className="text-sm text-sb-muted">{t('quotes.disclaimer')}</p>
    </div>
  )
}

function QuoteMobileField({
  label,
  type,
  value,
  onChange,
}: {
  label: string
  type: 'number'
  value: number
  onChange: (v: number) => void
}) {
  const id = label.replace(/\s/g, '-').toLowerCase()
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
      <label htmlFor={id} className="text-sb-muted">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={`${fieldInputClass} sm:max-w-[140px]`}
      />
    </div>
  )
}

function QuoteMobileText({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (v: string) => void
}) {
  const id = `txt-${label}`
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sb-muted">
        {label}
      </label>
      <input id={id} value={value} onChange={(e) => onChange(e.target.value)} className={inputClass} />
    </div>
  )
}

function QuoteMobileBool({
  label,
  checked,
  onChange,
  id,
}: {
  label: string
  checked: boolean
  onChange: (v: boolean) => void
  id: string
}) {
  const { t } = useTranslation()
  return (
    <div className="flex min-h-[44px] items-center gap-3">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-5 w-5 accent-sb-gold"
      />
      <label htmlFor={id} className="text-sb-ink-soft">
        {label} — {checked ? t('quotes.yes') : t('quotes.no')}
      </label>
    </div>
  )
}

function QuoteNumRow({
  label,
  values,
  onChange,
}: {
  label: string
  values: number[]
  onChange: (col: number, v: number) => void
}) {
  return (
    <tr className="border-t border-sb-line">
      <th className="px-3 py-2 text-left font-normal text-sb-muted" scope="row">
        {label}
      </th>
      {values.map((v, i) => (
        <td key={i} className="px-3 py-2">
          <label className="sr-only">
            {label} {i + 1}
          </label>
          <input
            type="number"
            value={v}
            onChange={(e) => onChange(i, Number(e.target.value))}
            className={`${fieldInputClass} min-h-[44px] w-full`}
          />
        </td>
      ))}
    </tr>
  )
}

function QuoteTextRow({
  label,
  values,
  onChange,
}: {
  label: string
  values: string[]
  onChange: (col: number, v: string) => void
}) {
  return (
    <tr className="border-t border-sb-line">
      <th className="px-3 py-2 text-left font-normal text-sb-muted" scope="row">
        {label}
      </th>
      {values.map((v, i) => (
        <td key={i} className="px-3 py-2">
          <label className="sr-only">
            {label} {i + 1}
          </label>
          <input
            value={v}
            onChange={(e) => onChange(i, e.target.value)}
            className={`${inputClass} min-h-[44px] w-full`}
          />
        </td>
      ))}
    </tr>
  )
}

function QuoteBoolRow({
  label,
  values,
  onChange,
}: {
  label: string
  values: boolean[]
  onChange: (col: number, v: boolean) => void
}) {
  const { t } = useTranslation()
  return (
    <tr className="border-t border-sb-line">
      <th className="px-3 py-2 text-left font-normal text-sb-muted" scope="row">
        {label}
      </th>
      {values.map((v, i) => (
        <td key={i} className="px-3 py-2">
          <label className="flex min-h-[44px] cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={v}
              onChange={(e) => onChange(i, e.target.checked)}
              className="h-5 w-5 accent-sb-gold"
            />
            <span className="text-sm text-sb-muted">{v ? t('quotes.yes') : t('quotes.no')}</span>
          </label>
        </td>
      ))}
    </tr>
  )
}

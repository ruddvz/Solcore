'use client'

import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { compareQuotes, type QuoteInput } from '@/lib/quotes/compareQuotes'
import { useCalculatorStore } from '@/store/calculatorStore'
import { Card } from '@/components/ui/Card'

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

  const [rows, setRows] = useState<QuoteInput[]>([
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

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-white">{t('quotes.title')}</h1>
        <p className="mt-2 max-w-2xl text-sm text-white/55">{t('quotes.subtitle')}</p>
      </div>

      {fin && (
        <Card accent="green">
          <div className="text-xs font-extrabold uppercase text-sb-greenMuted">
            {t('quotes.modelHint')}
          </div>
          <p className="mt-2 font-mono text-lg text-white">
            ₹{Math.round(fin.totalCapexRs).toLocaleString('en-IN')} ({t('quotes.fromCalculator')})
          </p>
        </Card>
      )}

      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 text-[11px] font-bold uppercase text-white/45">
              <th className="px-3 py-2">{t('quotes.colLabel')}</th>
              {compared.map((r, i) => (
                <th key={i} className="px-3 py-2 text-sb-gold">
                  <input
                    value={r.label}
                    onChange={(e) => updateRow(i, { label: e.target.value })}
                    className="w-full rounded border border-white/10 bg-sb-bg px-2 py-1 font-bold text-sb-gold"
                  />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-white/85">
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
            <tr className="border-t border-white/10">
              <td className="px-3 py-2 font-bold text-white/55">{t('quotes.totalCapex')}</td>
              {compared.map((r, i) => (
                <td key={i} className="px-3 py-2 font-mono">
                  ₹{r.totalCapexRs.toLocaleString('en-IN')}
                  {bestCostPerWp != null && r.costPerWpRs === bestCostPerWp && (
                    <span className="ml-2 text-[10px] font-bold text-sb-greenMuted">
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

      <div className="grid gap-4 md:grid-cols-2">
        {compared.map((r, i) => (
          <Card key={i}>
            <div className="font-extrabold text-white">{r.label}</div>
            {r.flags.length === 0 ? (
              <p className="mt-2 text-xs text-sb-greenMuted">{t('quotes.flagsClean')}</p>
            ) : (
              <ul className="mt-2 list-inside list-disc text-xs text-sb-orange">
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
        onClick={() => setRows((r) => [...r, emptyQuote(`Quote ${String.fromCharCode(65 + r.length)}`)])}
        className="rounded-xl border border-white/15 px-4 py-2 text-sm font-bold text-white/80 hover:border-sb-gold/40"
      >
        {t('quotes.addColumn')}
      </button>

      <p className="text-xs text-white/40">{t('quotes.disclaimer')}</p>
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
    <tr className="border-t border-white/5">
      <td className="px-3 py-2 text-white/55">{label}</td>
      {values.map((v, i) => (
        <td key={i} className="px-3 py-2">
          <input
            type="number"
            value={v}
            onChange={(e) => onChange(i, Number(e.target.value))}
            className="w-full rounded border border-white/10 bg-sb-bg px-2 py-1 font-mono text-white"
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
    <tr className="border-t border-white/5">
      <td className="px-3 py-2 text-white/55">{label}</td>
      {values.map((v, i) => (
        <td key={i} className="px-3 py-2">
          <input
            value={v}
            onChange={(e) => onChange(i, e.target.value)}
            className="w-full rounded border border-white/10 bg-sb-bg px-2 py-1 text-white"
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
  return (
    <tr className="border-t border-white/5">
      <td className="px-3 py-2 text-white/55">{label}</td>
      {values.map((v, i) => (
        <td key={i} className="px-3 py-2">
          <input
            type="checkbox"
            checked={v}
            onChange={(e) => onChange(i, e.target.checked)}
            className="accent-sb-gold"
          />
        </td>
      ))}
    </tr>
  )
}

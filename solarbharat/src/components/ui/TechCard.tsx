import type { TechnologySpec } from '@/types'
import { useTranslation } from 'react-i18next'

export function TechCard({
  tech,
  selected,
  onSelect,
}: {
  tech: TechnologySpec
  selected: boolean
  onSelect: () => void
}) {
  const { t } = useTranslation()
  const verdictKey = `tech.verdict.${tech.verdict}` as const
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`w-full min-h-[44px] rounded-xl border p-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sb-gold ${
        selected
          ? 'border-sb-gold bg-sb-gold/10 ring-2 ring-sb-gold/40'
          : 'border-sb-line bg-sb-surface hover:border-sb-line-strong'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="text-sm font-extrabold text-sb-ink">{tech.label}</div>
          <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-[11px] text-sb-muted">
            <span>
              {t('tech.eff')}: <b className="text-sb-ink-soft">{tech.efficiencyPct}%</b>
            </span>
            <span>
              {t('tech.deg')}: <b className="text-sb-ink-soft">{tech.degradationPctPerYear}%</b>
            </span>
            <span>
              {t('tech.costWp')}: <b className="text-sb-ink-soft">₹{tech.costPerWpRs}</b>
            </span>
            <span>
              {t('tech.bif')}: <b className="text-sb-ink-soft">+{tech.bifacialGainPct}%</b>
            </span>
            <span className="col-span-2">
              {t('tech.warranty')}: <b className="text-sb-ink-soft">{tech.warrantyYears} yrs</b>
            </span>
          </div>
        </div>
        <span
          className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-extrabold uppercase ${
            tech.verdict === 'best'
              ? 'bg-sb-greenMuted text-sb-greenDark'
              : tech.verdict === 'good'
                ? 'bg-sb-blue/20 text-sb-blue'
                : 'bg-sb-surface-muted text-sb-muted'
          }`}
        >
          {t(verdictKey)}
        </span>
      </div>
    </button>
  )
}

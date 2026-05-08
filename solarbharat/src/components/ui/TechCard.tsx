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
      className={`w-full rounded-xl border p-4 text-left transition ${
        selected
          ? 'border-sb-gold bg-sb-gold/10 ring-2 ring-sb-gold/40'
          : 'border-white/10 bg-sb-bg/60 hover:border-white/20'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="text-sm font-extrabold text-white">{tech.label}</div>
          <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-[11px] text-white/55">
            <span>
              {t('tech.eff')}: <b className="text-white/80">{tech.efficiencyPct}%</b>
            </span>
            <span>
              {t('tech.deg')}: <b className="text-white/80">{tech.degradationPctPerYear}%</b>
            </span>
            <span>
              {t('tech.costWp')}: <b className="text-white/80">₹{tech.costPerWpRs}</b>
            </span>
            <span>
              {t('tech.bif')}: <b className="text-white/80">+{tech.bifacialGainPct}%</b>
            </span>
            <span className="col-span-2">
              {t('tech.warranty')}: <b className="text-white/80">{tech.warrantyYears} yrs</b>
            </span>
          </div>
        </div>
        <span
          className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-extrabold uppercase ${
            tech.verdict === 'best'
              ? 'bg-sb-green/20 text-sb-greenMuted'
              : tech.verdict === 'good'
                ? 'bg-sb-blue/20 text-sb-blue'
                : 'bg-white/10 text-white/60'
          }`}
        >
          {t(verdictKey)}
        </span>
      </div>
    </button>
  )
}

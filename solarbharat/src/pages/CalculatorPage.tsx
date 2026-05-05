import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useCalculatorStore } from '../store/calculatorStore'
import { STATES, getState } from '../data/states'
import { TECHNOLOGIES } from '../data/technologies'
import { landToAcres } from '../lib/finance'
import type { LandUnit } from '../types'
import { Card } from '../components/ui/Card'
import { Select } from '../components/ui/Select'
import { TechCard } from '../components/ui/TechCard'
import { MonthBars } from '../components/charts/MonthBars'
import { KV } from '../components/ui/KV'

export function CalculatorPage() {
  const { t } = useTranslation()
  const {
    stateId,
    districtId,
    landValue,
    landUnit,
    technologyId,
    setStateId,
    setDistrictId,
    setLandUnit,
    setTechnologyId,
    setLandValue,
  } = useCalculatorStore()

  const state = getState(stateId)
  const districts = state?.districts ?? []
  const acresEquiv = landToAcres(landValue, landUnit)

  useEffect(() => {
    if (landValue <= 0) setLandValue(1)
  }, [landValue, setLandValue])

  return (
    <div className="grid gap-8 lg:grid-cols-5">
      <div className="space-y-6 lg:col-span-3">
        <div>
          <h1 className="text-2xl font-black text-white">{t('calc.title')}</h1>
          <p className="mt-1 text-sm text-white/55">
            {t('calc.equiv', { acres: acresEquiv.toFixed(2) })}
          </p>
        </div>

        <Card>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Select
                id="state"
                label={t('calc.state')}
                value={stateId}
                onChange={setStateId}
                options={STATES.map((s) => ({ value: s.id, label: s.name }))}
              />
              <Select
                id="district"
                label={t('calc.district')}
                value={districtId}
                onChange={setDistrictId}
                options={districts.map((d) => ({ value: d.id, label: d.name }))}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="flex flex-col gap-1.5" htmlFor="landValue">
                <span className="text-[11px] font-bold uppercase tracking-wide text-white/45">
                  {t('calc.land')}
                </span>
                <input
                  id="landValue"
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={landValue}
                  onChange={(e) => setLandValue(Number(e.target.value))}
                  className="rounded-lg border border-white/15 bg-sb-bg px-3 py-2.5 font-mono text-sm text-white outline-none ring-sb-gold/40 focus:ring-2"
                />
              </label>
              <Select
                id="unit"
                label={t('calc.unit')}
                value={landUnit}
                onChange={(v) => setLandUnit(v as LandUnit)}
                options={[
                  { value: 'acre', label: t('calc.unitAcre') },
                  { value: 'bigha', label: t('calc.unitBigha') },
                  { value: 'guntha', label: t('calc.unitGuntha') },
                  { value: 'hectare', label: t('calc.unitHa') },
                ]}
              />
            </div>

            <div>
              <div className="text-[11px] font-bold uppercase tracking-wide text-white/45">
                {t('calc.tech')}
              </div>
              <div className="mt-2 grid gap-3">
                {TECHNOLOGIES.map((tech) => (
                  <TechCard
                    key={tech.id}
                    tech={tech}
                    selected={technologyId === tech.id}
                    onSelect={() => setTechnologyId(tech.id)}
                  />
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                to="/report"
                className="rounded-xl bg-sb-gold px-5 py-2.5 text-sm font-extrabold text-sb-bg hover:bg-sb-goldDark"
              >
                {t('calc.generate')}
              </Link>
            </div>
          </div>
        </Card>
      </div>

      <div className="space-y-4 lg:col-span-2">
        {state && (
          <Card accent="green">
            <div className="text-xs font-extrabold uppercase tracking-wide text-sb-greenMuted">
              {state.name}
            </div>
            <div className="mt-3 space-y-1">
              <KV label={t('stateCard.ghi')} value={`${state.ghiKwhM2Day} kWh/m²/day`} />
              <KV label={t('stateCard.peak')} value={`${state.peakSunHours} h`} />
              <KV
                label={t('stateCard.tariff')}
                value={`₹${state.tariffMinRs} – ₹${state.tariffMaxRs}`}
              />
              <KV label={t('stateCard.subsidy')} value={`${state.subsidyPct}%`} />
              <KV label={t('stateCard.nodal')} value={state.nodalAgency} />
              <KV
                label={t('stateCard.discom')}
                value={<span className="text-right">{state.discom}</span>}
              />
            </div>
            <p className="mt-3 text-xs text-white/50">{state.climateNote}</p>
            <div className="mt-4">
              <div className="text-[10px] font-bold uppercase text-white/40">
                {t('stateCard.monthlyGen')}
              </div>
              <MonthBars values={state.monthlyGenShape} />
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}

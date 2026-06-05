'use client'

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useCalculatorStore } from '@/store/calculatorStore'
import { listGeographyStates, coordsForLocation, getGeographyDistrict, resolveDistrictId } from '@/lib/region'
import { TECHNOLOGIES } from '@/data/technologies'
import { landToAcres } from '@/lib/finance'
import { validateCalculatorInputs, canGenerateReport } from '@/lib/calcValidation'
import type { LandUnit } from '@/types'
import { Card } from '@/components/ui/Card'
import { Select } from '@/components/ui/Select'
import { TechCard } from '@/components/ui/TechCard'
import { MonthBars } from '@/components/charts/MonthBars'
import { KV } from '@/components/ui/KV'
import { PinMapPanel } from '@/components/map/PinMapPanel'
import { PageHeader } from '@/components/ui/PageHeader'
import { ButtonLink } from '@/components/ui/Button'
import { FormField, inputClass } from '@/components/ui/FormField'
import { StepIndicator } from '@/components/ui/StepIndicator'
import { DataSourceBadge } from '@/components/ui/DataSourceBadge'
import {
  BottomActionBar,
  BottomActionBarSpacer,
  BottomNavButton,
  BottomNavLink,
} from '@/components/ui/BottomActionBar'

const GEO_STATES = listGeographyStates()
const STEPS = 4

type CalculatorPageProps = {
  initialStateId?: string | null
  initialDistrictId?: string | null
}

export function CalculatorPage({
  initialStateId = null,
  initialDistrictId = null,
}: CalculatorPageProps) {
  const { t } = useTranslation()
  const [step, setStep] = useState(1)
  const [errorKey, setErrorKey] = useState<string | null>(null)
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
    fetchSolarForSelection,
    solarLoading,
    solarError,
    getResolvedState,
    pinLat,
    pinLon,
    setPin,
    resetPinToDistrict,
    shadingLossPct,
    setShadingLossPct,
  } = useCalculatorStore()

  const hydratedFromUrl = useRef(false)
  useLayoutEffect(() => {
    if (hydratedFromUrl.current) return
    if (!initialStateId) return
    const geo = GEO_STATES.find((s) => s.id === initialStateId)
    if (!geo) return
    hydratedFromUrl.current = true
    setStateId(initialStateId)
    const rid =
      resolveDistrictId(initialStateId, initialDistrictId) ??
      (initialDistrictId && geo.districts.some((d) => d.id === initialDistrictId)
        ? initialDistrictId
        : undefined)
    if (rid) setDistrictId(rid)
  }, [initialStateId, initialDistrictId, setStateId, setDistrictId])

  const state = getResolvedState()
  const geoState = GEO_STATES.find((s) => s.id === stateId)
  const districts = geoState?.districts ?? []
  const centroid = coordsForLocation(stateId, districtId)
  const centroidLat = centroid?.lat
  const centroidLon = centroid?.lon

  const markerPos = useMemo((): [number, number] => {
    if (pinLat !== null && pinLon !== null) return [pinLat, pinLon]
    if (centroidLat !== undefined && centroidLon !== undefined)
      return [centroidLat, centroidLon]
    return [22.5, 78.9]
  }, [pinLat, pinLon, centroidLat, centroidLon])

  const mapCenter = useMemo((): [number, number] => {
    if (centroidLat !== undefined && centroidLon !== undefined)
      return [centroidLat, centroidLon]
    return markerPos
  }, [centroidLat, centroidLon, markerPos])

  const districtRow = getGeographyDistrict(stateId, districtId)
  const acresEquiv = landToAcres(landValue, landUnit)
  const reportReady = canGenerateReport(stateId, districtId, landValue, landUnit)

  const stepLabels = [
    t('calc.stepLocation'),
    t('calc.stepSite'),
    t('calc.stepTech'),
    t('calc.stepMap'),
  ]

  const solarSource = state?.solar?.source
  const sourceLabel =
    solarSource === 'nrel_nsrdb'
      ? t('calc.sourceNrel')
      : solarSource === 'nasa_power'
        ? t('calc.sourceNasa')
        : t('calc.sourceFallback')
  const confidenceLabel =
    solarSource === 'nrel_nsrdb'
      ? t('calc.confidenceHigh')
      : solarSource === 'nasa_power'
        ? t('calc.confidenceMedium')
        : t('calc.confidenceLow')

  useEffect(() => {
    void fetchSolarForSelection()
  }, [fetchSolarForSelection])

  function validateStep(s: number): boolean {
    if (s === 1) {
      const r = validateCalculatorInputs(stateId, districtId, 1, landUnit)
      if (!r.ok && (r.messageKey === 'calc.errorState' || r.messageKey === 'calc.errorDistrict')) {
        setErrorKey(r.messageKey)
        return false
      }
    }
    if (s === 2) {
      const r = validateCalculatorInputs(stateId, districtId, landValue, landUnit)
      if (!r.ok) {
        setErrorKey(r.messageKey)
        return false
      }
    }
    setErrorKey(null)
    return true
  }

  function goNext() {
    if (!validateStep(step)) return
    setStep((s) => Math.min(STEPS, s + 1))
  }

  function goBack() {
    setErrorKey(null)
    setStep((s) => Math.max(1, s - 1))
  }

  return (
    <div className="grid gap-8 lg:grid-cols-5">
      <div className="space-y-6 lg:col-span-3">
        <PageHeader
          title={t('calc.title')}
          subtitle={t('calc.equiv', { acres: acresEquiv.toFixed(2) })}
        >
          {landUnit === 'bigha' ? (
            <p className="text-xs text-white/40">{t('calc.bighaNote')}</p>
          ) : null}
          {(solarLoading || solarError) && (
            <p className="text-xs text-sb-orange" role="status" aria-live="polite">
              {solarLoading ? t('calc.solarLoading') : solarError}
            </p>
          )}
          {state?.solar && (
            <DataSourceBadge source={state.solar.source} label={sourceLabel} confidence={confidenceLabel} />
          )}
        </PageHeader>

        <StepIndicator steps={STEPS} current={step} labels={stepLabels} />

        {errorKey ? (
          <p className="rounded-xl border border-sb-red/30 bg-sb-red/10 px-4 py-3 text-sm text-sb-red" role="alert">
            {t(errorKey)}
          </p>
        ) : null}

        <Card>
          <div className="space-y-4">
            {step === 1 && (
              <div className="grid gap-4 md:grid-cols-2">
                <Select
                  id="state"
                  label={t('calc.state')}
                  value={stateId}
                  onChange={setStateId}
                  options={GEO_STATES.map((s) => ({ value: s.id, label: s.name }))}
                />
                <Select
                  id="district"
                  label={t('calc.district')}
                  value={districtId}
                  onChange={setDistrictId}
                  options={districts.map((d) => ({ value: d.id, label: d.name }))}
                />
              </div>
            )}

            {step === 2 && (
              <div className="grid gap-4 md:grid-cols-2">
                <FormField label={t('calc.land')} required>
                  {({ id, describedBy }) => (
                    <input
                      id={id}
                      type="number"
                      inputMode="decimal"
                      step="0.01"
                      min="0.01"
                      required
                      aria-invalid={!!errorKey}
                      aria-describedby={describedBy}
                      value={landValue}
                      onChange={(e) => setLandValue(Number(e.target.value))}
                      className={`${inputClass} font-mono text-sm`}
                    />
                  )}
                </FormField>
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
            )}

            {step === 3 && (
              <fieldset>
                <legend className="text-[11px] font-bold uppercase tracking-[0.08em] text-white/50">
                  {t('calc.tech')}
                </legend>
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
              </fieldset>
            )}

            {step === 4 && (
              <>
                <div className="border-t border-white/10 pt-4">
                  <div className="text-[11px] font-bold uppercase tracking-[0.08em] text-white/50">
                    {t('calc.phase2MapTitle')}
                  </div>
                  <p className="mt-1 text-xs text-white/45">{t('calc.phase2MapHint')}</p>
                  <div className="mt-3">
                    <PinMapPanel
                      center={mapCenter}
                      marker={markerPos}
                      onMarkerChange={(lat, lon) => setPin(lat, lon)}
                      ariaLabel={t('calc.phase2MapTitle')}
                    />
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => resetPinToDistrict()}
                      className="min-h-[44px] rounded text-xs font-bold text-sb-gold hover:text-sb-goldDark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sb-gold"
                    >
                      {t('calc.phase2ResetPin')}
                    </button>
                    {districtRow && (
                      <span className="font-mono text-[11px] text-white/40">
                        {districtRow.lat.toFixed(4)}°, {districtRow.lon.toFixed(4)}°
                      </span>
                    )}
                  </div>
                </div>
                <div className="border-t border-white/10 pt-4">
                  <label className="flex flex-col gap-2" htmlFor="shading">
                    <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-white/50">
                      {t('calc.phase2Shading')} ({shadingLossPct}%)
                    </span>
                    <input
                      id="shading"
                      type="range"
                      min={0}
                      max={30}
                      step={1}
                      value={shadingLossPct}
                      aria-valuemin={0}
                      aria-valuemax={30}
                      aria-valuenow={shadingLossPct}
                      onChange={(e) => setShadingLossPct(Number(e.target.value))}
                      className="min-h-[44px] w-full accent-sb-gold"
                    />
                    <span className="text-xs text-white/45">{t('calc.phase2ShadingHint')}</span>
                  </label>
                </div>
                <div className="hidden flex-wrap gap-3 pt-2 md:flex">
                  {reportReady ? (
                    <ButtonLink href="/report">{t('calc.generate')}</ButtonLink>
                  ) : (
                    <p className="text-sm text-white/50">{t('calc.errorLand')}</p>
                  )}
                </div>
              </>
            )}

            <div className="hidden gap-3 pt-2 md:flex">
              {step > 1 ? (
                <BottomNavButton label={t('calc.back')} onClick={goBack} variant="secondary" />
              ) : null}
              {step < STEPS ? (
                <BottomNavButton label={t('calc.continue')} onClick={goNext} variant="primary" />
              ) : reportReady ? (
                <BottomNavLink href="/report" label={t('calc.generate')} />
              ) : null}
            </div>
          </div>
        </Card>
        <BottomActionBarSpacer />
      </div>

      <div className="space-y-4 lg:col-span-2">
        {state && (
          <Card accent="green">
            <div className="sb-overline text-sb-greenMuted">
              {state.name}
              {state.policyIsFallback && (
                <span className="ml-2 rounded bg-sb-orange/20 px-2 py-0.5 text-[10px] text-sb-orange">
                  {t('calc.policyVerify')}
                </span>
              )}
            </div>
            {state.solar && (
              <div className="mt-2">
                <DataSourceBadge
                  source={state.solar.source}
                  label={sourceLabel}
                  confidence={confidenceLabel}
                />
              </div>
            )}
            <div className="mt-3 space-y-1">
              <KV label={t('stateCard.ghi')} value={`${state.ghiKwhM2Day.toFixed(2)} kWh/m²/day`} />
              <KV label={t('stateCard.peak')} value={`${state.peakSunHours.toFixed(2)} h`} />
              {state.effectivePerformanceRatio !== undefined && (
                <KV
                  label={t('calc.effectivePr')}
                  value={`${(state.effectivePerformanceRatio * 100).toFixed(1)}%`}
                />
              )}
              <KV
                label={t('stateCard.tariff')}
                value={`₹${state.tariffMinRs} – ₹${state.tariffMaxRs}`}
              />
              <KV label={t('stateCard.subsidy')} value={`${state.subsidyPct}%`} />
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

      <BottomActionBar>
        {step > 1 ? (
          <BottomNavButton label={t('calc.back')} onClick={goBack} variant="secondary" />
        ) : (
          <span className="flex-1" />
        )}
        {step < STEPS ? (
          <BottomNavButton label={t('calc.continue')} onClick={goNext} variant="primary" />
        ) : reportReady ? (
          <BottomNavLink href="/report" label={t('calc.generate')} className="flex-[2]" />
        ) : (
          <BottomNavButton
            label={t('calc.continue')}
            onClick={() => validateStep(2)}
            variant="primary"
            disabled
          />
        )}
      </BottomActionBar>
    </div>
  )
}

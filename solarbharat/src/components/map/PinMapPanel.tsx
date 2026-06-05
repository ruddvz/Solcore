'use client'

import dynamic from 'next/dynamic'
import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import type { PinMapProps } from '@/components/map/PinMap'

const PinMapDynamic = dynamic(() => import('@/components/map/PinMap').then((m) => m.PinMap), {
  ssr: false,
  loading: () => <MapLoading />,
})

const inputClass =
  'min-h-[44px] w-full rounded-xl border border-white/15 bg-sb-bg px-3 py-2.5 text-base text-white outline-none ring-sb-gold/40 focus-visible:ring-2'

function MapLoading() {
  const { t } = useTranslation()
  return (
    <div
      className="flex h-[260px] items-center justify-center rounded-xl border border-white/10 bg-sb-surface/40 text-base text-white/70"
      role="status"
    >
      {t('common.loading')}
    </div>
  )
}

export function PinMapPanel({
  marker,
  onMarkerChange,
  ...rest
}: PinMapProps) {
  const { t } = useTranslation()
  const latId = useId()
  const lonId = useId()
  const [lat, lon] = marker

  return (
    <div className="space-y-3">
      <PinMapDynamic marker={marker} onMarkerChange={onMarkerChange} {...rest} />
      <p className="text-xs text-white/70">{t('calc.phase2MapKeyboard')}</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor={latId} className="text-[11px] font-bold uppercase tracking-[0.08em] text-white/70">
            {t('calc.phase2Lat')}
          </label>
          <input
            id={latId}
            type="number"
            step="0.0001"
            value={lat}
            className={inputClass}
            onChange={(e) => {
              const v = parseFloat(e.target.value)
              if (!Number.isNaN(v)) onMarkerChange(v, lon)
            }}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor={lonId} className="text-[11px] font-bold uppercase tracking-[0.08em] text-white/70">
            {t('calc.phase2Lon')}
          </label>
          <input
            id={lonId}
            type="number"
            step="0.0001"
            value={lon}
            className={inputClass}
            onChange={(e) => {
              const v = parseFloat(e.target.value)
              if (!Number.isNaN(v)) onMarkerChange(lat, v)
            }}
          />
        </div>
      </div>
    </div>
  )
}

'use client'

import dynamic from 'next/dynamic'
import type { PinMapProps } from '@/components/map/PinMap'

const PinMapDynamic = dynamic(() => import('@/components/map/PinMap').then((m) => m.PinMap), {
  ssr: false,
  loading: () => (
    <div
      className="flex h-[260px] items-center justify-center rounded-xl border border-white/10 bg-sb-surface/40 text-sm text-white/45"
      role="status"
    >
      Loading map…
    </div>
  ),
})

export function PinMapPanel(props: PinMapProps) {
  return <PinMapDynamic {...props} />
}

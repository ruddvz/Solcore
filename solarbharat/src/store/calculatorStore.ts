import { create } from 'zustand'
import type { LandUnit, SolarResource, StateInfo } from '@/types'
import { listGeographyStates, resolveStateForCalculator } from '@/lib/region'
import { fetchSolarForStaticSite } from '@/lib/clientSolar'
import { calculateFinancials } from '@/lib/finance'
import type { FinancialResult } from '@/types'

const GEO_STATES = listGeographyStates()
const DEFAULT_STATE = GEO_STATES[0]

function solarCacheKey(stateId: string, districtId: string) {
  return `${stateId}::${districtId}`
}

interface CalculatorState {
  stateId: string
  districtId: string
  landValue: number
  landUnit: LandUnit
  technologyId: string
  solarCache: Record<string, SolarResource>
  solarResource: SolarResource | null
  solarLoading: boolean
  solarError: string | null
  setStateId: (id: string) => void
  setDistrictId: (id: string) => void
  setLandValue: (v: number) => void
  setLandUnit: (u: LandUnit) => void
  setTechnologyId: (id: string) => void
  fetchSolarForSelection: () => Promise<void>
  getResolvedState: () => StateInfo | null
  getFinancials: () => FinancialResult | null
}

export const useCalculatorStore = create<CalculatorState>((set, get) => ({
  stateId: DEFAULT_STATE?.id ?? '',
  districtId: DEFAULT_STATE?.districts[0]?.id ?? '',
  landValue: 5,
  landUnit: 'acre',
  technologyId: 'topcon_bifacial',
  solarCache: {},
  solarResource: null,
  solarLoading: false,
  solarError: null,

  setStateId: (id) => {
    const st = GEO_STATES.find((s) => s.id === id)
    set({
      stateId: id,
      districtId: st?.districts[0]?.id ?? '',
    })
    void get().fetchSolarForSelection()
  },

  setDistrictId: (districtId) => {
    set({ districtId })
    void get().fetchSolarForSelection()
  },

  setLandValue: (landValue) => set({ landValue }),

  setLandUnit: (landUnit) => set({ landUnit }),

  setTechnologyId: (technologyId) => set({ technologyId }),

  fetchSolarForSelection: async () => {
    const { stateId, districtId, solarCache } = get()
    const key = solarCacheKey(stateId, districtId)
    const hit = solarCache[key]
    if (hit) {
      set({ solarResource: hit })
      return
    }
    set({ solarLoading: true, solarError: null })

    const applySolar = (solar: SolarResource) =>
      set((s) => ({
        solarCache: { ...s.solarCache, [key]: solar },
        solarResource: solar,
        solarLoading: false,
        solarError: null,
      }))

    try {
      const qs = new URLSearchParams({ stateId })
      if (districtId) qs.set('districtId', districtId)
      const base = process.env.NEXT_PUBLIC_BASE_PATH || ''
      const res = await fetch(`${base}/api/solar?${qs.toString()}`)
      if (res.ok) {
        const solar = (await res.json()) as SolarResource
        applySolar(solar)
        return
      }
      /** Static hosts (GitHub Pages) have no `/api/solar` — use browser-side NASA POWER */
      applySolar(await fetchSolarForStaticSite(stateId, districtId))
    } catch {
      try {
        applySolar(await fetchSolarForStaticSite(stateId, districtId))
      } catch (e) {
        set({
          solarLoading: false,
          solarError: e instanceof Error ? e.message : 'Solar fetch failed',
        })
      }
    }
  },

  getResolvedState: () => {
    const { stateId, districtId, solarResource } = get()
    return resolveStateForCalculator(stateId, districtId, solarResource)
  },

  getFinancials: () => {
    const { landValue, landUnit, technologyId } = get()
    const state = get().getResolvedState()
    if (!state || landValue <= 0) return null
    return calculateFinancials({ state, landValue, landUnit, technologyId })
  },
}))

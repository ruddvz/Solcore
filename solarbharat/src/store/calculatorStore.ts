import { create } from 'zustand'
import type { LandUnit, SolarResource, StateInfo } from '@/types'
import { listGeographyStates, resolveStateForCalculator } from '@/lib/region'
import { fetchSolarClient } from '@/lib/clientSolar'
import { calculateFinancials } from '@/lib/calcEngine'
import type { FinancialResult } from '@/types'

const GEO_STATES = listGeographyStates()
const DEFAULT_STATE = GEO_STATES[0]

function solarCacheKey(
  stateId: string,
  districtId: string,
  pin: { lat: number; lon: number } | null,
) {
  const p = pin ? `${pin.lat.toFixed(5)},${pin.lon.toFixed(5)}` : ''
  return `${stateId}::${districtId}::${p}`
}

export interface CalculatorState {
  stateId: string
  districtId: string
  landValue: number
  landUnit: LandUnit
  technologyId: string
  /** Phase 2 §6.2 — 0–30% shading loss applied to effective PR */
  shadingLossPct: number
  /** Optional pin override for solar resource (null = use district centroid only) */
  pinLat: number | null
  pinLon: number | null
  solarCache: Record<string, SolarResource>
  solarResource: SolarResource | null
  solarLoading: boolean
  solarError: string | null
  setStateId: (id: string) => void
  setDistrictId: (id: string) => void
  /** Set state + district in one update (avoids reset when hydrating from URL). */
  setLocation: (stateId: string, districtId?: string) => void
  setLandValue: (v: number) => void
  setLandUnit: (u: LandUnit) => void
  setTechnologyId: (id: string) => void
  setShadingLossPct: (v: number) => void
  setPin: (lat: number | null, lon: number | null) => void
  resetPinToDistrict: () => void
  fetchSolarForSelection: () => Promise<void>
  getResolvedState: () => StateInfo | null
  getFinancials: () => FinancialResult | null
}

export const useCalculatorStore = create<CalculatorState>((set, get) => ({
  stateId: DEFAULT_STATE?.id ?? '',
  districtId: DEFAULT_STATE?.districts[0]?.id ?? '',
  landValue: 0,
  landUnit: 'acre',
  technologyId: 'topcon_bifacial',
  shadingLossPct: 0,
  pinLat: null,
  pinLon: null,
  solarCache: {},
  solarResource: null,
  solarLoading: false,
  solarError: null,

  setStateId: (id) => {
    const st = GEO_STATES.find((s) => s.id === id)
    set({
      stateId: id,
      districtId: st?.districts[0]?.id ?? '',
      pinLat: null,
      pinLon: null,
      solarCache: {},
    })
    void get().fetchSolarForSelection()
  },

  setDistrictId: (districtId) => {
    set({ districtId, pinLat: null, pinLon: null, solarCache: {} })
    void get().fetchSolarForSelection()
  },

  setLocation: (stateId, districtId) => {
    const st = GEO_STATES.find((s) => s.id === stateId)
    const rid =
      districtId && st?.districts.some((d) => d.id === districtId)
        ? districtId
        : (st?.districts[0]?.id ?? '')
    set({
      stateId,
      districtId: rid,
      pinLat: null,
      pinLon: null,
      solarCache: {},
    })
    void get().fetchSolarForSelection()
  },

  setLandValue: (landValue) => set({ landValue }),

  setLandUnit: (landUnit) => set({ landUnit }),

  setTechnologyId: (technologyId) => set({ technologyId }),

  setShadingLossPct: (shadingLossPct) =>
    set({ shadingLossPct: Math.min(30, Math.max(0, shadingLossPct)) }),

  setPin: (lat, lon) => {
    set({ pinLat: lat, pinLon: lon })
    void get().fetchSolarForSelection()
  },

  resetPinToDistrict: () => {
    set({ pinLat: null, pinLon: null })
    void get().fetchSolarForSelection()
  },

  fetchSolarForSelection: async () => {
    const { stateId, districtId, pinLat, pinLon, solarCache } = get()
    const pin =
      pinLat !== null && pinLon !== null ? { lat: pinLat, lon: pinLon } : null
    const key = solarCacheKey(stateId, districtId, pin)
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
      const solar = await fetchSolarClient(stateId, districtId, pin)
      applySolar(solar)
    } catch (e) {
      set({
        solarLoading: false,
        solarError: e instanceof Error ? e.message : 'Solar fetch failed',
      })
    }
  },

  getResolvedState: () => {
    const { stateId, districtId, solarResource, shadingLossPct, pinLat, pinLon } = get()
    return resolveStateForCalculator(stateId, districtId, solarResource, {
      shadingLossPct,
      pinLat: pinLat ?? undefined,
      pinLon: pinLon ?? undefined,
    })
  },

  getFinancials: () => {
    const { landValue, landUnit, technologyId } = get()
    const state = get().getResolvedState()
    if (!state || landValue <= 0) return null
    return calculateFinancials({ state, landValue, landUnit, technologyId })
  },
}))

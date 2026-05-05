import { create } from 'zustand'
import type { LandUnit } from '../types'
import { STATES } from '../data/states'
import { calculateFinancials } from '../lib/finance'
import type { FinancialResult } from '../types'

interface CalculatorState {
  stateId: string
  districtId: string
  landValue: number
  landUnit: LandUnit
  technologyId: string
  setStateId: (id: string) => void
  setDistrictId: (id: string) => void
  setLandValue: (v: number) => void
  setLandUnit: (u: LandUnit) => void
  setTechnologyId: (id: string) => void
  getFinancials: () => FinancialResult | null
}

export const useCalculatorStore = create<CalculatorState>((set, get) => ({
  stateId: STATES[0]?.id ?? 'gj',
  districtId: STATES[0]?.districts[0]?.id ?? 'bharuch',
  landValue: 5,
  landUnit: 'acre',
  technologyId: 'topcon_bifacial',
  setStateId: (id) => {
    const st = STATES.find((s) => s.id === id)
    set({
      stateId: id,
      districtId: st?.districts[0]?.id ?? '',
    })
  },
  setDistrictId: (districtId) => set({ districtId }),
  setLandValue: (landValue) => set({ landValue }),
  setLandUnit: (landUnit) => set({ landUnit }),
  setTechnologyId: (technologyId) => set({ technologyId }),
  getFinancials: () => {
    const { stateId, landValue, landUnit, technologyId } = get()
    const state = STATES.find((s) => s.id === stateId)
    if (!state || landValue <= 0) return null
    return calculateFinancials({ state, landValue, landUnit, technologyId })
  },
}))

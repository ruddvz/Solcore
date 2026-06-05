import { landToAcres } from '@/lib/finance'
import type { LandUnit } from '@/types'

export type CalcValidationResult = { ok: true } | { ok: false; messageKey: string }

const MAX_ACRES = 50_000

export function parseLandInput(raw: string): number | null {
  const cleaned = raw.replace(/,/g, '').trim()
  if (!cleaned) return null
  const n = Number(cleaned)
  if (!Number.isFinite(n)) return null
  return n
}

export function validateCalculatorInputs(
  stateId: string,
  districtId: string,
  landValue: number,
  landUnit: LandUnit,
): CalcValidationResult {
  if (!stateId?.trim()) return { ok: false, messageKey: 'calc.errorState' }
  if (!districtId?.trim()) return { ok: false, messageKey: 'calc.errorDistrict' }
  if (!Number.isFinite(landValue) || landValue <= 0) {
    return { ok: false, messageKey: 'calc.errorLand' }
  }
  const acres = landToAcres(landValue, landUnit)
  if (acres > MAX_ACRES) return { ok: false, messageKey: 'calc.errorLandHigh' }
  return { ok: true }
}

export function canGenerateReport(
  stateId: string,
  districtId: string,
  landValue: number,
  landUnit: LandUnit,
): boolean {
  return validateCalculatorInputs(stateId, districtId, landValue, landUnit).ok
}

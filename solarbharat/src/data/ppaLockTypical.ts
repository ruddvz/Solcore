/**
 * Typical DISCOM / PPA tariff-lock horizon for UI warnings (indicative only).
 * Plan0 §7 — "Rate is locked for [X] years only". Values are not legal advice.
 */
const OVERRIDES: Record<string, number> = {
  gujarat: 25,
  rajasthan: 25,
  maharashtra: 25,
  'madhya-pradesh': 25,
  karnataka: 25,
  'uttar-pradesh': 25,
}

export function getTypicalPpaLockYears(stateId: string): number {
  return OVERRIDES[stateId] ?? 25
}

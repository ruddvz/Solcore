/** Plan §6.2 — manual shading reduces effective PR, not raw NASA/NREL irradiance. */

/** Effective PR for finance: base PR × (1 − shading%). */
export function effectivePerformanceRatio(basePr: number, shadingLossPct: number): number {
  const loss = Math.min(100, Math.max(0, shadingLossPct))
  return basePr * (1 - loss / 100)
}

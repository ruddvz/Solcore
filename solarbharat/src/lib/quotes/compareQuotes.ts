/** Normalised quote fields for side-by-side comparison (plan §6.6) */
export type QuoteInput = {
  label: string
  capacityKwp: number
  costPerWpRs: number
  panelBrand: string
  panelAlmm: boolean
  inverterBrand: string
  warrantyModulesYears: number
  warrantyInverterYears: number
  codMonthsEst: number
  penaltyClause: boolean
}

export type QuoteComparisonRow = QuoteInput & {
  totalCapexRs: number
  flags: string[]
}

export function compareQuotes(rows: QuoteInput[]): QuoteComparisonRow[] {
  return rows.map((q) => {
    const totalCapexRs = Math.round(q.capacityKwp * 1000 * q.costPerWpRs)
    const flags: string[] = []
    if (!q.panelAlmm) flags.push('non_almm')
    if (!q.penaltyClause) flags.push('no_cod_penalty')
    if (q.codMonthsEst > 12) flags.push('long_cod_timeline')
    if (q.warrantyModulesYears < 12) flags.push('short_module_warranty')
    return { ...q, totalCapexRs, flags }
  })
}

/** Hint total capex from financial model output when available */
export function hintVsModel(modelCapexRs: number | undefined, quoteTotalRs: number): string | null {
  if (modelCapexRs == null || modelCapexRs <= 0) return null
  const deltaPct = ((quoteTotalRs - modelCapexRs) / modelCapexRs) * 100
  if (Math.abs(deltaPct) < 8) return 'within_range'
  return deltaPct > 0 ? 'above_model' : 'below_model'
}

import type { TechnologySpec } from '../types'

export const TECHNOLOGIES: TechnologySpec[] = [
  {
    id: 'topcon_bifacial',
    label: 'TOPCon N-Type Bifacial',
    efficiencyPct: 22.5,
    degradationPctPerYear: 0.35,
    costPerWpRs: 38,
    bifacialGainPct: 12,
    verdict: 'best',
  },
  {
    id: 'perc_bifacial',
    label: 'Mono-PERC Bifacial',
    efficiencyPct: 21.0,
    degradationPctPerYear: 0.45,
    costPerWpRs: 36,
    bifacialGainPct: 8,
    verdict: 'good',
  },
  {
    id: 'perc_mono',
    label: 'Mono-PERC Monofacial',
    efficiencyPct: 20.5,
    degradationPctPerYear: 0.5,
    costPerWpRs: 34,
    bifacialGainPct: 0,
    verdict: 'acceptable',
  },
]

export function getTechnology(id: string): TechnologySpec {
  return TECHNOLOGIES.find((t) => t.id === id) ?? TECHNOLOGIES[0]
}

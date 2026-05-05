/**
 * Generates `src/data/statePolicies.generated.ts` from `src/data/india-geography.json`.
 * Tariff/subsidy numbers are ESTIMATES for modelling — always verify with DISCOM / nodal orders.
 *
 * Run: node scripts/generate-state-policies.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')

const geography = JSON.parse(
  fs.readFileSync(path.join(ROOT, 'src', 'data', 'india-geography.json'), 'utf8'),
)

/** State-specific hints keyed by geography `state.id` */
const POLICY_BY_STATE = {
  'andhra-pradesh': {
    nodalAgency: 'NREDCAP (Andhra Pradesh)',
    discomNote: 'APTRANSCO / APDISCOMs — confirm applicable DISCOM for your substation.',
    subsidyPctMid: 50,
    loanRatePct: 8.0,
    tariffMidRs: 3.0,
    tariffBandRs: [2.7, 3.35],
    climateNote: 'Good coastal-to-inland variation; cyclone + humidity influence O&M.',
    monsoonNote: 'Jun–Sep monsoon can trim PR; verify soiling and vegetation.',
    gridQuality: 'Industrial corridors generally stronger; rural feeders may need upgrades.',
    fallback: false,
  },
  'arunachal-pradesh': {
    nodalAgency: 'State nodal renewable agency (verify current portal)',
    discomNote: 'Arunachal Pradesh power utility — verify circle / voltage plan.',
    subsidyPctMid: 50,
    loanRatePct: 8.2,
    tariffMidRs: 3.2,
    tariffBandRs: [2.9, 3.6],
    climateNote: 'Terrain + cloud cover varies sharply by valley; site survey essential.',
    monsoonNote: 'Heavy monsoon months — civil and access constraints dominate.',
    gridQuality: 'Remote grid extensions can dominate feasibility.',
    fallback: false,
  },
  assam: {
    nodalAgency: 'Assam Energy Development Agency (AEDA)',
    discomNote: 'APDCL — verify rural feeder capacity.',
    subsidyPctMid: 50,
    loanRatePct: 8.0,
    tariffMidRs: 3.05,
    tariffBandRs: [2.75, 3.35],
    climateNote: 'Humidity + flood risk — structural design and drainage matter.',
    monsoonNote: 'Monsoon downtime risk — budget availability + vegetation.',
    gridQuality: 'Mixed; flood-prone pockets may delay construction.',
    fallback: false,
  },
  bihar: {
    nodalAgency: 'BREDA / state nodal (verify)',
    discomNote: 'North Bihar Power / South Bihar Power / related DISCOM per area.',
    subsidyPctMid: 50,
    loanRatePct: 8.2,
    tariffMidRs: 3.1,
    tariffBandRs: [2.8, 3.45],
    climateNote: 'Strong seasonal haze/fog can trim winter yield.',
    monsoonNote: 'Flood risk near rivers — civil planning critical.',
    gridQuality: 'Feasibility-sensitive to nearest 33/132 kV availability.',
    fallback: false,
  },
  chhattisgarh: {
    nodalAgency: 'CREDA',
    discomNote: 'CSPDCL / CSPDCL divisions — confirm billing category.',
    subsidyPctMid: 60,
    loanRatePct: 7.9,
    tariffMidRs: 2.95,
    tariffBandRs: [2.65, 3.25],
    climateNote: 'Good solar resource band; inland dust + heat.',
    monsoonNote: 'Monsoon dip + vegetation growth — cleaning discipline matters.',
    gridQuality: 'Mining/industrial pockets often better infrastructure.',
    fallback: false,
  },
  goa: {
    nodalAgency: 'GEDA / Goa nodal (verify rooftop vs ground rules)',
    discomNote: 'Goa Electricity Department — confirm agricultural categorisation.',
    subsidyPctMid: 40,
    loanRatePct: 8.0,
    tariffMidRs: 3.25,
    tariffBandRs: [2.95, 3.55],
    climateNote: 'Coastal humidity + salt aerosols — module cleaning and corrosion.',
    monsoonNote: 'Heavy monsoon — torque/civil checks for mounting.',
    gridQuality: 'Urban feeders stronger; hinterland varies.',
    fallback: false,
  },
  gujarat: {
    nodalAgency: 'GEDA',
    discomNote: 'PGVCL / MGVCL / UGVCL / DGVCL — zone-specific.',
    subsidyPctMid: 60,
    loanRatePct: 7.5,
    tariffMidRs: 2.85,
    tariffBandRs: [2.65, 3.05],
    climateNote: 'Excellent annual irradiance; dust inland.',
    monsoonNote: 'Monsoon dip + dust storms — cleaning robot ROI often strong.',
    gridQuality: 'Generally strong near industrial corridors.',
    fallback: false,
  },
  haryana: {
    nodalAgency: 'HAREDA',
    discomNote: 'DHBVN / UHBVN — confirm district.',
    subsidyPctMid: 50,
    loanRatePct: 8.0,
    tariffMidRs: 3.05,
    tariffBandRs: [2.75, 3.35],
    climateNote: 'Fog/haze winters; strong summer yield.',
    monsoonNote: 'Monsoon humidity + dust cycles.',
    gridQuality: 'NCR pockets constrained — confirm bay availability early.',
    fallback: false,
  },
  'himachal-pradesh': {
    nodalAgency: 'HIMURJA',
    discomNote: 'HPSEBL — valley-specific voltage constraints.',
    subsidyPctMid: 45,
    loanRatePct: 8.1,
    tariffMidRs: 3.15,
    tariffBandRs: [2.85, 3.45],
    climateNote: 'Terrain shading + snow pockets — ground mount needs careful siting.',
    monsoonNote: 'Monsoon landslide risk on hill roads — logistics matter.',
    gridQuality: 'Remote areas may require long LT/HT extensions.',
    fallback: false,
  },
  jharkhand: {
    nodalAgency: 'JREDA',
    discomNote: 'JBVNL — feeder-specific.',
    subsidyPctMid: 55,
    loanRatePct: 8.0,
    tariffMidRs: 3.05,
    tariffBandRs: [2.75, 3.35],
    climateNote: 'Humidity + aerosols — cleaning discipline.',
    monsoonNote: 'Heavy rain months — availability dips.',
    gridQuality: 'Mining/industrial hubs vary widely.',
    fallback: false,
  },
  karnataka: {
    nodalAgency: 'KREDL',
    discomNote: 'ESCOMs — BESCOM / HESCOM / etc.',
    subsidyPctMid: 50,
    loanRatePct: 7.85,
    tariffMidRs: 3.0,
    tariffBandRs: [2.75, 3.25],
    climateNote: 'Strong interior irradiance; coastal humidity differs.',
    monsoonNote: 'Monsoon cloud cover — inverter clipping checks.',
    gridQuality: 'Mixed; confirm substation capacity.',
    fallback: false,
  },
  kerala: {
    nodalAgency: 'ANERT',
    discomNote: 'KSEB — agricultural tariff category verification.',
    subsidyPctMid: 40,
    loanRatePct: 8.0,
    tariffMidRs: 3.15,
    tariffBandRs: [2.85, 3.45],
    climateNote: 'High humidity + frequent cloud — yield modelling needs conservative PR.',
    monsoonNote: 'Extended monsoon — civil drainage + vegetation.',
    gridQuality: 'Backwater/coastal constraints common.',
    fallback: false,
  },
  'madhya-pradesh': {
    nodalAgency: 'MPUVNL',
    discomNote: 'DISCOM zone-specific — CSPDCL / MPPKVVCL / etc.',
    subsidyPctMid: 60,
    loanRatePct: 7.65,
    tariffMidRs: 2.95,
    tariffBandRs: [2.7, 3.15],
    climateNote: 'Strong central plains irradiance.',
    monsoonNote: 'Monsoon dip — inland dust in dry months.',
    gridQuality: 'Bay availability varies — confirm early.',
    fallback: false,
  },
  maharashtra: {
    nodalAgency: 'MEDA',
    discomNote: 'MSEDCL — circle-specific.',
    subsidyPctMid: 50,
    loanRatePct: 8.0,
    tariffMidRs: 3.1,
    tariffBandRs: [2.85, 3.35],
    climateNote: 'Coastal vs Deccan differs materially.',
    monsoonNote: 'Heavy monsoon — drainage + vegetation.',
    gridQuality: 'Queue hotspots exist — confirm substation planning.',
    fallback: false,
  },
  manipur: {
    nodalAgency: 'MANIREDA',
    discomNote: 'MSPCL / MSPDCL — verify classification.',
    subsidyPctMid: 50,
    loanRatePct: 8.2,
    tariffMidRs: 3.15,
    tariffBandRs: [2.85, 3.45],
    climateNote: 'Cloud + terrain variability — conservative PR.',
    monsoonNote: 'Extended rain season — access logistics.',
    gridQuality: 'Remote feeders — extension costs can dominate.',
    fallback: false,
  },
  meghalaya: {
    nodalAgency: 'Meghalaya nodal renewable agency (verify)',
    discomNote: 'MePDCL — terrain-sensitive planning.',
    subsidyPctMid: 50,
    loanRatePct: 8.2,
    tariffMidRs: 3.15,
    tariffBandRs: [2.85, 3.45],
    climateNote: 'High rainfall regions — conservative yield assumptions.',
    monsoonNote: 'Monsoon-heavy — civil works scheduling.',
    gridQuality: 'Terrain constrains grid routing.',
    fallback: false,
  },
  mizoram: {
    nodalAgency: 'Mizoram nodal renewable agency (verify)',
    discomNote: 'Power & Electricity Dept — confirm.',
    subsidyPctMid: 50,
    loanRatePct: 8.2,
    tariffMidRs: 3.15,
    tariffBandRs: [2.85, 3.45],
    climateNote: 'Cloud-heavy seasons — conservative PR.',
    monsoonNote: 'Heavy rainfall — landslide risk on access roads.',
    gridQuality: 'Remote areas — extension costs.',
    fallback: false,
  },
  nagaland: {
    nodalAgency: 'Nagaland nodal renewable agency (verify)',
    discomNote: 'Department of Power — confirm.',
    subsidyPctMid: 50,
    loanRatePct: 8.2,
    tariffMidRs: 3.15,
    tariffBandRs: [2.85, 3.45],
    climateNote: 'Terrain + cloud variability.',
    monsoonNote: 'Monsoon access constraints.',
    gridQuality: 'Remote pockets — budget extension quotes.',
    fallback: false,
  },
  odisha: {
    nodalAgency: 'OREDA',
    discomNote: 'TPCODL / NESCO / etc. — confirm DISCOM.',
    subsidyPctMid: 55,
    loanRatePct: 8.0,
    tariffMidRs: 3.05,
    tariffBandRs: [2.75, 3.35],
    climateNote: 'Coastal cyclone exposure — structural design.',
    monsoonNote: 'Heavy monsoon — availability dips.',
    gridQuality: 'Industrial corridors vary.',
    fallback: false,
  },
  punjab: {
    nodalAgency: 'PEDA',
    discomNote: 'PSPCL — feeder classification.',
    subsidyPctMid: 50,
    loanRatePct: 7.9,
    tariffMidRs: 3.05,
    tariffBandRs: [2.75, 3.35],
    climateNote: 'Good plains irradiance; smog episodes can trim winter PR.',
    monsoonNote: 'Monsoon humidity — vegetation.',
    gridQuality: 'Generally decent near Highway corridors.',
    fallback: false,
  },
  rajasthan: {
    nodalAgency: 'RREC',
    discomNote: 'JdVVNL / AVVNL / RUVNL — zone-specific.',
    subsidyPctMid: 60,
    loanRatePct: 7.75,
    tariffMidRs: 2.75,
    tariffBandRs: [2.55, 2.95],
    climateNote: 'Excellent insolation; extreme dust.',
    monsoonNote: 'Short monsoon vs west coast — heat stress on equipment.',
    gridQuality: 'EHV corridors strong; remote sites may need long lines.',
    fallback: false,
  },
  sikkim: {
    nodalAgency: 'SREDA',
    discomNote: 'Energy & Power Dept — terrain constraints.',
    subsidyPctMid: 50,
    loanRatePct: 8.2,
    tariffMidRs: 3.2,
    tariffBandRs: [2.9, 3.5],
    climateNote: 'Mountain shading + cloud — conservative yields.',
    monsoonNote: 'Landslide risk — logistics.',
    gridQuality: 'Often constrained — extension quotes critical.',
    fallback: false,
  },
  'tamil-nadu': {
    nodalAgency: 'TEDA',
    discomNote: 'TANGEDCO — tariff schedule verification mandatory.',
    subsidyPctMid: 50,
    loanRatePct: 8.0,
    tariffMidRs: 3.05,
    tariffBandRs: [2.75, 3.35],
    climateNote: 'Wind + coastal aerosols — module clamp checks.',
    monsoonNote: 'Monsoon + cyclone exposure by coast.',
    gridQuality: 'Industrial zones vary widely.',
    fallback: false,
  },
  telangana: {
    nodalAgency: 'TSREDCO',
    discomNote: 'TSSPDCL / TSNPDCL — confirm.',
    subsidyPctMid: 50,
    loanRatePct: 8.0,
    tariffMidRs: 3.0,
    tariffBandRs: [2.75, 3.25],
    climateNote: 'Strong interior irradiance.',
    monsoonNote: 'Monsoon humidity — vegetation.',
    gridQuality: 'Generally decent near highways.',
    fallback: false,
  },
  tripura: {
    nodalAgency: 'Tripura nodal renewable agency (verify)',
    discomNote: 'TSECL — confirm.',
    subsidyPctMid: 50,
    loanRatePct: 8.2,
    tariffMidRs: 3.1,
    tariffBandRs: [2.8, 3.4],
    climateNote: 'Cloud-heavy periods — conservative PR.',
    monsoonNote: 'Heavy rainfall — civil logistics.',
    gridQuality: 'Small grid — confirm bay availability.',
    fallback: false,
  },
  'uttar-pradesh': {
    nodalAgency: 'UPNEDA',
    discomNote: 'PVVNL / MVVNL / etc. — zone-specific.',
    subsidyPctMid: 55,
    loanRatePct: 8.1,
    tariffMidRs: 3.05,
    tariffBandRs: [2.8, 3.3],
    climateNote: 'Fog/haze winters in pockets.',
    monsoonNote: 'Monsoon flooding risk in low-lying belts.',
    gridQuality: 'Mixed — confirm protection settings early.',
    fallback: false,
  },
  uttarakhand: {
    nodalAgency: 'UREDA',
    discomNote: 'UPCL — valley-specific constraints.',
    subsidyPctMid: 50,
    loanRatePct: 8.1,
    tariffMidRs: 3.15,
    tariffBandRs: [2.85, 3.45],
    climateNote: 'Mountain shading + snow — conservative yield.',
    monsoonNote: 'Monsoon landslide risk — logistics.',
    gridQuality: 'Terrain-heavy regions — extension costs.',
    fallback: false,
  },
  'west-bengal': {
    nodalAgency: 'WBREDA',
    discomNote: 'WBSEDCL / CESC areas — verify.',
    subsidyPctMid: 50,
    loanRatePct: 8.0,
    tariffMidRs: 3.05,
    tariffBandRs: [2.75, 3.35],
    climateNote: 'Humidity + haze; coastal cyclone exposure.',
    monsoonNote: 'Heavy monsoon — drainage.',
    gridQuality: 'Industrial belts vary.',
    fallback: false,
  },
}

function baseFallback(stateName) {
  return {
    nodalAgency: 'MNRE / State nodal agency (verify on portal)',
    discomNote: 'Confirm your DISCOM and feeder voltage class with the utility.',
    subsidyPctMid: 50,
    loanRatePct: 8.0,
    tariffMidRs: 3.0,
    tariffBandRs: [2.75, 3.25],
    climateNote:
      'India spans multiple climate zones — use satellite-derived irradiance for your district centroid.',
    monsoonNote: 'Monsoon months reduce PR — budget cleaning and vegetation control.',
    gridQuality:
      'Grid capacity and bay availability are site-specific — budget extension quotes early.',
    fallback: true,
    stateName,
  }
}

const records = {}

for (const s of geography.states) {
  const specific = POLICY_BY_STATE[s.id]
  if (specific) {
    records[s.id] = {
      stateId: s.id,
      stateName: s.name,
      nodalAgency: specific.nodalAgency,
      discomNote: specific.discomNote,
      subsidyPctMid: specific.subsidyPctMid,
      loanRatePct: specific.loanRatePct,
      tariffMidRs: specific.tariffMidRs,
      tariffBandRs: specific.tariffBandRs,
      climateNote: specific.climateNote,
      monsoonNote: specific.monsoonNote,
      gridQuality: specific.gridQuality,
      isFallbackPolicy: false,
    }
  } else {
    const b = baseFallback(s.name)
    records[s.id] = {
      stateId: s.id,
      stateName: s.name,
      nodalAgency: b.nodalAgency,
      discomNote: b.discomNote,
      subsidyPctMid: b.subsidyPctMid,
      loanRatePct: b.loanRatePct,
      tariffMidRs: b.tariffMidRs,
      tariffBandRs: b.tariffBandRs,
      climateNote: b.climateNote,
      monsoonNote: b.monsoonNote,
      gridQuality: b.gridQuality,
      isFallbackPolicy: true,
    }
  }
}

const out = path.join(ROOT, 'src', 'data', 'statePolicies.generated.ts')
fs.mkdirSync(path.dirname(out), { recursive: true })
const body = JSON.stringify(records, null, 2)
const file = `/** AUTO-GENERATED — run scripts/generate-state-policies.mjs */
export interface StatePolicy {
  stateId: string
  stateName: string
  nodalAgency: string
  discomNote: string
  subsidyPctMid: number
  loanRatePct: number
  tariffMidRs: number
  tariffBandRs: [number, number]
  climateNote: string
  monsoonNote: string
  gridQuality: string
  /** True when using India-wide placeholders — verify tariff/subsidy locally */
  isFallbackPolicy?: boolean
}

export const STATE_POLICIES: Record<string, StatePolicy> = ${body}

export function getStatePolicy(stateId: string): StatePolicy | undefined {
  return STATE_POLICIES[stateId]
}
`
fs.writeFileSync(out, file)
console.log(`Wrote ${out}`)

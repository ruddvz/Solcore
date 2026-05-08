/** Supplier directory (Phase 1 static). Keys reference i18n where needed. */

export const PANEL_MANUFACTURERS = [
  {
    name: 'Waaree Energies',
    locationKey: 'supplier.loc.surat',
    techKey: 'supplier.tech.topconPerc',
    tag: 'Gujarat',
    almm: true as const,
  },
  {
    name: 'Adani Solar',
    locationKey: 'supplier.loc.mundra',
    techKey: 'supplier.tech.topconPerc',
    tag: 'Gujarat',
    almm: true as const,
  },
  {
    name: 'Vikram Solar',
    locationKey: 'supplier.loc.kolkata',
    techKey: 'supplier.tech.topconPerc',
    tag: 'National',
    almm: true as const,
  },
  {
    name: 'Goldi Solar',
    locationKey: 'supplier.loc.surat',
    techKey: 'supplier.tech.percTopcon',
    tag: 'Gujarat',
    almm: true as const,
  },
  {
    name: 'Tata Power Solar',
    locationKey: 'supplier.loc.bengaluru',
    techKey: 'supplier.tech.percTopcon',
    tag: 'National',
    almm: true as const,
  },
] as const

export const INVERTER_BRANDS = [
  { name: 'Sungrow', model: 'SG100CX', warranty: '5 yrs' },
  { name: 'Huawei', model: 'SUN2000-100KTL', warranty: '5 yrs' },
  { name: 'SMA', model: 'Sunny Tripower', warranty: '5 yrs' },
  { name: 'Growatt', model: 'MAX 100KTL3-X', warranty: '5 yrs' },
] as const

export const ROBOT_SYSTEMS = [
  { name: 'Solabot', capitalKey: 'supplier.robot.solabot.capital', runKey: 'supplier.robot.solabot.run', rec: true },
  { name: 'Taypro', capitalKey: 'supplier.robot.taypro.capital', runKey: 'supplier.robot.taypro.run', rec: false },
  { name: 'Aegeus Technologies', capitalKey: 'supplier.robot.aegeus.capital', runKey: 'supplier.robot.aegeus.run', rec: false },
] as const

export const FINANCING_PARTNERS = [
  { bankKey: 'supplier.fin.sbi', rate: '7–7.5%', tenureKey: 'supplier.fin.tenure1015' },
  { bankKey: 'supplier.fin.nabard', rate: '7.5–8%', tenureKey: 'supplier.fin.tenure10' },
  { bankKey: 'supplier.fin.ireda', rate: '8–8.5%', tenureKey: 'supplier.fin.tenure15' },
] as const

export type EpcListing = {
  name: string
  url: string
  verified: boolean
  /** Illustrative UI rating only — not a performance guarantee. */
  rating: number
}

/** Four EPCs per state for Suppliers tab (keys match geography `state.id`) */
export const EPC_BY_STATE: Record<string, EpcListing[]> = {
  gujarat: [
    { name: 'Waaree Energies (EPC)', url: 'https://waaree.com', verified: true, rating: 4.7 },
    { name: 'KPI Green Energy', url: 'https://kpigreenenergy.com', verified: true, rating: 4.5 },
    { name: 'Enerparc India', url: 'https://enerparc.in', verified: true, rating: 4.6 },
    { name: 'Goldi Solar EPC', url: 'https://goldisolar.com', verified: true, rating: 4.5 },
  ],
  rajasthan: [
    { name: 'Rays Power Experts', url: 'https://rayspowerexperts.com', verified: true, rating: 4.4 },
    { name: 'ACME Solar', url: 'https://acmesolar.in', verified: true, rating: 4.6 },
    { name: 'Sterling and Wilson', url: 'https://sterlingandwilson.com', verified: true, rating: 4.5 },
    { name: 'Azure Power', url: 'https://azurepower.com', verified: true, rating: 4.7 },
  ],
  maharashtra: [
    { name: 'Tata Power Solar EPC', url: 'https://tatapowersolar.com', verified: true, rating: 4.8 },
    { name: 'SunSource Energy', url: 'https://sunsourceenergy.com', verified: true, rating: 4.5 },
    { name: 'Goldi Solar', url: 'https://goldisolar.com', verified: true, rating: 4.5 },
    { name: 'Hero Future Energies', url: 'https://herofutureenergies.com', verified: true, rating: 4.6 },
  ],
  'madhya-pradesh': [
    { name: 'NTPC Renewable', url: 'https://ntpc.co.in', verified: true, rating: 4.7 },
    { name: 'Greenko', url: 'https://greenkogroup.com', verified: true, rating: 4.6 },
    { name: 'ReNew Power', url: 'https://renewpower.in', verified: true, rating: 4.7 },
    { name: 'Tata Power Solar EPC', url: 'https://tatapowersolar.com', verified: true, rating: 4.8 },
  ],
  karnataka: [
    { name: 'Greenko', url: 'https://greenkogroup.com', verified: true, rating: 4.6 },
    { name: 'Fourth Partner Energy', url: 'https://fourthpartnerenergy.com', verified: true, rating: 4.7 },
    { name: 'CleanMax Solar', url: 'https://cleanmaxsolar.com', verified: true, rating: 4.5 },
    { name: 'Tata Power Solar EPC', url: 'https://tatapowersolar.com', verified: true, rating: 4.8 },
  ],
  'uttar-pradesh': [
    { name: 'NTPC Solar', url: 'https://ntpc.co.in', verified: true, rating: 4.7 },
    { name: 'SB Energy', url: 'https://sbenergy.in', verified: true, rating: 4.4 },
    { name: 'Hero Future Energies', url: 'https://herofutureenergies.com', verified: true, rating: 4.6 },
    { name: 'ReNew Power', url: 'https://renewpower.in', verified: true, rating: 4.7 },
  ],
}

/** Legacy short keys from early MVP prototypes */
export function getEpcListForState(stateId: string): EpcListing[] {
  return EPC_BY_STATE[stateId] ?? []
}

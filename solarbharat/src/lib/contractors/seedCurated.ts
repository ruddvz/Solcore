import type { DirectoryContractor } from '@/lib/contractors/types'

/** Offline / demo listings until Supabase has rows — plan §12 illustrative brands only */
export const SEED_CONTRACTORS: DirectoryContractor[] = [
  {
    id: 'seed-guj-1',
    slug: 'waaree-services-west',
    companyName: 'Waaree Energies — western India projects',
    stateId: 'gujarat',
    districtIds: [],
    technologyTags: ['topcon', 'bifacial', 'pm-kusum'],
    contactEmail: null,
    contactPhone: null,
    profileMd:
      'Illustrative listing for demo only (replace via Supabase). National ALMM partner — typical GW-scale EPC presence in Gujarat.',
    verified: true,
  },
  {
    id: 'seed-rj-1',
    slug: 'rajasthan-solar-epc-demo',
    companyName: 'Rajasthan Solar EPC (demo)',
    stateId: 'rajasthan',
    districtIds: [],
    technologyTags: ['perc', 'ground-mount'],
    contactEmail: null,
    contactPhone: null,
    profileMd: 'Demo placeholder — verify empaneled contractors against your state nodal agency before hiring.',
    verified: true,
  },
  {
    id: 'seed-mh-1',
    slug: 'maharashtra-agri-solar-demo',
    companyName: 'Maharashtra Agri-Solar (demo)',
    stateId: 'maharashtra',
    districtIds: [],
    technologyTags: ['pm-kusum', 'ht-connection'],
    contactEmail: null,
    contactPhone: null,
    profileMd: 'Demo placeholder for calculator/report testing.',
    verified: true,
  },
]

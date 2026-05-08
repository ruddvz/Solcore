/**
 * Plan0 §7 Tab 5 — official nodal portal URLs (helplines change; verify before calling).
 * Extend per state as you validate numbers with agencies.
 */
export const NODAL_PORTALS: Partial<
  Record<string, { url: string; phoneHint?: string }>
> = {
  gujarat: {
    url: 'https://geda.gujarat.gov.in/',
    phoneHint: 'GEDA — verify current helpline on the official portal',
  },
  rajasthan: {
    url: 'https://energy.rajasthan.gov.in/',
    phoneHint: 'RRECL / state energy dept — verify contact on portal',
  },
  maharashtra: {
    url: 'https://www.mahaurja.com/',
    phoneHint: 'MEDA / Urja — verify helpline on portal',
  },
  'madhya-pradesh': {
    url: 'https://mnre.gov.in/schemes/schemes-overview/',
    phoneHint: 'Confirm current MP nodal (e.g. MPUVNL) on the MNRE PM-KUSUM nodal list',
  },
  karnataka: {
    url: 'https://kredlinfo.in/',
    phoneHint: 'KREDL — verify current phone on portal',
  },
  'uttar-pradesh': {
    url: 'https://upneda.org.in/',
    phoneHint: 'UPNEDA — verify helpline on portal',
  },
  'andhra-pradesh': {
    url: 'https://nredcap.ap.gov.in/',
    phoneHint: 'NREDCAP — verify on portal',
  },
  telangana: {
    url: 'https://treda.telangana.gov.in/',
    phoneHint: 'TSREDA — verify on portal',
  },
  'tamil-nadu': {
    url: 'https://www.teda.in/',
    phoneHint: 'TEDA — verify on portal',
  },
  punjab: {
    url: 'https://peda.gov.in/',
    phoneHint: 'PEDA — verify on portal',
  },
  haryana: {
    url: 'https://hareda.gov.in/',
    phoneHint: 'HAREDA — verify on portal',
  },
  bihar: {
    url: 'https://mnre.gov.in/schemes/schemes-overview/',
    phoneHint: 'Confirm Bihar nodal agency on MNRE listing; DISCOM-specific rules apply',
  },
  'west-bengal': {
    url: 'https://wbreda.gov.in/',
    phoneHint: 'WBREDA — verify on portal',
  },
}

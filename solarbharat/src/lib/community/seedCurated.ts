import type { ForumTopicRow, ForumPostRow, QuotaSnapshotRow } from '@/lib/community/types'

export const SEED_FORUM_TOPICS: ForumTopicRow[] = [
  {
    id: 'seed-f1',
    slug: 'pm-kusum-subsidy-disbursement-faq',
    title: 'How long does PM-KUSUM subsidy actually take?',
    category: 'pm-kusum',
    stateId: 'gujarat',
    schemeTag: 'pm-kusum',
    bodyMd:
      'We were told 60 days but DISCOM says 6+ months. What timeline should we budget for working capital?',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'seed-f2',
    slug: 'ht-connection-cost-gujarat',
    title: 'HT / grid connection ballpark for 1 MW ground mount',
    category: 'grid',
    stateId: 'gujarat',
    schemeTag: null,
    bodyMd:
      'Looking for recent experience on transformer + HT line costs in South Gujarat — order of magnitude only.',
    createdAt: new Date().toISOString(),
  },
]

export const SEED_FORUM_POSTS: Record<string, ForumPostRow[]> = {
  'seed-f1': [
    {
      id: 'seed-p1',
      topicId: 'seed-f1',
      bodyMd:
        'Budget 4–9 months from application milestones for subsidy flow; keep 6 months working capital as conservative default (verify with your nodal agency).',
      isVerifiedAnswer: true,
      createdAt: new Date().toISOString(),
    },
  ],
  'seed-f2': [
    {
      id: 'seed-p2',
      topicId: 'seed-f2',
      bodyMd:
        'Varies by DISCOM and distance — get three quotes after CEIG sanction; many projects see ₹40–90L+ for HT gear depending on voltage and length.',
      isVerifiedAnswer: false,
      createdAt: new Date().toISOString(),
    },
  ],
}

export const SEED_QUOTA_ROWS: QuotaSnapshotRow[] = [
  {
    id: 'seed-q1',
    capturedAt: new Date().toISOString(),
    stateId: 'gujarat',
    districtId: 'bharuch',
    statusBand: 'limited',
    mwRemaining: 42,
    source: 'manual',
    sourceDetail: 'Demo — verify with GEDA / DISCOM.',
  },
  {
    id: 'seed-q2',
    capturedAt: new Date().toISOString(),
    stateId: 'rajasthan',
    districtId: null,
    statusBand: 'available',
    mwRemaining: null,
    source: 'manual',
    sourceDetail: 'Demo row.',
  },
]

export type ForumTopicRow = {
  id: string
  slug: string
  title: string
  category: string
  stateId: string | null
  schemeTag: string | null
  bodyMd: string
  createdAt: string
}

export type ForumPostRow = {
  id: string
  topicId: string
  bodyMd: string
  isVerifiedAnswer: boolean
  createdAt: string
}

export type QuotaSnapshotRow = {
  id: string
  capturedAt: string
  stateId: string
  districtId: string | null
  statusBand: string
  mwRemaining: number | null
  source: string
  sourceDetail: string | null
}

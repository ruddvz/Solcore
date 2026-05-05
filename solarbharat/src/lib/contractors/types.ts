/** Public directory row (plan §6.3) — matches `contractors` table + display helpers */
export type DirectoryContractor = {
  id: string
  slug: string
  companyName: string
  stateId: string
  districtIds: string[]
  technologyTags: string[]
  contactEmail: string | null
  contactPhone: string | null
  profileMd: string | null
  verified: boolean
}

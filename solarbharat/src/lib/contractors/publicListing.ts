import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import type { DirectoryContractor } from '@/lib/contractors/types'
import { SEED_CONTRACTORS } from '@/lib/contractors/seedCurated'

function rowToContractor(row: Record<string, unknown>): DirectoryContractor | null {
  const slug = row.slug
  const companyName = row.company_name
  if (typeof slug !== 'string' || typeof companyName !== 'string') return null
  return {
    id: String(row.id ?? slug),
    slug,
    companyName,
    stateId: typeof row.state_id === 'string' ? row.state_id : '',
    districtIds: Array.isArray(row.district_ids)
      ? row.district_ids.filter((x): x is string => typeof x === 'string')
      : [],
    technologyTags: Array.isArray(row.technology_tags)
      ? row.technology_tags.filter((x): x is string => typeof x === 'string')
      : [],
    contactEmail: typeof row.contact_email === 'string' ? row.contact_email : null,
    contactPhone: typeof row.contact_phone === 'string' ? row.contact_phone : null,
    profileMd: typeof row.profile_md === 'string' ? row.profile_md : null,
    verified: row.verified === true,
  }
}

/** Load verified contractors: Supabase when configured & rows exist, else curated seed. */
export async function fetchPublicContractors(): Promise<DirectoryContractor[]> {
  const supabase = createSupabaseBrowserClient()
  if (supabase) {
    const { data, error } = await supabase
      .from('contractors')
      .select(
        'id, slug, company_name, state_id, district_ids, technology_tags, contact_email, contact_phone, profile_md, verified',
      )
      .eq('verified', true)
      .order('company_name')

    if (!error && data?.length) {
      const out: DirectoryContractor[] = []
      for (const row of data as Record<string, unknown>[]) {
        const c = rowToContractor(row)
        if (c) out.push(c)
      }
      if (out.length > 0) return out
    }
  }
  return [...SEED_CONTRACTORS]
}

export async function fetchContractorBySlug(slug: string): Promise<DirectoryContractor | null> {
  const trimmed = slug.trim()
  if (!trimmed) return null

  const supabase = createSupabaseBrowserClient()
  if (supabase) {
    const { data, error } = await supabase
      .from('contractors')
      .select(
        'id, slug, company_name, state_id, district_ids, technology_tags, contact_email, contact_phone, profile_md, verified',
      )
      .eq('slug', trimmed)
      .eq('verified', true)
      .maybeSingle()

    if (!error && data) {
      const c = rowToContractor(data as Record<string, unknown>)
      if (c) return c
    }
  }

  return SEED_CONTRACTORS.find((c) => c.slug === trimmed) ?? null
}

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

/** Server Components / Route Handlers — optional until Supabase env is set. */
export function createSupabaseServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !anon) return null

  const cookieStore = cookies()

  return createServerClient(url, anon, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          )
        } catch {
          /* ignore when called from a Server Component without mutable cookies */
        }
      },
    },
  })
}

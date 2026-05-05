import { createBrowserClient } from '@supabase/ssr'

/** Browser client — returns null if Supabase is not configured. */
export function createSupabaseBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !anon) return null
  return createBrowserClient(url, anon)
}

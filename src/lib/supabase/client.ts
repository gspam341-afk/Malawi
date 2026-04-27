import { createBrowserClient } from '@supabase/ssr'

export type SupabaseBrowserClient = NonNullable<ReturnType<typeof createBrowserClient>>

export function createSupabaseBrowserClient(): SupabaseBrowserClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !anonKey) {
    return null
  }

  return createBrowserClient(url, anonKey)
}

import { createSupabaseServiceRoleClient } from '@/lib/supabase/service'

export function createSupabaseAdminClient() {
  return createSupabaseServiceRoleClient()
}

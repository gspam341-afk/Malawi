'use server'

import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/auth'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function adminSetResourceStatusAction(formData: FormData) {
  await requireAdmin()
  const supabase = await createSupabaseServerClient()

  const resourceId = String(formData.get('resource_id') ?? '')
  const status = String(formData.get('status') ?? '')

  if (!resourceId || !status) redirect('/dashboard/resources/manage')

  const payload: Record<string, unknown> = {
    status,
  }

  if (status === 'published') {
    payload.published_at = new Date().toISOString()
  } else {
    payload.published_at = null
  }

  const { error } = await supabase.from('resources').update(payload).eq('id', resourceId)
  if (error) throw error

  redirect('/dashboard/resources/manage')
}

export async function adminArchiveResourceAction(formData: FormData) {
  await requireAdmin()
  const supabase = await createSupabaseServerClient()

  const resourceId = String(formData.get('resource_id') ?? '')
  if (!resourceId) redirect('/dashboard/resources/manage')

  const { error } = await supabase.from('resources').update({ status: 'archived', published_at: null }).eq('id', resourceId)
  if (error) throw error

  redirect('/dashboard/resources/manage')
}

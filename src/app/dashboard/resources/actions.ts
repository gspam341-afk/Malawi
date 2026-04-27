'use server'

import { redirect } from 'next/navigation'
import { requireRole } from '@/lib/auth'
import { createSupabaseServerClient } from '@/lib/supabase/server'

function parseIds(formData: FormData, key: string) {
  return formData.getAll(key).map((v) => String(v)).filter(Boolean)
}

export async function bulkSetDraftResourcesAction(formData: FormData) {
  const profile = await requireRole(['admin', 'teacher'])
  const supabase = await createSupabaseServerClient()

  const ids = parseIds(formData, 'resource_ids')
  if (!ids.length) redirect('/dashboard/resources')

  let query = supabase.from('resources').update({ status: 'draft', published_at: null }).in('id', ids)

  if (profile.role === 'teacher') {
    query = query.eq('created_by', profile.id)
  }

  const { error } = await query
  if (error) throw error

  redirect('/dashboard/resources')
}

export async function bulkSetPublishedResourcesAction(formData: FormData) {
  const profile = await requireRole(['admin', 'teacher'])
  const supabase = await createSupabaseServerClient()

  const ids = parseIds(formData, 'resource_ids')
  if (!ids.length) redirect('/dashboard/resources')

  const publishedAt = new Date().toISOString()

  let query = supabase
    .from('resources')
    .update({ status: 'published', published_at: publishedAt })
    .in('id', ids)

  if (profile.role === 'teacher') {
    query = query.eq('created_by', profile.id)
  }

  const { error } = await query
  if (error) throw error

  redirect('/dashboard/resources')
}

export async function bulkDeleteResourcesAction(formData: FormData) {
  const profile = await requireRole(['admin', 'teacher'])
  const supabase = await createSupabaseServerClient()

  const ids = parseIds(formData, 'resource_ids')
  if (!ids.length) redirect('/dashboard/resources')

  const { data: printables, error: printableError } = await supabase
    .from('printable_materials')
    .select('file_url')
    .in('resource_id', ids)

  if (printableError) throw printableError

  const toRemove = (printables ?? []).map((p) => p.file_url).filter(Boolean)
  if (toRemove.length) {
    const { error: storageError } = await supabase.storage.from('printable-materials').remove(toRemove)
    if (storageError) throw storageError
  }

  let deleteQuery = supabase.from('resources').delete().in('id', ids)
  if (profile.role === 'teacher') {
    deleteQuery = deleteQuery.eq('created_by', profile.id)
  }

  const { error: deleteError } = await deleteQuery
  if (deleteError) throw deleteError

  redirect('/dashboard/resources')
}

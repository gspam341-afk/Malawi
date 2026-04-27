'use server'

import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/auth'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function createSubjectAction(formData: FormData) {
  await requireAdmin()
  const supabase = await createSupabaseServerClient()

  const name = String(formData.get('name') ?? '').trim()
  const description = String(formData.get('description') ?? '').trim()

  if (!name) throw new Error('Name is required')

  const { error } = await supabase.from('subjects').insert({ name, description: description || null })
  if (error) throw error

  redirect('/dashboard/subjects')
}

export async function updateSubjectAction(formData: FormData) {
  await requireAdmin()
  const supabase = await createSupabaseServerClient()

  const id = String(formData.get('id') ?? '')
  const name = String(formData.get('name') ?? '').trim()
  const description = String(formData.get('description') ?? '').trim()

  if (!id || !name) redirect('/dashboard/subjects')

  const { error } = await supabase.from('subjects').update({ name, description: description || null }).eq('id', id)
  if (error) throw error

  redirect('/dashboard/subjects')
}

export async function deleteSubjectAction(formData: FormData) {
  await requireAdmin()
  const supabase = await createSupabaseServerClient()

  const id = String(formData.get('id') ?? '')
  if (!id) redirect('/dashboard/subjects')

  const { count, error: countError } = await supabase
    .from('resource_subjects')
    .select('*', { count: 'exact', head: true })
    .eq('subject_id', id)

  if (countError) throw countError

  if ((count ?? 0) > 0) {
    redirect('/dashboard/subjects?error=Subject%20is%20in%20use%20and%20cannot%20be%20deleted')
  }

  const { error } = await supabase.from('subjects').delete().eq('id', id)
  if (error) throw error

  redirect('/dashboard/subjects')
}

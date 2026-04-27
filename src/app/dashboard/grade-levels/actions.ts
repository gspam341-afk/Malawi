'use server'

import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/auth'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function createGradeLevelAction(formData: FormData) {
  await requireAdmin()
  const supabase = await createSupabaseServerClient()

  const name = String(formData.get('name') ?? '').trim()
  const gradeNumber = Number(formData.get('grade_number') ?? NaN)
  const description = String(formData.get('description') ?? '').trim()

  if (!name || !Number.isFinite(gradeNumber)) throw new Error('Name and grade_number are required')

  const { error } = await supabase
    .from('grade_levels')
    .insert({ name, grade_number: gradeNumber, description: description || null })

  if (error) throw error

  redirect('/dashboard/grade-levels')
}

export async function updateGradeLevelAction(formData: FormData) {
  await requireAdmin()
  const supabase = await createSupabaseServerClient()

  const id = String(formData.get('id') ?? '')
  const name = String(formData.get('name') ?? '').trim()
  const gradeNumber = Number(formData.get('grade_number') ?? NaN)
  const description = String(formData.get('description') ?? '').trim()

  if (!id || !name || !Number.isFinite(gradeNumber)) redirect('/dashboard/grade-levels')

  const { error } = await supabase
    .from('grade_levels')
    .update({ name, grade_number: gradeNumber, description: description || null })
    .eq('id', id)

  if (error) throw error

  redirect('/dashboard/grade-levels')
}

export async function deleteGradeLevelAction(formData: FormData) {
  await requireAdmin()
  const supabase = await createSupabaseServerClient()

  const id = String(formData.get('id') ?? '')
  if (!id) redirect('/dashboard/grade-levels')

  const { count, error: countError } = await supabase
    .from('resource_grade_levels')
    .select('*', { count: 'exact', head: true })
    .eq('grade_level_id', id)

  if (countError) throw countError

  if ((count ?? 0) > 0) {
    redirect('/dashboard/grade-levels?error=Grade%20level%20is%20in%20use%20and%20cannot%20be%20deleted')
  }

  const { error } = await supabase.from('grade_levels').delete().eq('id', id)
  if (error) throw error

  redirect('/dashboard/grade-levels')
}

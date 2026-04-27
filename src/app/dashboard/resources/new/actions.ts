'use server'

import { redirect } from 'next/navigation'
import { requireRole } from '@/lib/auth'
import { createSupabaseServerClient } from '@/lib/supabase/server'

function parseIds(formData: FormData, key: string) {
  return formData.getAll(key).map((v) => String(v)).filter(Boolean)
}

export async function createResourceAction(formData: FormData) {
  const profile = await requireRole(['admin', 'teacher'])
  const supabase = await createSupabaseServerClient()

  const title = String(formData.get('title') ?? '').trim()
  if (!title) {
    throw new Error('Title is required')
  }

  const statusFromForm = String(formData.get('status') ?? 'draft')
  const status = profile.role === 'admin' ? statusFromForm : statusFromForm === 'published' ? 'pending' : statusFromForm

  const visibility = String(formData.get('visibility') ?? 'public')
  const resource_type = String(formData.get('resource_type') ?? 'activity_idea')

  const payload = {
    title,
    description: String(formData.get('description') ?? '') || null,
    result_description: String(formData.get('result_description') ?? '') || null,
    activity_type: String(formData.get('activity_type') ?? '') || null,
    preparation_time: String(formData.get('preparation_time') ?? '') || null,
    activity_duration: String(formData.get('activity_duration') ?? '') || null,
    group_size_min: formData.get('group_size_min') ? Number(formData.get('group_size_min')) : null,
    group_size_max: formData.get('group_size_max') ? Number(formData.get('group_size_max')) : null,
    difficulty_level: String(formData.get('difficulty_level') ?? '') || null,
    print_required: formData.get('print_required') === 'on',
    cutting_required: formData.get('cutting_required') === 'on',
    extra_materials_required: formData.get('extra_materials_required') === 'on',
    resource_type,
    visibility,
    status,
    created_by: profile.id,
    published_at: profile.role === 'admin' && status === 'published' ? new Date().toISOString() : null,
  }

  const { data: inserted, error: insertError } = await supabase
    .from('resources')
    .insert(payload)
    .select('id')
    .single()

  if (insertError) throw insertError

  const resourceId = inserted.id as string

  const subjectIds = parseIds(formData, 'subject_ids')
  const gradeLevelIds = parseIds(formData, 'grade_level_ids')

  if (subjectIds.length) {
    const { error } = await supabase.from('resource_subjects').insert(
      subjectIds.map((subject_id) => ({
        resource_id: resourceId,
        subject_id,
      })),
    )
    if (error) throw error
  }

  if (gradeLevelIds.length) {
    const { error } = await supabase.from('resource_grade_levels').insert(
      gradeLevelIds.map((grade_level_id) => ({
        resource_id: resourceId,
        grade_level_id,
      })),
    )
    if (error) throw error
  }

  redirect('/dashboard/resources')
}

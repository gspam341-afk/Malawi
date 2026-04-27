'use server'

import { redirect } from 'next/navigation'
import { requireRole } from '@/lib/auth'
import { createSupabaseServerClient } from '@/lib/supabase/server'

function parseIds(formData: FormData, key: string) {
  return formData.getAll(key).map((v) => String(v)).filter(Boolean)
}

type RequiredMaterialInsert = {
  name: string
  quantity: number | null
  is_optional: boolean
  provided_in_template: boolean
  note: string | null
}

function parseRequiredMaterialsJson(formData: FormData) {
  const raw = formData.get('required_materials_json')
  if (!raw) return [] as RequiredMaterialInsert[]

  let parsed: unknown
  try {
    parsed = JSON.parse(String(raw))
  } catch {
    return [] as RequiredMaterialInsert[]
  }

  if (!Array.isArray(parsed)) return [] as RequiredMaterialInsert[]

  const materials: RequiredMaterialInsert[] = []
  for (const item of parsed) {
    if (!item || typeof item !== 'object') continue
    const obj = item as Record<string, unknown>

    const name = String(obj.name ?? '').trim()
    if (!name) continue

    const quantity =
      obj.quantity === null || obj.quantity === undefined || obj.quantity === '' ? null : Number(obj.quantity)

    materials.push({
      name,
      quantity: Number.isFinite(quantity as number) ? (quantity as number) : null,
      is_optional: Boolean(obj.is_optional),
      provided_in_template: Boolean(obj.provided_in_template),
      note: String(obj.note ?? '').trim() || null,
    })
  }

  return materials
}

export async function updateResourceAction(resourceId: string, formData: FormData) {
  const profile = await requireRole(['admin', 'teacher'])
  const supabase = await createSupabaseServerClient()

  const { data: resource, error: resourceError } = await supabase
    .from('resources')
    .select('id, created_by')
    .eq('id', resourceId)
    .single()

  if (resourceError) throw resourceError

  if (profile.role === 'teacher' && resource.created_by !== profile.id) {
    throw new Error('Access denied')
  }

  const title = String(formData.get('title') ?? '').trim()
  if (!title) throw new Error('Title is required')

  const status = String(formData.get('status') ?? 'draft')

  const visibility = String(formData.get('visibility') ?? 'public')

  const subjectIds = parseIds(formData, 'subject_ids')
  const gradeLevelIds = parseIds(formData, 'grade_level_ids')

  const requiredMaterials = parseRequiredMaterialsJson(formData)
  const hasNoExtraMaterials = requiredMaterials.some((m) => m.name.trim().toLowerCase() === 'no extra materials')

  const { data: existing, error: existingError } = await supabase
    .from('resources')
    .select('status, published_at')
    .eq('id', resourceId)
    .single()

  if (existingError) throw existingError

  const nextPublishedAt =
    status === 'published'
      ? existing.published_at ?? new Date().toISOString()
      : null

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
    resource_type,
    print_required: formData.get('print_required') === 'on',
    cutting_required: formData.get('cutting_required') === 'on',
    extra_materials_required: hasNoExtraMaterials ? false : formData.get('extra_materials_required') === 'on',
    visibility,
    status,
    published_at: nextPublishedAt,
  }

  const { error: updateError } = await supabase.from('resources').update(payload).eq('id', resourceId)
  if (updateError) throw updateError

  const { error: deleteSubjectsError } = await supabase.from('resource_subjects').delete().eq('resource_id', resourceId)
  if (deleteSubjectsError) throw deleteSubjectsError

  if (subjectIds.length) {
    const { error } = await supabase.from('resource_subjects').insert(
      subjectIds.map((subject_id) => ({
        resource_id: resourceId,
        subject_id,
      })),
    )
    if (error) throw error
  }

  const { error: deleteGradesError } = await supabase
    .from('resource_grade_levels')
    .delete()
    .eq('resource_id', resourceId)
  if (deleteGradesError) throw deleteGradesError

  if (gradeLevelIds.length) {
    const { error } = await supabase.from('resource_grade_levels').insert(
      gradeLevelIds.map((grade_level_id) => ({
        resource_id: resourceId,
        grade_level_id,
      })),
    )
    if (error) throw error
  }

  const { error: deleteMaterialsError } = await supabase.from('required_materials').delete().eq('resource_id', resourceId)
  if (deleteMaterialsError) throw deleteMaterialsError

  if (requiredMaterials.length) {
    const toInsert = requiredMaterials.map((m) => ({
      resource_id: resourceId,
      name: m.name,
      quantity: m.quantity,
      is_optional: m.is_optional,
      provided_in_template: m.provided_in_template,
      note: m.note,
    }))

    const { error } = await supabase.from('required_materials').insert(toInsert)
    if (error) throw error
  }

  redirect(`/dashboard/resources/${resourceId}/edit`)
}

export async function updatePrintableMaterialAction(input: {
  resourceId: string
  printableId: string
  title: string
  description: string | null
  pagesCount: number | null
  colorRequired: boolean
  doubleSidedRecommended: boolean
  paperSize: string
}) {
  const profile = await requireRole(['admin', 'teacher'])
  const supabase = await createSupabaseServerClient()

  const { data: resource, error: resourceError } = await supabase
    .from('resources')
    .select('id, created_by')
    .eq('id', input.resourceId)
    .single()

  if (resourceError) throw resourceError

  if (profile.role === 'teacher' && resource.created_by !== profile.id) {
    throw new Error('Access denied')
  }

  const title = input.title.trim()
  if (!title) throw new Error('Title is required')

  const { error } = await supabase
    .from('printable_materials')
    .update({
      title,
      description: input.description?.trim() || null,
      pages_count: input.pagesCount,
      color_required: input.colorRequired,
      double_sided_recommended: input.doubleSidedRecommended,
      paper_size: input.paperSize,
    })
    .eq('id', input.printableId)
    .eq('resource_id', input.resourceId)

  if (error) throw error
}

export async function deleteResourceAction(resourceId: string) {
  const profile = await requireRole(['admin', 'teacher'])
  const supabase = await createSupabaseServerClient()

  const { data: resource, error: resourceError } = await supabase
    .from('resources')
    .select('id, created_by')
    .eq('id', resourceId)
    .single()

  if (resourceError) throw resourceError

  if (profile.role === 'teacher' && resource.created_by !== profile.id) {
    throw new Error('Access denied')
  }

  const { data: printables, error: printableError } = await supabase
    .from('printable_materials')
    .select('file_url')
    .eq('resource_id', resourceId)

  if (printableError) throw printableError

  const toRemove = (printables ?? []).map((p) => p.file_url).filter(Boolean)
  if (toRemove.length) {
    const { error: storageError } = await supabase.storage.from('printable-materials').remove(toRemove)
    if (storageError) throw storageError
  }

  const { error: deleteError } = await supabase.from('resources').delete().eq('id', resourceId)
  if (deleteError) throw deleteError

  redirect('/dashboard/resources')
}

export async function deletePrintableMaterialAction(input: { resourceId: string; printableId: string }) {
  const profile = await requireRole(['admin', 'teacher'])
  const supabase = await createSupabaseServerClient()

  const { data: resource, error: resourceError } = await supabase
    .from('resources')
    .select('id, created_by')
    .eq('id', input.resourceId)
    .single()

  if (resourceError) throw resourceError

  if (profile.role === 'teacher' && resource.created_by !== profile.id) {
    throw new Error('Access denied')
  }

  const { data: row, error: rowError } = await supabase
    .from('printable_materials')
    .select('id, file_url')
    .eq('id', input.printableId)
    .eq('resource_id', input.resourceId)
    .single()

  if (rowError) throw rowError

  const { error: storageError } = await supabase.storage.from('printable-materials').remove([row.file_url])
  if (storageError) throw storageError

  const { error } = await supabase
    .from('printable_materials')
    .delete()
    .eq('id', input.printableId)
    .eq('resource_id', input.resourceId)

  if (error) throw error
}

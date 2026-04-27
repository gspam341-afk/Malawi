import { createSupabaseServerClient } from '@/lib/supabase/server'
import type { ResourceDetail, ResourceListItem, Tables } from '@/types/db'

type ResourceWithJoinsRaw = Tables['resources']['Row'] & {
  grade_levels: { grade_level: { id: string; name: string; grade_number: number } }[] | null
  subjects: { subject: { id: string; name: string } }[] | null
  required_materials: { name: string; quantity: number | null }[] | null
}

type ResourceDetailRaw = Tables['resources']['Row'] & {
  grade_levels: { grade_level: { id: string; name: string; grade_number: number } }[] | null
  subjects: { subject: { id: string; name: string } }[] | null
  required_materials:
    | {
        id: string
        name: string
        quantity: number | null
        is_optional: boolean
        provided_in_template: boolean
        note: string | null
      }[]
    | null
  printable_materials:
    | {
        id: string
        title: string
        description: string | null
        file_url: string
        file_type: string | null
        pages_count: number | null
        color_required: boolean
        double_sided_recommended: boolean
        paper_size: string
        created_at: string
      }[]
    | null
}

export async function getGradeLevels() {
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase
    .from('grade_levels')
    .select('id,name,grade_number')
    .order('grade_number', { ascending: true })

  if (error) throw error
  return (data ?? []) as Tables['grade_levels']['Row'][]
}

export async function getSubjects() {
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase
    .from('subjects')
    .select('id,name')
    .order('name', { ascending: true })

  if (error) throw error
  return (data ?? []) as Tables['subjects']['Row'][]
}

export type PublicResourceFilters = {
  q?: string
  grade?: string
  subject?: string
  print_required?: boolean
  extra_materials_required?: boolean
}

export async function getPublicResources(filters: PublicResourceFilters) {
  const supabase = await createSupabaseServerClient()

  let query = supabase
    .from('resources')
    .select(
      `
        id,
        title,
        description,
        activity_type,
        result_description,
        preparation_time,
        activity_duration,
        group_size_min,
        group_size_max,
        difficulty_level,
        print_required,
        cutting_required,
        extra_materials_required,
        resource_type,
        visibility,
        status,
        created_by,
        approved_by,
        rejection_reason,
        created_at,
        updated_at,
        published_at,
        grade_levels:resource_grade_levels(grade_level:grade_levels(id,name,grade_number)),
        subjects:resource_subjects(subject:subjects(id,name)),
        required_materials(name,quantity)
      `,
    )
    .eq('status', 'published')
    .eq('visibility', 'public')
    .order('published_at', { ascending: false, nullsFirst: false })

  if (filters.print_required !== undefined) {
    query = query.eq('print_required', filters.print_required)
  }

  if (filters.extra_materials_required !== undefined) {
    query = query.eq('extra_materials_required', filters.extra_materials_required)
  }

  if (filters.q) {
    const q = filters.q.trim()
    if (q) {
      query = query.or(`title.ilike.%${q}%,description.ilike.%${q}%`)
    }
  }

  if (filters.grade) {
    query = query.eq('resource_grade_levels.grade_level_id', filters.grade)
  }

  if (filters.subject) {
    query = query.eq('resource_subjects.subject_id', filters.subject)
  }

  const { data, error } = await query
  if (error) throw error

  const rows = (data ?? []) as unknown as ResourceWithJoinsRaw[]
  const mapped: ResourceListItem[] = rows.map((r) => ({
    ...r,
    grade_levels: (r.grade_levels ?? []).map((x) => x.grade_level),
    subjects: (r.subjects ?? []).map((x) => x.subject),
    required_materials: r.required_materials ?? [],
  }))

  return mapped
}

export async function getPublicResourceById(id: string) {
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase
    .from('resources')
    .select(
      `
        id,
        title,
        description,
        activity_type,
        result_description,
        preparation_time,
        activity_duration,
        group_size_min,
        group_size_max,
        difficulty_level,
        print_required,
        cutting_required,
        extra_materials_required,
        resource_type,
        visibility,
        status,
        created_by,
        approved_by,
        rejection_reason,
        created_at,
        updated_at,
        published_at,
        grade_levels:resource_grade_levels(grade_level:grade_levels(id,name,grade_number)),
        subjects:resource_subjects(subject:subjects(id,name)),
        required_materials(id,name,quantity,is_optional,provided_in_template,note),
        printable_materials(id,title,description,file_url,file_type,pages_count,color_required,double_sided_recommended,paper_size,created_at)
      `,
    )
    .eq('id', id)
    .single()

  if (error) throw error

  const row = data as unknown as ResourceDetailRaw

  const mapped: ResourceDetail = {
    ...row,
    grade_levels: (row.grade_levels ?? []).map((x) => x.grade_level),
    subjects: (row.subjects ?? []).map((x) => x.subject),
    required_materials: row.required_materials ?? [],
    printable_materials: row.printable_materials ?? [],
  }

  return mapped
}

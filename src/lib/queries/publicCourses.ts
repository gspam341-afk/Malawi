import { createSupabaseServerClient } from '@/lib/supabase/server'
import type { Tables } from '@/types/db'

export type PublicCourseListItem = Tables['courses']['Row'] & {
  subject: Pick<Tables['subjects']['Row'], 'id' | 'name'>
  grade_level: Pick<Tables['grade_levels']['Row'], 'id' | 'name' | 'grade_number'>
}

export type CourseUnitWithLessons = Tables['course_units']['Row'] & {
  lessons: Pick<
    Tables['lessons']['Row'],
    'id' | 'title' | 'slug' | 'description' | 'lesson_type' | 'sort_order' | 'status'
  >[]
}

export type PublicCourseDetail = Tables['courses']['Row'] & {
  subject: Pick<Tables['subjects']['Row'], 'id' | 'name'>
  grade_level: Pick<Tables['grade_levels']['Row'], 'id' | 'name' | 'grade_number'>
  course_units: CourseUnitWithLessons[]
}

export type PublicFilters = {
  subjectId?: string
  gradeId?: string
  q?: string
  limit?: number
}

export async function getPublicCourses(filters: PublicFilters = {}) {
  const supabase = await createSupabaseServerClient()
  let q = supabase
    .from('courses')
    .select('*, subject:subjects(id,name), grade_level:grade_levels(id,name,grade_number)')
    .eq('status', 'published')
    .eq('visibility', 'public')
    .order('published_at', { ascending: false, nullsFirst: false })
    .order('updated_at', { ascending: false })

  if (filters.subjectId) q = q.eq('subject_id', filters.subjectId)
  if (filters.gradeId) q = q.eq('grade_level_id', filters.gradeId)
  if (filters.q?.trim()) {
    const s = filters.q.trim().replace(/%/g, '').replace(/,/g, ' ').slice(0, 100)
    if (s.length) q = q.or(`title.ilike.%${s}%,description.ilike.%${s}%`)
  }
  if (filters.limit) q = q.limit(filters.limit)

  const { data, error } = await q
  if (error) throw error
  return (data ?? []) as PublicCourseListItem[]
}

export async function getLatestPublishedCourses(limit = 3) {
  return getPublicCourses({ limit })
}

export async function getPublicCoursesForSubjectIds(subjectIds: string[]) {
  if (!subjectIds.length) return [] as PublicCourseListItem[]
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from('courses')
    .select('*, subject:subjects(id,name), grade_level:grade_levels(id,name,grade_number)')
    .eq('status', 'published')
    .eq('visibility', 'public')
    .in('subject_id', subjectIds)
    .order('published_at', { ascending: false, nullsFirst: false })
    .order('updated_at', { ascending: false })

  if (error) throw error
  return (data ?? []) as PublicCourseListItem[]
}

export async function getPublishedCourseBySlug(slug: string): Promise<PublicCourseDetail | null> {
  const supabase = await createSupabaseServerClient()
  const { data: course, error } = await supabase
    .from('courses')
    .select(
      `
      *,
      subject:subjects(id,name),
      grade_level:grade_levels(id,name,grade_number),
      course_units(
        id, course_id, title, description, sort_order, created_at, updated_at,
        lessons(id, unit_id, course_id, title, slug, description, lesson_type, sort_order, status, published_at)
      )
    `,
    )
    .eq('slug', slug)
    .eq('status', 'published')
    .eq('visibility', 'public')
    .maybeSingle()

  if (error) throw error
  if (!course) return null

  const row = course as unknown as PublicCourseDetail
  const units = [...(row.course_units ?? [])].sort((a, b) => a.sort_order - b.sort_order || a.title.localeCompare(b.title))
  for (const u of units) {
    u.lessons = (u.lessons ?? [])
      .filter((l) => l.status === 'published')
      .sort((a, b) => a.sort_order - b.sort_order || a.title.localeCompare(b.title))
  }
  return { ...row, course_units: units }
}

const uuidRe = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export async function getPublishedLessonInCourse(courseSlug: string, lessonRef: string) {
  const course = await getPublishedCourseBySlug(courseSlug)
  if (!course) return null

  const supabase = await createSupabaseServerClient()
  let query = supabase
    .from('lessons')
    .select(
      `
      *,
      unit:course_units(id, title, sort_order)
    `,
    )
    .eq('course_id', course.id)
    .eq('status', 'published')

  if (uuidRe.test(lessonRef)) query = query.eq('id', lessonRef)
  else query = query.eq('slug', lessonRef)

  const { data: lesson, error } = await query.maybeSingle()
  if (error) throw error
  if (!lesson) return null

  const { data: links, error: lrErr } = await supabase
    .from('lesson_resources')
    .select('resource_id, sort_order')
    .eq('lesson_id', (lesson as Tables['lessons']['Row']).id)
    .order('sort_order', { ascending: true })

  if (lrErr) throw lrErr
  const resourceIds = (links ?? []).map((r) => r.resource_id)

  return {
    course,
    lesson: lesson as Tables['lessons']['Row'] & {
      unit: { id: string; title: string; sort_order: number }
    },
    resourceIds,
    resourceSort: new Map((links ?? []).map((l) => [l.resource_id, l.sort_order])),
  }
}

'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requireRole, requireUser } from '@/lib/auth'
import { slugify } from '@/lib/slugify'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import type { CourseStatus, LessonStatus, LessonType, Tables } from '@/types/db'

function rev() {
  revalidatePath('/courses')
  revalidatePath('/')
  revalidatePath('/stem/science')
  revalidatePath('/stem/engineering')
  revalidatePath('/stem/mathematics')
}

async function assertCourseAccess(supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>, courseId: string) {
  const profile = await requireRole(['admin', 'teacher'])
  if (profile.role === 'admin') return profile
  const { data, error } = await supabase.from('courses').select('id, created_by').eq('id', courseId).single()
  if (error) throw error
  if (!data || data.created_by !== profile.id) throw new Error('Forbidden')
  return profile
}

async function uniqueCourseSlug(supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>, base: string) {
  let candidate = base
  for (let i = 0; i < 20; i++) {
    const { data, error } = await supabase.from('courses').select('id').eq('slug', candidate).maybeSingle()
    if (error) throw error
    if (!data) return candidate
    candidate = `${base}-${i + 2}`
  }
  return `${base}-${Date.now()}`
}

export async function createCourseAction(formData: FormData) {
  await requireRole(['admin', 'teacher'])
  const user = await requireUser()
  const supabase = await createSupabaseServerClient()

  const title = String(formData.get('title') ?? '').trim()
  if (!title) redirect('/dashboard/courses/new?error=missing-title')

  const slugInput = String(formData.get('slug') ?? '').trim()
  const baseSlug = slugify(slugInput || title)
  const slug = await uniqueCourseSlug(supabase, baseSlug)

  const description = String(formData.get('description') ?? '').trim() || null
  const subject_id = String(formData.get('subject_id') ?? '')
  const grade_level_id = String(formData.get('grade_level_id') ?? '')
  const status = (String(formData.get('status') ?? 'draft') || 'draft') as CourseStatus
  const visibility = (String(formData.get('visibility') ?? 'public') || 'public') as Tables['courses']['Row']['visibility']

  if (!subject_id || !grade_level_id) redirect('/dashboard/courses/new?error=missing-fields')

  const row: Tables['courses']['Insert'] = {
    title,
    slug,
    description,
    subject_id,
    grade_level_id,
    status,
    visibility,
    created_by: user.id,
    published_at: status === 'published' ? new Date().toISOString() : null,
  }

  const { data, error } = await supabase.from('courses').insert(row).select('id').single()
  if (error) redirect(`/dashboard/courses/new?error=${encodeURIComponent(error.message)}`)

  rev()
  redirect(`/dashboard/courses/${data.id}/edit`)
}

export async function updateCourseAction(formData: FormData) {
  const supabase = await createSupabaseServerClient()
  const courseId = String(formData.get('course_id') ?? '')
  if (!courseId) redirect('/dashboard/courses')
  await assertCourseAccess(supabase, courseId)

  const title = String(formData.get('title') ?? '').trim()
  const slug = String(formData.get('slug') ?? '').trim()
  const description = String(formData.get('description') ?? '').trim() || null
  const subject_id = String(formData.get('subject_id') ?? '')
  const grade_level_id = String(formData.get('grade_level_id') ?? '')
  const status = String(formData.get('status') ?? 'draft') as CourseStatus
  const visibility = String(formData.get('visibility') ?? 'public') as Tables['courses']['Row']['visibility']

  const { data: existing } = await supabase.from('courses').select('published_at').eq('id', courseId).maybeSingle()
  const published_at =
    status === 'published' ? (existing?.published_at ?? new Date().toISOString()) : null

  const { error } = await supabase
    .from('courses')
    .update({
      title,
      slug,
      description,
      subject_id,
      grade_level_id,
      status,
      visibility,
      published_at,
    })
    .eq('id', courseId)

  if (error) throw error
  rev()
  redirect(`/dashboard/courses/${courseId}/edit`)
}

export async function setCourseStatusAction(formData: FormData) {
  const supabase = await createSupabaseServerClient()
  const courseId = String(formData.get('course_id') ?? '')
  const status = String(formData.get('status') ?? '') as CourseStatus
  if (!courseId || !['draft', 'published', 'archived'].includes(status)) redirect('/dashboard/courses')
  await assertCourseAccess(supabase, courseId)

  const published_at = status === 'published' ? new Date().toISOString() : null
  const { error } = await supabase
    .from('courses')
    .update({ status, published_at: status === 'published' ? published_at : null })
    .eq('id', courseId)
  if (error) throw error
  rev()
  redirect(`/dashboard/courses/${courseId}/edit`)
}

export async function createUnitAction(formData: FormData) {
  const supabase = await createSupabaseServerClient()
  const courseId = String(formData.get('course_id') ?? '')
  if (!courseId) redirect('/dashboard/courses')
  await assertCourseAccess(supabase, courseId)

  const title = String(formData.get('title') ?? '').trim()
  if (!title) redirect(`/dashboard/courses/${courseId}/edit?error=unit-title`)

  const description = String(formData.get('description') ?? '').trim() || null
  const sort_order = Number(formData.get('sort_order') ?? 0) || 0

  const { error } = await supabase.from('course_units').insert({ course_id: courseId, title, description, sort_order })
  if (error) throw error
  rev()
  redirect(`/dashboard/courses/${courseId}/edit`)
}

export async function updateUnitAction(formData: FormData) {
  const supabase = await createSupabaseServerClient()
  const unitId = String(formData.get('unit_id') ?? '')
  const courseId = String(formData.get('course_id') ?? '')
  if (!unitId || !courseId) redirect('/dashboard/courses')
  await assertCourseAccess(supabase, courseId)

  const title = String(formData.get('title') ?? '').trim()
  const description = String(formData.get('description') ?? '').trim() || null
  const sort_order = Number(formData.get('sort_order') ?? 0) || 0

  const { error } = await supabase
    .from('course_units')
    .update({ title, description, sort_order })
    .eq('id', unitId)
    .eq('course_id', courseId)
  if (error) throw error
  rev()
  redirect(`/dashboard/courses/${courseId}/edit`)
}

export async function deleteUnitAction(formData: FormData) {
  const supabase = await createSupabaseServerClient()
  const unitId = String(formData.get('unit_id') ?? '')
  const courseId = String(formData.get('course_id') ?? '')
  if (!unitId || !courseId) redirect('/dashboard/courses')
  await assertCourseAccess(supabase, courseId)

  const { error } = await supabase.from('course_units').delete().eq('id', unitId).eq('course_id', courseId)
  if (error) throw error
  rev()
  redirect(`/dashboard/courses/${courseId}/edit`)
}

export async function createLessonAction(formData: FormData) {
  const supabase = await createSupabaseServerClient()
  const user = await requireUser()
  const courseId = String(formData.get('course_id') ?? '')
  const unitId = String(formData.get('unit_id') ?? '')
  if (!courseId || !unitId) redirect('/dashboard/courses')

  await assertCourseAccess(supabase, courseId)

  const title = String(formData.get('title') ?? '').trim()
  if (!title) redirect(`/dashboard/courses/${courseId}/lessons/new?unitId=${unitId}&error=title`)

  let slug = String(formData.get('slug') ?? '').trim() || null
  if (slug) slug = slugify(slug)

  const description = String(formData.get('description') ?? '').trim() || null
  const content = String(formData.get('content') ?? '').trim() || null
  const lesson_type = (String(formData.get('lesson_type') ?? 'article') || 'article') as LessonType
  const sort_order = Number(formData.get('sort_order') ?? 0) || 0
  const status = (String(formData.get('status') ?? 'draft') || 'draft') as LessonStatus

  const { data: unitRow, error: uErr } = await supabase.from('course_units').select('course_id').eq('id', unitId).single()
  if (uErr || !unitRow || unitRow.course_id !== courseId) redirect(`/dashboard/courses/${courseId}/edit`)

  const insert: Tables['lessons']['Insert'] = {
    unit_id: unitId,
    title,
    slug,
    description,
    content,
    lesson_type,
    sort_order,
    status,
    created_by: user.id,
    published_at: status === 'published' ? new Date().toISOString() : null,
  }

  const { data, error } = await supabase.from('lessons').insert(insert).select('id').single()
  if (error) redirect(`/dashboard/courses/${courseId}/lessons/new?unitId=${unitId}&error=${encodeURIComponent(error.message)}`)

  rev()
  redirect(`/dashboard/courses/${courseId}/lessons/${data.id}/edit`)
}

export async function updateLessonAction(formData: FormData) {
  const supabase = await createSupabaseServerClient()
  const courseId = String(formData.get('course_id') ?? '')
  const lessonId = String(formData.get('lesson_id') ?? '')
  if (!courseId || !lessonId) redirect('/dashboard/courses')
  await assertCourseAccess(supabase, courseId)

  const unitId = String(formData.get('unit_id') ?? '')
  const title = String(formData.get('title') ?? '').trim()
  let slug = String(formData.get('slug') ?? '').trim() || null
  if (slug) slug = slugify(slug)
  const description = String(formData.get('description') ?? '').trim() || null
  const content = String(formData.get('content') ?? '').trim() || null
  const lesson_type = String(formData.get('lesson_type') ?? 'article') as LessonType
  const sort_order = Number(formData.get('sort_order') ?? 0) || 0
  const status = String(formData.get('status') ?? 'draft') as LessonStatus

  const { data: prevLesson } = await supabase.from('lessons').select('published_at').eq('id', lessonId).maybeSingle()
  const published_at =
    status === 'published' ? (prevLesson?.published_at ?? new Date().toISOString()) : null

  const { error } = await supabase
    .from('lessons')
    .update({
      unit_id: unitId,
      title,
      slug,
      description,
      content,
      lesson_type,
      sort_order,
      status,
      published_at,
    })
    .eq('id', lessonId)
    .eq('course_id', courseId)

  if (error) throw error

  const ids = formData.getAll('resource_id').map(String).filter(Boolean)
  await supabase.from('lesson_resources').delete().eq('lesson_id', lessonId)
  if (ids.length) {
    const rows = ids.map((resource_id, i) => ({
      lesson_id: lessonId,
      resource_id,
      sort_order: i,
    }))
    const { error: lrErr } = await supabase.from('lesson_resources').insert(rows)
    if (lrErr) throw lrErr
  }

  rev()
  redirect(`/dashboard/courses/${courseId}/lessons/${lessonId}/edit`)
}

export async function deleteLessonAction(formData: FormData) {
  const supabase = await createSupabaseServerClient()
  const courseId = String(formData.get('course_id') ?? '')
  const lessonId = String(formData.get('lesson_id') ?? '')
  if (!courseId || !lessonId) redirect('/dashboard/courses')
  await assertCourseAccess(supabase, courseId)

  const { error } = await supabase.from('lessons').delete().eq('id', lessonId).eq('course_id', courseId)
  if (error) throw error
  rev()
  redirect(`/dashboard/courses/${courseId}/edit`)
}

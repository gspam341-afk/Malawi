import Link from 'next/link'
import { notFound } from 'next/navigation'
import { BookOpen } from 'lucide-react'
import { requireProfile } from '@/lib/auth'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { deleteLessonAction, updateLessonAction } from '@/app/dashboard/courses/actions'
import { AdminPageHeader } from '@/components/dashboard/AdminPageHeader'
import { FieldLabel } from '@/components/dashboard/FieldLabel'
import { FormSection } from '@/components/dashboard/FormSection'
import { SecondaryButton } from '@/components/dashboard/ActionButton'
import { dashCheckbox, dashInput, dashSelect } from '@/components/dashboard/classes'

type Props = { params: Promise<{ id: string; lessonId: string }> }

export default async function EditLessonPage({ params }: Props) {
  const profile = await requireProfile()
  if (profile.role !== 'admin' && profile.role !== 'teacher') notFound()

  const { id: courseId, lessonId } = await params
  const supabase = await createSupabaseServerClient()

  const { data: course, error: cErr } = await supabase.from('courses').select('id,title,created_by').eq('id', courseId).single()
  if (cErr || !course) notFound()
  if (profile.role === 'teacher' && course.created_by !== profile.id) notFound()

  const { data: lesson, error: lErr } = await supabase
    .from('lessons')
    .select('id,unit_id,title,slug,description,content,lesson_type,sort_order,status')
    .eq('id', lessonId)
    .eq('course_id', courseId)
    .maybeSingle()
  if (lErr || !lesson) notFound()

  const { data: units } = await supabase.from('course_units').select('id,title').eq('course_id', courseId).order('sort_order')
  const unitList = units ?? []

  let resQuery = supabase.from('resources').select('id,title,status').order('title')
  if (profile.role === 'teacher') {
    resQuery = resQuery.eq('created_by', profile.id)
  }
  const { data: resources } = await resQuery
  const resourceOptions = resources ?? []

  const { data: links } = await supabase.from('lesson_resources').select('resource_id').eq('lesson_id', lessonId)
  const selected = new Set((links ?? []).map((l) => l.resource_id))

  return (
    <div className="grid gap-10">
      <AdminPageHeader
        eyebrow={course.title}
        title="Edit lesson"
        description="Update content, publish when ready, and attach your published resources."
        titleIcon={BookOpen}
        actions={
          <Link href={`/dashboard/courses/${courseId}/edit`} className="text-sm font-medium text-jac-purple hover:underline">
            Back to course
          </Link>
        }
      />

      <FormSection title="Lesson details" icon={BookOpen}>
        <form action={updateLessonAction} className="grid max-w-3xl gap-5">
          <input type="hidden" name="course_id" value={courseId} />
          <input type="hidden" name="lesson_id" value={lessonId} />
          <div>
            <FieldLabel htmlFor="unit_id">Unit</FieldLabel>
            <select id="unit_id" name="unit_id" required defaultValue={lesson.unit_id} className={`${dashSelect} mt-2`}>
              {unitList.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.title}
                </option>
              ))}
            </select>
          </div>
          <div>
            <FieldLabel htmlFor="title">Title</FieldLabel>
            <input id="title" name="title" required defaultValue={lesson.title} className={`${dashInput} mt-2`} />
          </div>
          <div>
            <FieldLabel htmlFor="slug">Slug (public URL segment)</FieldLabel>
            <input id="slug" name="slug" defaultValue={lesson.slug ?? ''} className={`${dashInput} mt-2`} />
          </div>
          <div>
            <FieldLabel htmlFor="description">Short description</FieldLabel>
            <textarea
              id="description"
              name="description"
              rows={3}
              defaultValue={lesson.description ?? ''}
              className={`${dashInput} mt-2`}
            />
          </div>
          <div>
            <FieldLabel htmlFor="content">Content (Markdown)</FieldLabel>
            <textarea
              id="content"
              name="content"
              rows={14}
              defaultValue={lesson.content ?? ''}
              className={`${dashInput} mt-2 font-mono text-sm`}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <FieldLabel htmlFor="lesson_type">Lesson type</FieldLabel>
              <select
                id="lesson_type"
                name="lesson_type"
                defaultValue={lesson.lesson_type}
                className={`${dashSelect} mt-2`}
              >
                <option value="article">Article</option>
                <option value="video">Video</option>
                <option value="activity">Activity</option>
                <option value="worksheet">Worksheet</option>
                <option value="mixed">Mixed</option>
              </select>
            </div>
            <div>
              <FieldLabel htmlFor="sort_order">Sort order</FieldLabel>
              <input
                id="sort_order"
                name="sort_order"
                type="number"
                defaultValue={lesson.sort_order}
                className={`${dashInput} mt-2`}
              />
            </div>
          </div>
          <div>
            <FieldLabel htmlFor="status">Status</FieldLabel>
            <select id="status" name="status" defaultValue={lesson.status} className={`${dashSelect} mt-2`}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div>
            <FieldLabel hint="Only published resources you can manage are listed. TODO: richer picker and search.">
              Attached resources
            </FieldLabel>
            <ul className="mt-3 max-h-72 space-y-2 overflow-y-auto rounded-jac-md border border-jac-navy/10 p-3">
              {resourceOptions.length === 0 ? (
                <li className="text-sm text-jac-navy/60">No resources available. Publish an activity first.</li>
              ) : (
                resourceOptions.map((r) => (
                  <li key={r.id} className="flex items-start gap-2 text-sm">
                    <input
                      type="checkbox"
                      name="resource_id"
                      value={r.id}
                      defaultChecked={selected.has(r.id)}
                      className={dashCheckbox}
                    />
                    <span>
                      <span className="font-medium text-jac-navy">{r.title}</span>
                      <span className="ml-2 text-xs text-jac-navy/50">({r.status})</span>
                    </span>
                  </li>
                ))
              )}
            </ul>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              className="inline-flex rounded-full bg-jac-purple px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#6240b8]"
            >
              Save lesson
            </button>
          </div>
        </form>

        <form action={deleteLessonAction} className="mt-8 border-t border-jac-navy/10 pt-6">
          <input type="hidden" name="course_id" value={courseId} />
          <input type="hidden" name="lesson_id" value={lessonId} />
          <SecondaryButton type="submit">Delete lesson</SecondaryButton>
        </form>
      </FormSection>
    </div>
  )
}

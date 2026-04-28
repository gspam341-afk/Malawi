import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { BookOpen } from 'lucide-react'
import { requireProfile } from '@/lib/auth'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { createLessonAction } from '@/app/dashboard/courses/actions'
import { AdminPageHeader } from '@/components/dashboard/AdminPageHeader'
import { FieldLabel } from '@/components/dashboard/FieldLabel'
import { FormSection } from '@/components/dashboard/FormSection'
import { dashInput, dashSelect } from '@/components/dashboard/classes'

type Props = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ unitId?: string; error?: string }>
}

export default async function NewLessonPage({ params, searchParams }: Props) {
  const profile = await requireProfile()
  if (profile.role !== 'admin' && profile.role !== 'teacher') notFound()

  const { id: courseId } = await params
  const sp = await searchParams
  const unitId = sp.unitId
  if (!unitId) {
    redirect(`/dashboard/courses/${courseId}/edit`)
  }

  const supabase = await createSupabaseServerClient()
  const { data: course, error } = await supabase.from('courses').select('id,title,created_by').eq('id', courseId).single()
  if (error || !course) notFound()
  if (profile.role === 'teacher' && course.created_by !== profile.id) notFound()

  const { data: unit, error: uErr } = await supabase
    .from('course_units')
    .select('id,title,course_id')
    .eq('id', unitId)
    .single()
  if (uErr || !unit || unit.course_id !== courseId) notFound()

  return (
    <div className="grid gap-10">
      <AdminPageHeader
        eyebrow={course.title}
        title="New lesson"
        description={`Unit: ${unit.title}`}
        titleIcon={BookOpen}
        actions={
          <Link href={`/dashboard/courses/${courseId}/edit`} className="text-sm font-medium text-jac-purple hover:underline">
            Cancel
          </Link>
        }
      />

      {sp.error ? (
        <p className="rounded-jac-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">
          {decodeURIComponent(sp.error)}
        </p>
      ) : null}

      <FormSection title="Lesson" icon={BookOpen}>
        <form action={createLessonAction} className="grid max-w-2xl gap-5">
          <input type="hidden" name="course_id" value={courseId} />
          <input type="hidden" name="unit_id" value={unitId} />
          <div>
            <FieldLabel htmlFor="title">Title</FieldLabel>
            <input id="title" name="title" required className={`${dashInput} mt-2`} />
          </div>
          <div>
            <FieldLabel htmlFor="slug" hint="Used in the public URL. Leave blank to auto-generate from title.">
              Slug
            </FieldLabel>
            <input id="slug" name="slug" className={`${dashInput} mt-2`} />
          </div>
          <div>
            <FieldLabel htmlFor="description">Short description</FieldLabel>
            <textarea id="description" name="description" rows={3} className={`${dashInput} mt-2`} />
          </div>
          <div>
            <FieldLabel htmlFor="content">Content (Markdown)</FieldLabel>
            <textarea id="content" name="content" rows={12} className={`${dashInput} mt-2 font-mono text-sm`} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <FieldLabel htmlFor="lesson_type">Lesson type</FieldLabel>
              <select id="lesson_type" name="lesson_type" defaultValue="article" className={`${dashSelect} mt-2`}>
                <option value="article">Article</option>
                <option value="video">Video</option>
                <option value="activity">Activity</option>
                <option value="worksheet">Worksheet</option>
                <option value="mixed">Mixed</option>
              </select>
            </div>
            <div>
              <FieldLabel htmlFor="sort_order">Sort order</FieldLabel>
              <input id="sort_order" name="sort_order" type="number" defaultValue={0} className={`${dashInput} mt-2`} />
            </div>
          </div>
          <div>
            <FieldLabel htmlFor="status">Status</FieldLabel>
            <select id="status" name="status" defaultValue="draft" className={`${dashSelect} mt-2`}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          <button
            type="submit"
            className="inline-flex w-fit rounded-full bg-jac-purple px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#6240b8]"
          >
            Create lesson
          </button>
        </form>
      </FormSection>
    </div>
  )
}

import Link from 'next/link'
import { notFound } from 'next/navigation'
import { BookMarked, Layers, ListTree, PlusCircle } from 'lucide-react'
import { requireProfile } from '@/lib/auth'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import {
  createUnitAction,
  deleteUnitAction,
  setCourseStatusAction,
  updateCourseAction,
  updateUnitAction,
} from '@/app/dashboard/courses/actions'
import { AdminPageHeader } from '@/components/dashboard/AdminPageHeader'
import { FieldLabel } from '@/components/dashboard/FieldLabel'
import { FormSection } from '@/components/dashboard/FormSection'
import { SecondaryButton } from '@/components/dashboard/ActionButton'
import { dashInput, dashSelect } from '@/components/dashboard/classes'
import { getGradeLevels, getSubjects } from '@/lib/queries/publicResources'

type UnitRow = {
  id: string
  title: string
  description: string | null
  sort_order: number
  lessons: { id: string; title: string; slug: string | null; status: string; sort_order: number }[]
}

type Props = { params: Promise<{ id: string }> }

export default async function EditCoursePage({ params }: Props) {
  const profile = await requireProfile()
  if (profile.role !== 'admin' && profile.role !== 'teacher') notFound()

  const { id } = await params
  const supabase = await createSupabaseServerClient()

  const { data: course, error } = await supabase
    .from('courses')
    .select(
      `
      *,
      course_units (
        id, title, description, sort_order,
        lessons ( id, title, slug, status, sort_order )
      )
    `,
    )
    .eq('id', id)
    .maybeSingle()

  if (error || !course) notFound()
  if (profile.role === 'teacher' && course.created_by !== profile.id) notFound()

  const [subjects, gradeLevels] = await Promise.all([getSubjects(), getGradeLevels()])

  const units = [...((course as { course_units?: UnitRow[] }).course_units ?? [])].sort(
    (a, b) => a.sort_order - b.sort_order || a.title.localeCompare(b.title),
  )
  for (const u of units) {
    u.lessons = [...(u.lessons ?? [])].sort(
      (a, b) => a.sort_order - b.sort_order || a.title.localeCompare(b.title),
    )
  }

  return (
    <div className="grid gap-10">
      <AdminPageHeader
        eyebrow="Courses"
        title={course.title}
        description="Edit details, publish when ready, then add units and lessons."
        titleIcon={BookMarked}
        actions={
          <Link
            href="/dashboard/courses"
            className="text-sm font-medium text-jac-purple underline-offset-4 hover:underline"
          >
            Back to list
          </Link>
        }
      />

      <div className="flex flex-wrap gap-2">
        <form action={setCourseStatusAction}>
          <input type="hidden" name="course_id" value={id} />
          <input type="hidden" name="status" value="published" />
          <SecondaryButton type="submit" disabled={course.status === 'published'}>
            Publish
          </SecondaryButton>
        </form>
        <form action={setCourseStatusAction}>
          <input type="hidden" name="course_id" value={id} />
          <input type="hidden" name="status" value="draft" />
          <SecondaryButton type="submit" disabled={course.status === 'draft'}>
            Move to draft
          </SecondaryButton>
        </form>
        <form action={setCourseStatusAction}>
          <input type="hidden" name="course_id" value={id} />
          <input type="hidden" name="status" value="archived" />
          <SecondaryButton type="submit" disabled={course.status === 'archived'}>
            Archive
          </SecondaryButton>
        </form>
      </div>

      <FormSection title="Course details" icon={BookMarked}>
        <form action={updateCourseAction} className="grid max-w-2xl gap-5">
          <input type="hidden" name="course_id" value={id} />
          <div>
            <FieldLabel htmlFor="title">Title</FieldLabel>
            <input id="title" name="title" required defaultValue={course.title} className={`${dashInput} mt-2`} />
          </div>
          <div>
            <FieldLabel htmlFor="slug">Slug</FieldLabel>
            <input id="slug" name="slug" required defaultValue={course.slug} className={`${dashInput} mt-2`} />
          </div>
          <div>
            <FieldLabel htmlFor="description">Description</FieldLabel>
            <textarea
              id="description"
              name="description"
              rows={4}
              defaultValue={course.description ?? ''}
              className={`${dashInput} mt-2`}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <FieldLabel htmlFor="subject_id">Subject</FieldLabel>
              <select
                id="subject_id"
                name="subject_id"
                required
                defaultValue={course.subject_id}
                className={`${dashSelect} mt-2`}
              >
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <FieldLabel htmlFor="grade_level_id">Grade level</FieldLabel>
              <select
                id="grade_level_id"
                name="grade_level_id"
                required
                defaultValue={course.grade_level_id}
                className={`${dashSelect} mt-2`}
              >
                {gradeLevels.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <FieldLabel htmlFor="status">Status</FieldLabel>
              <select id="status" name="status" defaultValue={course.status} className={`${dashSelect} mt-2`}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <div>
              <FieldLabel htmlFor="visibility">Visibility</FieldLabel>
              <select id="visibility" name="visibility" defaultValue={course.visibility} className={`${dashSelect} mt-2`}>
                <option value="public">Public</option>
                <option value="logged_in_only">Logged-in only</option>
                <option value="private">Private</option>
              </select>
            </div>
          </div>
          <button
            type="submit"
            className="inline-flex w-fit rounded-full bg-jac-purple px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#6240b8]"
          >
            Save course
          </button>
        </form>
      </FormSection>

      <FormSection title="Units" description="Chapters inside this course. Sort order controls display order." icon={Layers}>
        <div className="grid gap-8">
          {units.map((unit) => (
            <div key={unit.id} className="rounded-jac-md border border-jac-navy/10 bg-jac-offwhite/50 p-5">
              <form action={updateUnitAction} className="grid gap-4">
                <input type="hidden" name="unit_id" value={unit.id} />
                <input type="hidden" name="course_id" value={id} />
                <div>
                  <FieldLabel htmlFor={`u-title-${unit.id}`}>Unit title</FieldLabel>
                  <input
                    id={`u-title-${unit.id}`}
                    name="title"
                    defaultValue={unit.title}
                    required
                    className={`${dashInput} mt-2`}
                  />
                </div>
                <div>
                  <FieldLabel htmlFor={`u-desc-${unit.id}`}>Description</FieldLabel>
                  <textarea
                    id={`u-desc-${unit.id}`}
                    name="description"
                    rows={2}
                    defaultValue={unit.description ?? ''}
                    className={`${dashInput} mt-2`}
                  />
                </div>
                <div>
                  <FieldLabel htmlFor={`u-sort-${unit.id}`}>Sort order</FieldLabel>
                  <input
                    id={`u-sort-${unit.id}`}
                    name="sort_order"
                    type="number"
                    defaultValue={unit.sort_order}
                    className={`${dashInput} mt-2 max-w-[10rem]`}
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="submit"
                    className="inline-flex rounded-full bg-jac-purple px-4 py-2 text-sm font-semibold text-white hover:bg-[#6240b8]"
                  >
                    Save unit
                  </button>
                </div>
              </form>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-jac-navy/10 pt-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-jac-navy/50">Lessons</p>
                  <ul className="mt-2 space-y-1">
                    {unit.lessons.map((les) => (
                      <li key={les.id}>
                        <Link
                          href={`/dashboard/courses/${id}/lessons/${les.id}/edit`}
                          className="text-sm font-medium text-jac-purple hover:underline"
                        >
                          {les.title}
                        </Link>
                        <span className="ml-2 text-xs text-jac-navy/50">({les.status})</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Link
                  href={`/dashboard/courses/${id}/lessons/new?unitId=${unit.id}`}
                  className="inline-flex items-center gap-1 text-sm font-semibold text-jac-purple hover:underline"
                >
                  <PlusCircle className="h-4 w-4" aria-hidden />
                  Add lesson
                </Link>
              </div>
              <form action={deleteUnitAction} className="mt-4">
                <input type="hidden" name="unit_id" value={unit.id} />
                <input type="hidden" name="course_id" value={id} />
                <SecondaryButton type="submit">Delete unit</SecondaryButton>
              </form>
            </div>
          ))}

          <div className="rounded-jac-md border border-dashed border-jac-purple/25 p-5">
            <p className="text-sm font-semibold text-jac-navy">Add unit</p>
            <form action={createUnitAction} className="mt-4 grid max-w-xl gap-4">
              <input type="hidden" name="course_id" value={id} />
              <div>
                <FieldLabel htmlFor="new-unit-title">Title</FieldLabel>
                <input id="new-unit-title" name="title" required className={`${dashInput} mt-2`} />
              </div>
              <div>
                <FieldLabel htmlFor="new-unit-desc">Description</FieldLabel>
                <textarea id="new-unit-desc" name="description" rows={2} className={`${dashInput} mt-2`} />
              </div>
              <div>
                <FieldLabel htmlFor="new-unit-sort">Sort order</FieldLabel>
                <input
                  id="new-unit-sort"
                  name="sort_order"
                  type="number"
                  defaultValue={units.length}
                  className={`${dashInput} mt-2 max-w-[10rem]`}
                />
              </div>
              <button
                type="submit"
                className="inline-flex w-fit rounded-full bg-jac-navy px-4 py-2 text-sm font-semibold text-white hover:bg-[#2d2848]"
              >
                Add unit
              </button>
            </form>
          </div>
        </div>
      </FormSection>

      <p className="text-sm text-jac-navy/65">
        <ListTree className="mr-1 inline h-4 w-4 text-jac-purple" aria-hidden />
        {/* TODO: drag-and-drop reordering for units and lessons; for now use sort order fields. */}
        Tip: use sort order numbers to control how units and lessons appear on the public course page.
      </p>
    </div>
  )
}

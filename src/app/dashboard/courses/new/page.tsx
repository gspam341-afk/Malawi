import { BookMarked } from 'lucide-react'
import { requireRole } from '@/lib/auth'
import { createCourseAction } from '@/app/dashboard/courses/actions'
import { AdminPageHeader } from '@/components/dashboard/AdminPageHeader'
import { FieldLabel } from '@/components/dashboard/FieldLabel'
import { FormSection } from '@/components/dashboard/FormSection'
import { dashInput, dashSelect } from '@/components/dashboard/classes'
import { getGradeLevels, getSubjects } from '@/lib/queries/publicResources'

type Props = { searchParams: Promise<{ error?: string }> }

export default async function NewCoursePage({ searchParams }: Props) {
  await requireRole(['admin', 'teacher'])
  const sp = await searchParams
  const [subjects, gradeLevels] = await Promise.all([getSubjects(), getGradeLevels()])

  return (
    <div className="grid gap-10">
      <AdminPageHeader
        eyebrow="Courses"
        title="Create course"
        description="Pick a subject and grade, then add units and lessons after saving."
        titleIcon={BookMarked}
      />

      {sp.error ? (
        <p className="rounded-jac-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">
          {decodeURIComponent(sp.error)}
        </p>
      ) : null}

      <FormSection title="Course details" icon={BookMarked}>
        <form action={createCourseAction} className="grid max-w-2xl gap-5">
          <div>
            <FieldLabel htmlFor="title">Title</FieldLabel>
            <input id="title" name="title" required className={`${dashInput} mt-2`} />
          </div>
          <div>
            <FieldLabel htmlFor="slug" hint="Leave blank to generate from the title.">
              Slug (URL)
            </FieldLabel>
            <input id="slug" name="slug" className={`${dashInput} mt-2`} />
          </div>
          <div>
            <FieldLabel htmlFor="description">Description</FieldLabel>
            <textarea id="description" name="description" rows={4} className={`${dashInput} mt-2`} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <FieldLabel htmlFor="subject_id">Subject</FieldLabel>
              <select id="subject_id" name="subject_id" required className={`${dashSelect} mt-2`}>
                <option value="">Select…</option>
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <FieldLabel htmlFor="grade_level_id">Grade level</FieldLabel>
              <select id="grade_level_id" name="grade_level_id" required className={`${dashSelect} mt-2`}>
                <option value="">Select…</option>
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
              <select id="status" name="status" defaultValue="draft" className={`${dashSelect} mt-2`}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <div>
              <FieldLabel htmlFor="visibility">Visibility</FieldLabel>
              <select id="visibility" name="visibility" defaultValue="public" className={`${dashSelect} mt-2`}>
                <option value="public">Public</option>
                <option value="logged_in_only">Logged-in only</option>
                <option value="private">Private</option>
              </select>
            </div>
          </div>
          <button
            type="submit"
            className="inline-flex w-fit items-center justify-center rounded-full bg-jac-purple px-5 py-2.5 text-sm font-semibold text-white shadow-jac-soft hover:bg-[#6240b8]"
          >
            Save course
          </button>
        </form>
      </FormSection>
    </div>
  )
}

import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requireRole } from '@/lib/auth'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { getGradeLevels, getSubjects } from '@/lib/queries/publicResources'
import { updateResourceAction } from '@/app/dashboard/resources/[id]/edit/actions'
import { RequiredMaterialsEditorEdit } from '@/app/dashboard/resources/[id]/edit/RequiredMaterialsEditorEdit'
import { PrintableMaterialUploader } from '@/app/dashboard/resources/[id]/PrintableMaterialUploader'
import { PrintableMaterialsManager } from '@/app/dashboard/resources/[id]/edit/PrintableMaterialsManager'

type PrintableRow = {
  id: string
  title: string
  description: string | null
  file_type: string | null
  pages_count: number | null
  paper_size: string
  color_required: boolean
  double_sided_recommended: boolean
  created_at: string
}

export default async function EditResourcePage(props: { params: Promise<{ id: string }> }) {
  const profile = await requireRole(['admin', 'teacher'])
  const { id } = await props.params

  const supabase = await createSupabaseServerClient()

  const [{ data: resource, error: resourceError }, gradeLevels, subjects] = await Promise.all([
    supabase
      .from('resources')
      .select(
        `
        id,
        title,
        description,
        result_description,
        activity_type,
        print_required,
        cutting_required,
        extra_materials_required,
        visibility,
        status,
        created_by,
        subjects:resource_subjects(subject_id),
        grade_levels:resource_grade_levels(grade_level_id),
        required_materials(name,quantity,is_optional,provided_in_template,note),
        printable_materials(id,title,description,file_type,pages_count,paper_size,color_required,double_sided_recommended,created_at)
        `,
      )
      .eq('id', id)
      .single(),
    getGradeLevels(),
    getSubjects(),
  ])

  if (resourceError) throw resourceError
  if (!resource) notFound()

  if (profile.role === 'teacher' && resource.created_by !== profile.id) {
    return (
      <div className="rounded-2xl border bg-white p-6">
        <h1 className="text-xl font-semibold tracking-tight">Edit resource</h1>
        <p className="mt-2 text-sm text-zinc-700">Access denied.</p>
        <div className="mt-4">
          <Link href="/dashboard/resources" className="text-sm text-zinc-700 hover:text-zinc-950">
            Back to resources
          </Link>
        </div>
      </div>
    )
  }

  const subjectIdSet = new Set((resource.subjects ?? []).map((x: { subject_id: string }) => x.subject_id))
  const gradeLevelIdSet = new Set(
    (resource.grade_levels ?? []).map((x: { grade_level_id: string }) => x.grade_level_id),
  )

  const requiredMaterialsInitial = (resource.required_materials ?? []).map(
    (m: {
      name: string
      quantity: number | null
      is_optional: boolean
      provided_in_template: boolean
      note: string | null
    }) => ({
      name: m.name,
      quantity: m.quantity,
      is_optional: Boolean(m.is_optional),
      provided_in_template: Boolean(m.provided_in_template),
      note: m.note ?? '',
    }),
  )

  const defaultStatus = resource.status

  return (
    <div className="grid gap-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Edit resource</h1>
          <p className="mt-1 text-sm text-zinc-700">Update content, materials, and printable files.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href={`/dashboard/resources/${id}`} className="text-sm text-zinc-700 hover:text-zinc-950">
            View
          </Link>
          <Link href="/dashboard/resources" className="text-sm text-zinc-700 hover:text-zinc-950">
            ← Back
          </Link>
        </div>
      </div>

      <form action={updateResourceAction.bind(null, id)} className="grid gap-6">
        <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-semibold">Basic information</h2>
          <div className="mt-4 grid gap-4">
            <div className="grid gap-1">
              <label className="text-sm font-medium">Title</label>
              <input
                name="title"
                required
                defaultValue={resource.title}
                className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-zinc-900 focus:ring-4 focus:ring-zinc-900/10"
              />
            </div>

            <div className="grid gap-1">
              <label className="text-sm font-medium">Result description</label>
              <textarea
                name="result_description"
                rows={2}
                defaultValue={resource.result_description ?? ''}
                className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-zinc-900 focus:ring-4 focus:ring-zinc-900/10"
              />
            </div>

            <div className="grid gap-1">
              <label className="text-sm font-medium">Description</label>
              <textarea
                name="description"
                rows={4}
                defaultValue={resource.description ?? ''}
                className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-zinc-900 focus:ring-4 focus:ring-zinc-900/10"
              />
            </div>

            <div className="grid gap-1">
              <label className="text-sm font-medium">Activity type</label>
              <input
                name="activity_type"
                defaultValue={resource.activity_type ?? ''}
                className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-zinc-900 focus:ring-4 focus:ring-zinc-900/10"
                placeholder="Flexible text (e.g. printable board game, classroom movement activity)"
              />
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-semibold">Material requirements</h2>
          <div className="mt-4 grid gap-3 text-sm">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="print_required"
                className="h-4 w-4 accent-zinc-900"
                defaultChecked={resource.print_required}
              />
              Print required
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="cutting_required"
                className="h-4 w-4 accent-zinc-900"
                defaultChecked={resource.cutting_required}
              />
              Cutting required
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="extra_materials_required"
                className="h-4 w-4 accent-zinc-900"
                defaultChecked={resource.extra_materials_required}
              />
              Extra materials required
            </label>
          </div>
        </section>

        <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-semibold">Required materials</h2>
          <p className="mt-2 text-sm text-zinc-700">Add the physical items needed to run the activity.</p>
          <RequiredMaterialsEditorEdit initialItems={requiredMaterialsInitial} />
        </section>

        <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-semibold">Resource settings</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="grid gap-1">
              <label className="text-sm font-medium">Visibility</label>
              <select
                name="visibility"
                className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-zinc-900 focus:ring-4 focus:ring-zinc-900/10"
                defaultValue={resource.visibility ?? 'public'}
              >
                <option value="public">public</option>
                <option value="teacher_only">teacher_only</option>
                <option value="logged_in_only">logged_in_only</option>
                <option value="private">private</option>
              </select>
            </div>

            <div className="grid gap-1">
              <label className="text-sm font-medium">Status</label>
              <select
                name="status"
                className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-zinc-900 focus:ring-4 focus:ring-zinc-900/10"
                defaultValue={defaultStatus}
              >
                <option value="draft">draft</option>
                <option value="pending">pending</option>
                <option value="published">published</option>
              </select>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-semibold">Subjects and grade levels</h2>
          <div className="mt-4 grid gap-6 sm:grid-cols-2">
            <div>
              <div className="text-sm font-medium">Subjects</div>
              <div className="mt-2 grid gap-2">
                {subjects.map((s) => (
                  <label key={s.id} className="flex items-center gap-2 text-sm text-zinc-800">
                    <input
                      type="checkbox"
                      name="subject_ids"
                      value={s.id}
                      className="h-4 w-4 accent-zinc-900"
                      defaultChecked={subjectIdSet.has(s.id)}
                    />
                    {s.name}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <div className="text-sm font-medium">Grade levels</div>
              <div className="mt-2 grid gap-2">
                {gradeLevels.map((g) => (
                  <label key={g.id} className="flex items-center gap-2 text-sm text-zinc-800">
                    <input
                      type="checkbox"
                      name="grade_level_ids"
                      value={g.id}
                      className="h-4 w-4 accent-zinc-900"
                      defaultChecked={gradeLevelIdSet.has(g.id)}
                    />
                    {g.name}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className="flex items-center justify-end gap-3">
          <Link href="/dashboard/resources" className="text-sm text-zinc-700 hover:text-zinc-950">
            Cancel
          </Link>
          <button
            type="submit"
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800 focus:outline-none focus:ring-4 focus:ring-zinc-900/20"
          >
            Save changes
          </button>
        </div>
      </form>

      <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h2 className="text-base font-semibold">Printable materials</h2>
        <p className="mt-2 text-sm text-zinc-700">Upload new files and edit metadata on existing ones.</p>

        <div className="mt-4">
          <PrintableMaterialUploader resourceId={id} />
        </div>

        <PrintableMaterialsManager
          resourceId={id}
          rows={(resource.printable_materials ?? []) as unknown as PrintableRow[]}
        />
      </section>
    </div>
  )
}

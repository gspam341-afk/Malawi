import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requireRole } from '@/lib/auth'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { getGradeLevels, getSubjects } from '@/lib/queries/publicResources'
import { deleteResourceAction, updateResourceAction } from '@/app/dashboard/resources/[id]/edit/actions'
import { RequiredMaterialsEditorEdit } from '@/app/dashboard/resources/[id]/edit/RequiredMaterialsEditorEdit'
import { PrintableMaterialUploader } from '@/app/dashboard/resources/[id]/PrintableMaterialUploader'
import { PrintableMaterialsManager } from '@/app/dashboard/resources/[id]/edit/PrintableMaterialsManager'
import { DeleteResourceForm } from '@/app/dashboard/resources/[id]/edit/DeleteResourceForm'
import { AdminPageHeader } from '@/components/dashboard/AdminPageHeader'
import { ActionButton } from '@/components/dashboard/ActionButton'
import { FieldLabel } from '@/components/dashboard/FieldLabel'
import { FormSection } from '@/components/dashboard/FormSection'
import { dashCheckbox, dashInput, dashMuted, dashPanelSolid, dashTextarea } from '@/components/dashboard/classes'

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
        preparation_time,
        activity_duration,
        group_size_min,
        group_size_max,
        difficulty_level,
        resource_type,
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
      <div className="grid gap-8">
        <AdminPageHeader
          eyebrow="Resources"
          title="Cannot edit this activity"
          description="Only the creator or an administrator can modify this resource."
          backHref="/dashboard/resources"
          backLabel="My resources"
        />
        <div className={`${dashPanelSolid} p-6 md:p-8`}>
          <p className={dashMuted}>If you need changes, ask your platform manager or duplicate ideas into a new draft.</p>
          <Link
            href="/dashboard/resources"
            className="mt-6 inline-flex rounded-xl px-4 py-2.5 text-sm font-semibold text-teal-800 underline-offset-4 hover:underline"
          >
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
    <div className="grid gap-10">
      <AdminPageHeader
        eyebrow="Resources"
        title="Edit learning activity"
        description="Update content, materials, and printable files. Changes save to the same public link when published."
        backHref="/dashboard/resources"
        backLabel="My resources"
        actions={
          <Link
            href={`/dashboard/resources/${id}`}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-teal-200 hover:bg-teal-50/40"
          >
            View detail
          </Link>
        }
      />

      <form action={updateResourceAction.bind(null, id)} className="grid gap-8">
        <FormSection title="Basic information" description="What it is called and what students will achieve.">
          <div className="grid gap-5">
            <div>
              <FieldLabel htmlFor="edit-title">Title</FieldLabel>
              <input
                id="edit-title"
                name="title"
                required
                defaultValue={resource.title}
                className={`${dashInput} mt-2`}
              />
            </div>

            <div>
              <FieldLabel htmlFor="edit-result" hint="Student-facing outcome in one or two sentences.">
                Result description
              </FieldLabel>
              <textarea
                id="edit-result"
                name="result_description"
                rows={2}
                defaultValue={resource.result_description ?? ''}
                className={`${dashTextarea} mt-2`}
              />
            </div>

            <div>
              <FieldLabel htmlFor="edit-desc">Full description</FieldLabel>
              <textarea
                id="edit-desc"
                name="description"
                rows={4}
                defaultValue={resource.description ?? ''}
                className={`${dashTextarea} mt-2`}
              />
            </div>

            <div>
              <FieldLabel htmlFor="edit-type">Activity type</FieldLabel>
              <input
                id="edit-type"
                name="activity_type"
                defaultValue={resource.activity_type ?? ''}
                className={`${dashInput} mt-2`}
                placeholder="e.g. movement task, printable board game"
              />
            </div>
          </div>
        </FormSection>

        <FormSection title="Activity setup" description="Timing, grouping, and difficulty for classroom planning.">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <FieldLabel htmlFor="edit-prep">Preparation time</FieldLabel>
              <input
                id="edit-prep"
                name="preparation_time"
                defaultValue={resource.preparation_time ?? ''}
                className={`${dashInput} mt-2`}
                placeholder="e.g. 10 minutes"
              />
            </div>
            <div>
              <FieldLabel htmlFor="edit-dur">Activity duration</FieldLabel>
              <input
                id="edit-dur"
                name="activity_duration"
                defaultValue={resource.activity_duration ?? ''}
                className={`${dashInput} mt-2`}
                placeholder="e.g. 45 minutes"
              />
            </div>
            <div>
              <FieldLabel htmlFor="edit-gmin">Group size (min)</FieldLabel>
              <input
                id="edit-gmin"
                type="number"
                name="group_size_min"
                defaultValue={resource.group_size_min ?? ''}
                className={`${dashInput} mt-2`}
              />
            </div>
            <div>
              <FieldLabel htmlFor="edit-gmax">Group size (max)</FieldLabel>
              <input
                id="edit-gmax"
                type="number"
                name="group_size_max"
                defaultValue={resource.group_size_max ?? ''}
                className={`${dashInput} mt-2`}
              />
            </div>
            <div className="sm:col-span-2">
              <FieldLabel htmlFor="edit-diff">Difficulty</FieldLabel>
              <select id="edit-diff" name="difficulty_level" className={`${dashInput} mt-2`} defaultValue={resource.difficulty_level ?? ''}>
                <option value="">—</option>
                <option value="easy">easy</option>
                <option value="medium">medium</option>
                <option value="hard">hard</option>
              </select>
            </div>
          </div>
        </FormSection>

        <FormSection title="Grade levels and subjects" description="Tag where this activity fits in your curriculum.">
          <div className="grid gap-8 sm:grid-cols-2">
            <div>
              <p className="text-sm font-semibold text-slate-900">Subjects</p>
              <div className="mt-3 grid gap-2">
                {subjects.map((s) => (
                  <label key={s.id} className="flex cursor-pointer items-center gap-3 text-sm text-slate-800">
                    <input
                      type="checkbox"
                      name="subject_ids"
                      value={s.id}
                      className={dashCheckbox}
                      defaultChecked={subjectIdSet.has(s.id)}
                    />
                    {s.name}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-900">Grade levels</p>
              <div className="mt-3 grid gap-2">
                {gradeLevels.map((g) => (
                  <label key={g.id} className="flex cursor-pointer items-center gap-3 text-sm text-slate-800">
                    <input
                      type="checkbox"
                      name="grade_level_ids"
                      value={g.id}
                      className={dashCheckbox}
                      defaultChecked={gradeLevelIdSet.has(g.id)}
                    />
                    {g.name}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </FormSection>

        <FormSection title="Material requirements" description="Quick flags before listing concrete items.">
          <div className="grid gap-3 text-sm">
            <label className="flex cursor-pointer items-center gap-3">
              <input type="checkbox" name="print_required" className={dashCheckbox} defaultChecked={resource.print_required} />
              <span className="text-slate-800">Print required</span>
            </label>
            <label className="flex cursor-pointer items-center gap-3">
              <input type="checkbox" name="cutting_required" className={dashCheckbox} defaultChecked={resource.cutting_required} />
              <span className="text-slate-800">Cutting required</span>
            </label>
            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                name="extra_materials_required"
                className={dashCheckbox}
                defaultChecked={resource.extra_materials_required}
              />
              <span className="text-slate-800">Extra materials required beyond paper</span>
            </label>
          </div>
        </FormSection>

        <FormSection title="Required materials" description="List quantities so teachers know what to gather before class.">
          <RequiredMaterialsEditorEdit initialItems={requiredMaterialsInitial} />
        </FormSection>

        <FormSection title="Publishing settings" description="Resource type, visibility, and workflow state.">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <FieldLabel htmlFor="edit-rtype">Resource type</FieldLabel>
              <select id="edit-rtype" name="resource_type" className={`${dashInput} mt-2`} defaultValue={resource.resource_type ?? 'activity_idea'}>
                <option value="teaching_material">teaching_material</option>
                <option value="printable_template">printable_template</option>
                <option value="activity_idea">activity_idea</option>
                <option value="lesson_activity">lesson_activity</option>
              </select>
            </div>

            <div>
              <FieldLabel htmlFor="edit-vis">Visibility</FieldLabel>
              <select id="edit-vis" name="visibility" className={`${dashInput} mt-2`} defaultValue={resource.visibility ?? 'public'}>
                <option value="public">public</option>
                <option value="teacher_only">teacher_only</option>
                <option value="logged_in_only">logged_in_only</option>
                <option value="private">private</option>
              </select>
            </div>

            <div>
              <FieldLabel htmlFor="edit-st">Status</FieldLabel>
              <select id="edit-st" name="status" className={`${dashInput} mt-2`} defaultValue={defaultStatus}>
                <option value="draft">draft</option>
                <option value="pending">pending</option>
                <option value="published">published</option>
              </select>
            </div>
          </div>
        </FormSection>

        <div className="flex flex-wrap items-center justify-end gap-3 border-t border-slate-100 pt-6">
          <Link
            href="/dashboard/resources"
            className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100"
          >
            Cancel
          </Link>
          <ActionButton type="submit">Save changes</ActionButton>
        </div>
      </form>

      <FormSection title="Printable materials" description="Upload new files and edit metadata on existing handouts.">
        <div className="rounded-2xl border border-dashed border-teal-200/80 bg-gradient-to-br from-teal-50/40 to-white p-4 md:p-6">
          <PrintableMaterialUploader resourceId={id} />
        </div>

        <div className="mt-8">
          <PrintableMaterialsManager resourceId={id} rows={(resource.printable_materials ?? []) as unknown as PrintableRow[]} />
        </div>
      </FormSection>

      <section className={`${dashPanelSolid} border-red-100 bg-gradient-to-br from-red-50/80 to-white p-6 md:p-8 ring-1 ring-red-100`}>
        <h2 className="text-lg font-semibold text-red-950">Danger zone</h2>
        <p className={`mt-1 ${dashMuted}`}>Deleting removes this activity and all printable files from storage. This cannot be undone.</p>

        <div className="mt-6">
          <DeleteResourceForm action={deleteResourceAction.bind(null, id)} />
        </div>
      </section>
    </div>
  )
}

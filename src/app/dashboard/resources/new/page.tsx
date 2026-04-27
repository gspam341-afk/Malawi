import Link from 'next/link'
import { requireRole } from '@/lib/auth'
import { getGradeLevels, getSubjects } from '@/lib/queries/publicResources'
import { createResourceAction } from '@/app/dashboard/resources/new/actions'
import { RequiredMaterialsEditor } from '@/app/dashboard/resources/new/RequiredMaterialsEditor'
import { AdminPageHeader } from '@/components/dashboard/AdminPageHeader'
import { ActionButton } from '@/components/dashboard/ActionButton'
import { FieldLabel } from '@/components/dashboard/FieldLabel'
import { FormSection } from '@/components/dashboard/FormSection'
import { dashCheckbox, dashInput, dashTextarea } from '@/components/dashboard/classes'

export default async function NewResourcePage() {
  await requireRole(['admin', 'teacher'])

  const [gradeLevels, subjects] = await Promise.all([getGradeLevels(), getSubjects()])

  const defaultStatus = 'draft'

  return (
    <div className="grid gap-10">
      <AdminPageHeader
        eyebrow="Create"
        title="New learning activity"
        description="Describe outcomes, timing, and materials so teachers can run it confidently in class."
        backHref="/dashboard/resources"
        backLabel="My resources"
      />

      <form action={createResourceAction} className="grid gap-8">
        <FormSection title="Basic information" description="What it is called and what students will achieve.">
          <div className="grid gap-5">
            <div>
              <FieldLabel htmlFor="res-title">Title</FieldLabel>
              <input id="res-title" name="title" required className={`${dashInput} mt-2`} />
            </div>

            <div>
              <FieldLabel htmlFor="res-result" hint="Student-facing outcome in one or two sentences.">
                Result description
              </FieldLabel>
              <textarea id="res-result" name="result_description" rows={2} className={`${dashTextarea} mt-2`} />
            </div>

            <div>
              <FieldLabel htmlFor="res-desc">Full description</FieldLabel>
              <textarea id="res-desc" name="description" rows={4} className={`${dashTextarea} mt-2`} />
            </div>

            <div>
              <FieldLabel htmlFor="res-type">Activity type</FieldLabel>
              <input
                id="res-type"
                name="activity_type"
                className={`${dashInput} mt-2`}
                placeholder="e.g. movement task, printable board game"
              />
            </div>
          </div>
        </FormSection>

        <FormSection title="Activity setup" description="Timing, grouping, and difficulty for classroom planning.">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <FieldLabel htmlFor="prep">Preparation time</FieldLabel>
              <input
                id="prep"
                name="preparation_time"
                className={`${dashInput} mt-2`}
                placeholder="e.g. 10 minutes"
              />
            </div>
            <div>
              <FieldLabel htmlFor="dur">Activity duration</FieldLabel>
              <input
                id="dur"
                name="activity_duration"
                className={`${dashInput} mt-2`}
                placeholder="e.g. 45 minutes"
              />
            </div>
            <div>
              <FieldLabel htmlFor="gmin">Group size (min)</FieldLabel>
              <input id="gmin" type="number" name="group_size_min" className={`${dashInput} mt-2`} />
            </div>
            <div>
              <FieldLabel htmlFor="gmax">Group size (max)</FieldLabel>
              <input id="gmax" type="number" name="group_size_max" className={`${dashInput} mt-2`} />
            </div>
            <div className="sm:col-span-2">
              <FieldLabel htmlFor="diff">Difficulty</FieldLabel>
              <select id="diff" name="difficulty_level" className={`${dashInput} mt-2`}>
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
                    <input type="checkbox" name="subject_ids" value={s.id} className={dashCheckbox} />
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
                    <input type="checkbox" name="grade_level_ids" value={g.id} className={dashCheckbox} />
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
              <input type="checkbox" name="print_required" className={dashCheckbox} />
              <span className="text-slate-800">Print required</span>
            </label>
            <label className="flex cursor-pointer items-center gap-3">
              <input type="checkbox" name="cutting_required" className={dashCheckbox} />
              <span className="text-slate-800">Cutting required</span>
            </label>
            <label className="flex cursor-pointer items-center gap-3">
              <input type="checkbox" name="extra_materials_required" className={dashCheckbox} />
              <span className="text-slate-800">Extra materials required beyond paper</span>
            </label>
          </div>
        </FormSection>

        <FormSection
          title="Required materials"
          description="List quantities so teachers know what to gather before class."
        >
          <RequiredMaterialsEditor />
        </FormSection>

        <FormSection title="Publishing settings" description="Who can see this resource and its initial workflow state.">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <FieldLabel htmlFor="rtype">Resource type</FieldLabel>
              <select id="rtype" name="resource_type" className={`${dashInput} mt-2`} defaultValue="activity_idea">
                <option value="teaching_material">teaching_material</option>
                <option value="printable_template">printable_template</option>
                <option value="activity_idea">activity_idea</option>
                <option value="lesson_activity">lesson_activity</option>
              </select>
            </div>

            <div>
              <FieldLabel htmlFor="vis">Visibility</FieldLabel>
              <select id="vis" name="visibility" className={`${dashInput} mt-2`} defaultValue="public">
                <option value="public">public</option>
                <option value="teacher_only">teacher_only</option>
                <option value="logged_in_only">logged_in_only</option>
                <option value="private">private</option>
              </select>
            </div>

            <div>
              <FieldLabel htmlFor="st">Status</FieldLabel>
              <select id="st" name="status" className={`${dashInput} mt-2`} defaultValue={defaultStatus}>
                <option value="draft">draft</option>
                <option value="pending">pending</option>
                <option value="published">published</option>
              </select>
            </div>
          </div>
        </FormSection>

        <FormSection title="After you save" description="You can attach printable files from the resource detail page once it exists.">
          <p className="text-sm text-slate-600">
            Creating saves your draft. Open the resource next to upload PDFs or handouts.
          </p>
        </FormSection>

        <div className="flex flex-wrap items-center justify-end gap-3 border-t border-slate-100 pt-6">
          <Link href="/dashboard/resources" className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100">
            Cancel
          </Link>
          <ActionButton type="submit">Create resource</ActionButton>
        </div>
      </form>
    </div>
  )
}

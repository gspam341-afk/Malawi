import Link from 'next/link'
import { requireRole } from '@/lib/auth'
import { getGradeLevels, getSubjects } from '@/lib/queries/publicResources'
import { createResourceAction } from '@/app/dashboard/resources/new/actions'

export default async function NewResourcePage() {
  const profile = await requireRole(['admin', 'teacher'])

  const [gradeLevels, subjects] = await Promise.all([getGradeLevels(), getSubjects()])

  const defaultStatus = profile.role === 'admin' ? 'published' : 'draft'

  return (
    <div className="grid gap-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Create resource</h1>
          <p className="mt-1 text-sm text-zinc-700">
            Add a new physical learning activity or teaching material.
          </p>
        </div>
        <Link href="/dashboard/resources" className="text-sm text-zinc-700 hover:text-zinc-950">
          ← Back
        </Link>
      </div>

      <form action={createResourceAction} className="grid gap-6">
        <section className="rounded-2xl border bg-white p-6">
          <h2 className="text-base font-semibold">Basic information</h2>
          <div className="mt-4 grid gap-4">
            <div className="grid gap-1">
              <label className="text-sm font-medium">Title</label>
              <input name="title" required className="rounded-md border px-3 py-2 text-sm" />
            </div>

            <div className="grid gap-1">
              <label className="text-sm font-medium">Result description</label>
              <textarea
                name="result_description"
                rows={2}
                className="rounded-md border px-3 py-2 text-sm"
              />
            </div>

            <div className="grid gap-1">
              <label className="text-sm font-medium">Description</label>
              <textarea name="description" rows={4} className="rounded-md border px-3 py-2 text-sm" />
            </div>

            <div className="grid gap-1">
              <label className="text-sm font-medium">Activity type</label>
              <input
                name="activity_type"
                className="rounded-md border px-3 py-2 text-sm"
                placeholder="Flexible text (e.g. printable board game, classroom movement activity)"
              />
            </div>
          </div>
        </section>

        <section className="rounded-2xl border bg-white p-6">
          <h2 className="text-base font-semibold">Timing and class setup</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="grid gap-1">
              <label className="text-sm font-medium">Preparation time</label>
              <input name="preparation_time" className="rounded-md border px-3 py-2 text-sm" placeholder="e.g. 10 minutes" />
            </div>
            <div className="grid gap-1">
              <label className="text-sm font-medium">Activity duration</label>
              <input name="activity_duration" className="rounded-md border px-3 py-2 text-sm" placeholder="e.g. 45 minutes" />
            </div>
            <div className="grid gap-1">
              <label className="text-sm font-medium">Group size (min)</label>
              <input type="number" name="group_size_min" className="rounded-md border px-3 py-2 text-sm" />
            </div>
            <div className="grid gap-1">
              <label className="text-sm font-medium">Group size (max)</label>
              <input type="number" name="group_size_max" className="rounded-md border px-3 py-2 text-sm" />
            </div>
            <div className="grid gap-1 sm:col-span-2">
              <label className="text-sm font-medium">Difficulty</label>
              <select name="difficulty_level" className="rounded-md border px-3 py-2 text-sm">
                <option value="">—</option>
                <option value="easy">easy</option>
                <option value="medium">medium</option>
                <option value="hard">hard</option>
              </select>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border bg-white p-6">
          <h2 className="text-base font-semibold">Material requirements</h2>
          <div className="mt-4 grid gap-3 text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" name="print_required" className="h-4 w-4" />
              Print required
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" name="cutting_required" className="h-4 w-4" />
              Cutting required
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" name="extra_materials_required" className="h-4 w-4" />
              Extra materials required
            </label>
          </div>
        </section>

        <section className="rounded-2xl border bg-white p-6">
          <h2 className="text-base font-semibold">Resource settings</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="grid gap-1">
              <label className="text-sm font-medium">Resource type</label>
              <select name="resource_type" className="rounded-md border px-3 py-2 text-sm" defaultValue="activity_idea">
                <option value="teaching_material">teaching_material</option>
                <option value="printable_template">printable_template</option>
                <option value="activity_idea">activity_idea</option>
                <option value="lesson_activity">lesson_activity</option>
              </select>
            </div>

            <div className="grid gap-1">
              <label className="text-sm font-medium">Visibility</label>
              <select name="visibility" className="rounded-md border px-3 py-2 text-sm" defaultValue="public">
                <option value="public">public</option>
                <option value="teacher_only">teacher_only</option>
                <option value="logged_in_only">logged_in_only</option>
                <option value="private">private</option>
              </select>
            </div>

            <div className="grid gap-1">
              <label className="text-sm font-medium">Status</label>
              <select name="status" className="rounded-md border px-3 py-2 text-sm" defaultValue={defaultStatus}>
                <option value="draft">draft</option>
                <option value="pending">pending</option>
                <option value="published">published</option>
              </select>
              {profile.role !== 'admin' ? (
                <div className="text-xs text-zinc-600">
                  Teachers can’t publish directly. If you select published, it will be submitted as pending.
                </div>
              ) : null}
            </div>
          </div>
        </section>

        <section className="rounded-2xl border bg-white p-6">
          <h2 className="text-base font-semibold">Subjects and grade levels</h2>
          <div className="mt-4 grid gap-6 sm:grid-cols-2">
            <div>
              <div className="text-sm font-medium">Subjects</div>
              <div className="mt-2 grid gap-2">
                {subjects.map((s) => (
                  <label key={s.id} className="flex items-center gap-2 text-sm text-zinc-800">
                    <input type="checkbox" name="subject_ids" value={s.id} className="h-4 w-4" />
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
                    <input type="checkbox" name="grade_level_ids" value={g.id} className="h-4 w-4" />
                    {g.name}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border bg-white p-6">
          <h2 className="text-base font-semibold">Next steps</h2>
          <div className="mt-2 text-sm text-zinc-700">
            Printable uploads, required materials editor, and resource editing are coming next.
          </div>
        </section>

        <div className="flex items-center justify-end gap-3">
          <Link href="/dashboard/resources" className="text-sm text-zinc-700 hover:text-zinc-950">
            Cancel
          </Link>
          <button
            type="submit"
            className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
          >
            Create
          </button>
        </div>
      </form>
    </div>
  )
}

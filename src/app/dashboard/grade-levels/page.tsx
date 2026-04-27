import { GraduationCap, PlusCircle, Save, Trash2 } from 'lucide-react'
import { requireAdmin } from '@/lib/auth'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { ConfirmSubmitButton } from '@/components/ConfirmSubmitButton'
import { AdminPageHeader } from '@/components/dashboard/AdminPageHeader'
import { ActionButton, SecondaryButton } from '@/components/dashboard/ActionButton'
import { dashInput, dashMuted, dashPanelSolid } from '@/components/dashboard/classes'
import { TableShell } from '@/components/dashboard/TableShell'
import { EmptyState } from '@/components/ui/EmptyState'
import { createGradeLevelAction, deleteGradeLevelAction, updateGradeLevelAction } from '@/app/dashboard/grade-levels/actions'

export default async function AdminGradeLevelsPage(props: { searchParams?: Promise<{ error?: string }> }) {
  await requireAdmin()
  const { error: errorMessage } = (await props.searchParams) ?? {}

  const supabase = await createSupabaseServerClient()
  const { data: levels, error } = await supabase
    .from('grade_levels')
    .select('id,name,grade_number,description')
    .order('grade_number', { ascending: true })

  if (error) throw error

  return (
    <div className="grid gap-10">
      <AdminPageHeader
        eyebrow="Curriculum"
        title="Grade levels"
        description="Maintain the ladder from Grade 6 through Grade 14 for browsing and tagging resources."
        titleIcon={GraduationCap}
      />

      {errorMessage ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-950" role="alert">
          {errorMessage}
        </div>
      ) : null}

      <section className={`${dashPanelSolid} p-6 md:p-8`}>
        <h2 className="text-lg font-semibold text-slate-900">Add a grade level</h2>
        <p className={`mt-1 ${dashMuted}`}>Grade number controls ordering in filters and cards.</p>
        <form action={createGradeLevelAction} className="mt-6 grid gap-4 md:grid-cols-12">
          <div className="md:col-span-4">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Label</label>
            <input name="name" placeholder="Grade 8" required className={`${dashInput} mt-2`} />
          </div>
          <div className="md:col-span-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Grade #</label>
            <input name="grade_number" type="number" required className={`${dashInput} mt-2`} />
          </div>
          <div className="md:col-span-5">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Description (optional)</label>
            <input name="description" placeholder="Optional context" className={`${dashInput} mt-2`} />
          </div>
          <div className="flex items-end md:col-span-1">
            <ActionButton type="submit" className="w-full md:w-auto" icon={PlusCircle}>
              Add
            </ActionButton>
          </div>
        </form>
      </section>

      {levels?.length ? (
        <TableShell>
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-slate-100 bg-gradient-to-r from-teal-50/90 to-white">
              <tr className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                <th className="px-4 py-4">Grade</th>
                <th className="px-4 py-4">#</th>
                <th className="hidden px-4 py-4 md:table-cell">Description</th>
                <th className="px-4 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {levels.map((g) => (
                <tr key={g.id} className="hover:bg-teal-50/15">
                  <td className="px-4 py-4 align-top">
                    <form action={updateGradeLevelAction} className="flex flex-col gap-3 xl:flex-row xl:flex-wrap xl:items-center">
                      <input type="hidden" name="id" value={g.id} />
                      <input name="name" defaultValue={g.name} className={`${dashInput} max-w-[14rem]`} />
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold uppercase text-slate-500">#</span>
                        <input
                          name="grade_number"
                          type="number"
                          defaultValue={g.grade_number}
                          className={`${dashInput} w-24`}
                        />
                      </div>
                      <input
                        name="description"
                        defaultValue={g.description ?? ''}
                        className={`${dashInput} min-w-[12rem] flex-1`}
                      />
                      <SecondaryButton type="submit" icon={Save}>
                        Save
                      </SecondaryButton>
                    </form>
                  </td>
                  <td className="px-4 py-4 align-middle">
                    <span className="inline-flex min-w-[2.5rem] justify-center rounded-full bg-teal-100 px-3 py-1 text-sm font-bold text-teal-900 ring-1 ring-teal-600/15">
                      {g.grade_number}
                    </span>
                  </td>
                  <td className="hidden px-4 py-4 text-slate-600 md:table-cell">{g.description ?? '—'}</td>
                  <td className="px-4 py-4 align-top">
                    <form action={deleteGradeLevelAction}>
                      <input type="hidden" name="id" value={g.id} />
                      <ConfirmSubmitButton
                        message="Delete this grade level? This fails if resources still reference it."
                        className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-900 hover:bg-red-100"
                      >
                        <span className="inline-flex items-center gap-2">
                          <Trash2 className="h-4 w-4" aria-hidden />
                          Delete
                        </span>
                      </ConfirmSubmitButton>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableShell>
      ) : (
        <EmptyState
          icon={GraduationCap}
          title="No grade levels yet"
          description="Seed Grade 6–14 to match how teachers filter activities."
        />
      )}
    </div>
  )
}

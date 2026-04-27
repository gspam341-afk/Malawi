import { requireAdmin } from '@/lib/auth'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { createSubjectAction, deleteSubjectAction, updateSubjectAction } from '@/app/dashboard/subjects/actions'
import { ConfirmSubmitButton } from '@/components/ConfirmSubmitButton'
import { AdminPageHeader } from '@/components/dashboard/AdminPageHeader'
import { ActionButton, SecondaryButton } from '@/components/dashboard/ActionButton'
import { dashInput, dashMuted, dashPanelSolid } from '@/components/dashboard/classes'
import { TableShell } from '@/components/dashboard/TableShell'
import { EmptyState } from '@/components/ui/EmptyState'

export default async function AdminSubjectsPage(props: { searchParams?: Promise<{ error?: string }> }) {
  await requireAdmin()
  const { error: errorMessage } = (await props.searchParams) ?? {}

  const supabase = await createSupabaseServerClient()
  const { data: subjects, error } = await supabase.from('subjects').select('id,name,description').order('name')
  if (error) throw error

  return (
    <div className="grid gap-10">
      <AdminPageHeader
        eyebrow="Curriculum"
        title="STEM subjects"
        description="Keep subject labels aligned with school naming. Safe delete prevents removing subjects tied to resources."
      />

      {errorMessage ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-950" role="alert">
          {errorMessage}
        </div>
      ) : null}

      <section className={`${dashPanelSolid} p-6 md:p-8`}>
        <h2 className="text-lg font-semibold text-slate-900">Add a subject</h2>
        <p className={`mt-1 ${dashMuted}`}>Appears in filters across teacher tools and the public browse experience.</p>
        <form action={createSubjectAction} className="mt-6 grid gap-4 md:grid-cols-12">
          <div className="md:col-span-4">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Name</label>
            <input name="name" placeholder="e.g. Biology" required className={`${dashInput} mt-2`} />
          </div>
          <div className="md:col-span-7">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Description (optional)</label>
            <input name="description" placeholder="Short helper text" className={`${dashInput} mt-2`} />
          </div>
          <div className="flex items-end md:col-span-1">
            <ActionButton type="submit" className="w-full md:w-auto">
              Add
            </ActionButton>
          </div>
        </form>
      </section>

      {subjects?.length ? (
        <TableShell>
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-slate-100 bg-gradient-to-r from-teal-50/90 to-white">
              <tr className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                <th className="px-4 py-4">Subject</th>
                <th className="hidden px-4 py-4 md:table-cell">Description snapshot</th>
                <th className="px-4 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {subjects.map((s) => (
                <tr key={s.id} className="hover:bg-teal-50/15">
                  <td className="px-4 py-4 align-top">
                    <form action={updateSubjectAction} className="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-center">
                      <input type="hidden" name="id" value={s.id} />
                      <input name="name" defaultValue={s.name} className={`${dashInput} max-w-xs`} />
                      <input
                        name="description"
                        defaultValue={s.description ?? ''}
                        placeholder="Description"
                        className={`${dashInput} min-w-[12rem] flex-1`}
                      />
                      <SecondaryButton type="submit">Save</SecondaryButton>
                    </form>
                  </td>
                  <td className="hidden px-4 py-4 text-slate-600 md:table-cell">{s.description ?? '—'}</td>
                  <td className="px-4 py-4 align-top">
                    <form action={deleteSubjectAction}>
                      <input type="hidden" name="id" value={s.id} />
                      <ConfirmSubmitButton
                        message="Delete this subject? This fails if resources still reference it."
                        className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-900 hover:bg-red-100"
                      >
                        Delete
                      </ConfirmSubmitButton>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableShell>
      ) : (
        <EmptyState title="No subjects yet" description="Add Mathematics, Physics, Biology, or other STEM areas your schools use." />
      )}
    </div>
  )
}

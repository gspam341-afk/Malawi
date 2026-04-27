import Link from 'next/link'
import { requireAdmin } from '@/lib/auth'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { createSubjectAction, deleteSubjectAction, updateSubjectAction } from '@/app/dashboard/subjects/actions'
import { ConfirmSubmitButton } from '@/components/ConfirmSubmitButton'

export default async function AdminSubjectsPage(props: { searchParams?: Promise<{ error?: string }> }) {
  await requireAdmin()
  const { error: errorMessage } = (await props.searchParams) ?? {}

  const supabase = await createSupabaseServerClient()
  const { data: subjects, error } = await supabase.from('subjects').select('id,name,description').order('name')
  if (error) throw error

  return (
    <div className="grid gap-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Manage subjects</h1>
          <p className="mt-1 text-sm text-zinc-700">Add, edit, and safely remove subjects.</p>
        </div>
        <Link href="/dashboard" className="text-sm text-zinc-700 hover:text-zinc-950">
          Dashboard
        </Link>
      </div>

      {errorMessage ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-900">{errorMessage}</div>
      ) : null}

      <section className="rounded-2xl border bg-white p-6">
        <h2 className="text-base font-semibold">Add subject</h2>
        <form action={createSubjectAction} className="mt-4 grid gap-3 sm:grid-cols-3">
          <input
            name="name"
            placeholder="Name"
            className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-zinc-900 focus:ring-4 focus:ring-zinc-900/10"
          />
          <input
            name="description"
            placeholder="Description (optional)"
            className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-zinc-900 focus:ring-4 focus:ring-zinc-900/10 sm:col-span-2"
          />
          <div className="sm:col-span-3 flex justify-end">
            <button
              type="submit"
              className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800 focus:outline-none focus:ring-4 focus:ring-zinc-900/20"
            >
              Add
            </button>
          </div>
        </form>
      </section>

      {subjects?.length ? (
        <div className="overflow-hidden rounded-2xl border bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-50 text-xs font-medium uppercase tracking-wide text-zinc-600">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {subjects.map((s) => (
                <tr key={s.id} className="hover:bg-zinc-50">
                  <td className="px-4 py-3">
                    <form action={updateSubjectAction} className="flex flex-wrap items-center gap-2">
                      <input type="hidden" name="id" value={s.id} />
                      <input
                        name="name"
                        defaultValue={s.name}
                        className="w-64 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-zinc-900 focus:ring-4 focus:ring-zinc-900/10"
                      />
                      <input
                        name="description"
                        defaultValue={s.description ?? ''}
                        className="min-w-[16rem] flex-1 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-zinc-900 focus:ring-4 focus:ring-zinc-900/10"
                      />
                      <button
                        type="submit"
                        className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-900 shadow-sm transition hover:bg-zinc-50 focus:outline-none focus:ring-4 focus:ring-zinc-900/10"
                      >
                        Save
                      </button>
                    </form>
                  </td>
                  <td className="px-4 py-3 text-zinc-700">{s.description ?? '—'}</td>
                  <td className="px-4 py-3">
                    <form action={deleteSubjectAction}>
                      <input type="hidden" name="id" value={s.id} />
                      <ConfirmSubmitButton
                        message="Delete this subject?"
                        className="rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm font-medium text-red-800 shadow-sm transition hover:bg-red-100 focus:outline-none focus:ring-4 focus:ring-red-500/20"
                      >
                        Delete
                      </ConfirmSubmitButton>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="rounded-2xl border bg-white p-6 text-sm text-zinc-700">No subjects found.</div>
      )}
    </div>
  )
}

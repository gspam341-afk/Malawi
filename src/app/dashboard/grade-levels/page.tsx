import Link from 'next/link'
import { requireAdmin } from '@/lib/auth'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { ConfirmSubmitButton } from '@/components/ConfirmSubmitButton'
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
    <div className="grid gap-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Manage grade levels</h1>
          <p className="mt-1 text-sm text-zinc-700">Add, edit, and safely remove grade levels.</p>
        </div>
        <Link href="/dashboard" className="text-sm text-zinc-700 hover:text-zinc-950">
          Dashboard
        </Link>
      </div>

      {errorMessage ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-900">{errorMessage}</div>
      ) : null}

      <section className="rounded-2xl border bg-white p-6">
        <h2 className="text-base font-semibold">Add grade level</h2>
        <form action={createGradeLevelAction} className="mt-4 grid gap-3 sm:grid-cols-4">
          <input
            name="name"
            placeholder="Name (e.g. Grade 6)"
            className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-zinc-900 focus:ring-4 focus:ring-zinc-900/10"
          />
          <input
            name="grade_number"
            type="number"
            placeholder="Grade #"
            className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-zinc-900 focus:ring-4 focus:ring-zinc-900/10"
          />
          <input
            name="description"
            placeholder="Description (optional)"
            className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-zinc-900 focus:ring-4 focus:ring-zinc-900/10 sm:col-span-2"
          />
          <div className="sm:col-span-4 flex justify-end">
            <button
              type="submit"
              className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800 focus:outline-none focus:ring-4 focus:ring-zinc-900/20"
            >
              Add
            </button>
          </div>
        </form>
      </section>

      {levels?.length ? (
        <div className="overflow-hidden rounded-2xl border bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-50 text-xs font-medium uppercase tracking-wide text-zinc-600">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Grade #</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {levels.map((g) => (
                <tr key={g.id} className="hover:bg-zinc-50">
                  <td className="px-4 py-3">
                    <form action={updateGradeLevelAction} className="flex flex-wrap items-center gap-2">
                      <input type="hidden" name="id" value={g.id} />
                      <input
                        name="name"
                        defaultValue={g.name}
                        className="w-56 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-zinc-900 focus:ring-4 focus:ring-zinc-900/10"
                      />
                      <input
                        name="grade_number"
                        type="number"
                        defaultValue={g.grade_number}
                        className="w-28 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-zinc-900 focus:ring-4 focus:ring-zinc-900/10"
                      />
                      <input
                        name="description"
                        defaultValue={g.description ?? ''}
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
                  <td className="px-4 py-3 text-zinc-700">{g.grade_number}</td>
                  <td className="px-4 py-3 text-zinc-700">{g.description ?? '—'}</td>
                  <td className="px-4 py-3">
                    <form action={deleteGradeLevelAction}>
                      <input type="hidden" name="id" value={g.id} />
                      <ConfirmSubmitButton
                        message="Delete this grade level?"
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
        <div className="rounded-2xl border bg-white p-6 text-sm text-zinc-700">No grade levels found.</div>
      )}
    </div>
  )
}

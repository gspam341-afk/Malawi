import Link from 'next/link'
import { requireProfile } from '@/lib/auth'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export default async function DashboardResourcesPage() {
  const profile = await requireProfile()

  if (profile.role !== 'admin' && profile.role !== 'teacher') {
    return (
      <div className="rounded-2xl border bg-white p-6">
        <h1 className="text-xl font-semibold tracking-tight">Resources</h1>
        <p className="mt-2 text-sm text-zinc-700">Access denied.</p>
        <div className="mt-4">
          <Link href="/dashboard" className="text-sm text-zinc-700 hover:text-zinc-950">
            Back to dashboard
          </Link>
        </div>
      </div>
    )
  }

  const supabase = await createSupabaseServerClient()

  let query = supabase
    .from('resources')
    .select('id,title,status,visibility,created_at,updated_at')
    .order('updated_at', { ascending: false })

  if (profile.role === 'teacher') {
    query = query.eq('created_by', profile.id)
  }

  const { data, error } = await query
  if (error) throw error

  const resources = data ?? []

  return (
    <div className="grid gap-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {profile.role === 'admin' ? 'All resources' : 'My resources'}
          </h1>
          <p className="mt-1 text-sm text-zinc-700">
            {profile.role === 'admin'
              ? 'View and manage resources.'
              : 'Resources you created.'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/resources/new"
            className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
          >
            Create new
          </Link>
          <Link href="/dashboard" className="text-sm text-zinc-700 hover:text-zinc-950">
            Dashboard
          </Link>
        </div>
      </div>

      {resources.length ? (
        <div className="overflow-hidden rounded-2xl border bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-50 text-xs font-medium uppercase tracking-wide text-zinc-600">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Visibility</th>
                <th className="px-4 py-3">Created</th>
                <th className="px-4 py-3">Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {resources.map((r) => (
                <tr key={r.id} className="hover:bg-zinc-50">
                  <td className="px-4 py-3 font-medium text-zinc-950">
                    <Link href={`/dashboard/resources/${r.id}`} className="hover:underline">
                      {r.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-zinc-700">{r.status}</td>
                  <td className="px-4 py-3 text-zinc-700">{r.visibility}</td>
                  <td className="px-4 py-3 text-zinc-700">
                    {new Date(r.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-zinc-700">
                    {new Date(r.updated_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="rounded-2xl border bg-white p-6 text-sm text-zinc-700">
          No resources yet.
        </div>
      )}
    </div>
  )
}

import Link from 'next/link'
import { requireAdmin } from '@/lib/auth'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { adminArchiveResourceAction, adminSetResourceStatusAction } from '@/app/dashboard/resources/manage/actions'

export default async function AdminManageResourcesPage(props: {
  searchParams?: Promise<{ q?: string; status?: string; visibility?: string }>
}) {
  await requireAdmin()
  const { q = '', status = '', visibility = '' } = (await props.searchParams) ?? {}

  const supabase = await createSupabaseServerClient()

  let query = supabase
    .from('resources')
    .select('id,title,created_by,status,visibility,created_at,updated_at')
    .order('updated_at', { ascending: false })

  if (status) query = query.eq('status', status)
  if (visibility) query = query.eq('visibility', visibility)
  if (q.trim()) query = query.ilike('title', `%${q.trim()}%`)

  const { data: resources, error } = await query
  if (error) throw error

  const createdByIds = Array.from(new Set((resources ?? []).map((r) => r.created_by).filter(Boolean))) as string[]
  const { data: creators } = createdByIds.length
    ? await supabase.from('profiles').select('id,name,email').in('id', createdByIds)
    : { data: [] as { id: string; name: string | null; email: string | null }[] }

  const creatorMap = new Map((creators ?? []).map((p) => [p.id, p]))

  return (
    <div className="grid gap-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Manage resources</h1>
          <p className="mt-1 text-sm text-zinc-700">Platform-wide resource management (admin).</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/dashboard/resources" className="text-sm text-zinc-700 hover:text-zinc-950">
            My resources
          </Link>
          <Link href="/dashboard" className="text-sm text-zinc-700 hover:text-zinc-950">
            Dashboard
          </Link>
        </div>
      </div>

      <form className="grid gap-3 rounded-2xl border bg-white p-4 sm:grid-cols-4" method="get">
        <div className="grid gap-1 sm:col-span-2">
          <label className="text-xs font-medium uppercase tracking-wide text-zinc-600">Search</label>
          <input
            name="q"
            defaultValue={q}
            placeholder="Search by title"
            className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-zinc-900 focus:ring-4 focus:ring-zinc-900/10"
          />
        </div>

        <div className="grid gap-1">
          <label className="text-xs font-medium uppercase tracking-wide text-zinc-600">Status</label>
          <select
            name="status"
            defaultValue={status}
            className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-zinc-900 focus:ring-4 focus:ring-zinc-900/10"
          >
            <option value="">all</option>
            <option value="draft">draft</option>
            <option value="pending">pending</option>
            <option value="published">published</option>
            <option value="rejected">rejected</option>
            <option value="archived">archived</option>
          </select>
        </div>

        <div className="grid gap-1">
          <label className="text-xs font-medium uppercase tracking-wide text-zinc-600">Visibility</label>
          <select
            name="visibility"
            defaultValue={visibility}
            className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-zinc-900 focus:ring-4 focus:ring-zinc-900/10"
          >
            <option value="">all</option>
            <option value="public">public</option>
            <option value="teacher_only">teacher_only</option>
            <option value="logged_in_only">logged_in_only</option>
            <option value="private">private</option>
          </select>
        </div>

        <div className="sm:col-span-4 flex items-center justify-end">
          <button
            type="submit"
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800 focus:outline-none focus:ring-4 focus:ring-zinc-900/20"
          >
            Apply filters
          </button>
        </div>
      </form>

      {resources?.length ? (
        <div className="overflow-hidden rounded-2xl border bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-50 text-xs font-medium uppercase tracking-wide text-zinc-600">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Creator</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Visibility</th>
                <th className="px-4 py-3">Updated</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {resources.map((r) => {
                const creator = r.created_by ? creatorMap.get(r.created_by) : null
                const creatorLabel = creator?.name ?? creator?.email ?? (r.created_by ? r.created_by.slice(0, 8) : '—')

                return (
                  <tr key={r.id} className="hover:bg-zinc-50">
                    <td className="px-4 py-3 font-medium text-zinc-950">
                      <Link href={`/dashboard/resources/${r.id}`} className="hover:underline">
                        {r.title}
                      </Link>
                      <div className="mt-1 text-xs text-zinc-600">
                        <Link href={`/dashboard/resources/${r.id}/edit`} className="hover:underline">
                          Edit resource
                        </Link>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-zinc-700">{creatorLabel}</td>
                    <td className="px-4 py-3 text-zinc-700">{r.status}</td>
                    <td className="px-4 py-3 text-zinc-700">{r.visibility}</td>
                    <td className="px-4 py-3 text-zinc-700">{new Date(r.updated_at).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <form action={adminSetResourceStatusAction}>
                          <input type="hidden" name="resource_id" value={r.id} />
                          <input type="hidden" name="status" value="draft" />
                          <button
                            type="submit"
                            className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-900 shadow-sm transition hover:bg-zinc-50 focus:outline-none focus:ring-4 focus:ring-zinc-900/10"
                          >
                            Set draft
                          </button>
                        </form>

                        <form action={adminSetResourceStatusAction}>
                          <input type="hidden" name="resource_id" value={r.id} />
                          <input type="hidden" name="status" value="published" />
                          <button
                            type="submit"
                            className="rounded-lg bg-zinc-900 px-3 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800 focus:outline-none focus:ring-4 focus:ring-zinc-900/20"
                          >
                            Publish
                          </button>
                        </form>

                        <form action={adminArchiveResourceAction}>
                          <input type="hidden" name="resource_id" value={r.id} />
                          <button
                            type="submit"
                            className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-sm font-medium text-amber-900 shadow-sm transition hover:bg-amber-100 focus:outline-none focus:ring-4 focus:ring-amber-500/20"
                          >
                            Archive
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="rounded-2xl border bg-white p-6 text-sm text-zinc-700">No resources found.</div>
      )}
    </div>
  )
}

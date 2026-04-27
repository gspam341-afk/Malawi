import Link from 'next/link'
import { requireAdmin } from '@/lib/auth'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export default async function AdminSubmissionsPage(props: {
  searchParams?: Promise<{ q?: string; status?: string; type?: string }>
}) {
  await requireAdmin()
  const { q = '', status = '', type = '' } = (await props.searchParams) ?? {}

  const supabase = await createSupabaseServerClient()

  let query = supabase
    .from('submissions')
    .select('id,title,submission_type,submitted_by,status,created_at')
    .order('created_at', { ascending: false })

  if (status) query = query.eq('status', status)
  if (type) query = query.eq('submission_type', type)
  if (q.trim()) query = query.ilike('title', `%${q.trim()}%`)

  const { data: submissions, error } = await query
  if (error) throw error

  const submitterIds = Array.from(new Set((submissions ?? []).map((s) => s.submitted_by).filter(Boolean))) as string[]
  const { data: submitters } = submitterIds.length
    ? await supabase.from('profiles').select('id,name,email').in('id', submitterIds)
    : { data: [] as { id: string; name: string | null; email: string | null }[] }

  const submitterMap = new Map((submitters ?? []).map((p) => [p.id, p]))

  return (
    <div className="grid gap-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Manage submissions</h1>
          <p className="mt-1 text-sm text-zinc-700">Review submitted content and set a status.</p>
        </div>
        <Link href="/dashboard" className="text-sm text-zinc-700 hover:text-zinc-950">
          Dashboard
        </Link>
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
            <option value="pending">pending</option>
            <option value="approved">approved</option>
            <option value="rejected">rejected</option>
            <option value="changes_requested">changes_requested</option>
          </select>
        </div>

        <div className="grid gap-1">
          <label className="text-xs font-medium uppercase tracking-wide text-zinc-600">Type</label>
          <select
            name="type"
            defaultValue={type}
            className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-zinc-900 focus:ring-4 focus:ring-zinc-900/10"
          >
            <option value="">all</option>
            <option value="blog_post">blog_post</option>
            <option value="activity_idea">activity_idea</option>
            <option value="teaching_material">teaching_material</option>
            <option value="printable_template">printable_template</option>
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

      {submissions?.length ? (
        <div className="overflow-hidden rounded-2xl border bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-50 text-xs font-medium uppercase tracking-wide text-zinc-600">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Submitted by</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {submissions.map((s) => {
                const submitter = s.submitted_by ? submitterMap.get(s.submitted_by) : null
                const submitterLabel = submitter?.name ?? submitter?.email ?? '—'

                return (
                  <tr key={s.id} className="hover:bg-zinc-50">
                    <td className="px-4 py-3 font-medium text-zinc-950">
                      <Link href={`/dashboard/submissions/${s.id}`} className="hover:underline">
                        {s.title}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-zinc-700">{s.submission_type}</td>
                    <td className="px-4 py-3 text-zinc-700">{submitterLabel}</td>
                    <td className="px-4 py-3 text-zinc-700">{s.status}</td>
                    <td className="px-4 py-3 text-zinc-700">{new Date(s.created_at).toLocaleDateString()}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="rounded-2xl border bg-white p-6 text-sm text-zinc-700">No submissions found.</div>
      )}
    </div>
  )
}

import Link from 'next/link'
import { requireAdmin } from '@/lib/auth'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export default async function AdminBlogPostsPage(props: {
  searchParams?: Promise<{ q?: string; status?: string }>
}) {
  await requireAdmin()
  const { q = '', status = '' } = (await props.searchParams) ?? {}

  const supabase = await createSupabaseServerClient()

  let query = supabase
    .from('blog_posts')
    .select('id,title,status,author_id,created_at,updated_at')
    .order('updated_at', { ascending: false })

  if (status) query = query.eq('status', status)
  if (q.trim()) query = query.ilike('title', `%${q.trim()}%`)

  const { data: posts, error } = await query
  if (error) throw error

  const authorIds = Array.from(new Set((posts ?? []).map((p) => p.author_id).filter(Boolean))) as string[]
  const { data: authors } = authorIds.length
    ? await supabase.from('profiles').select('id,name,email').in('id', authorIds)
    : { data: [] as { id: string; name: string | null; email: string | null }[] }

  const authorMap = new Map((authors ?? []).map((a) => [a.id, a]))

  return (
    <div className="grid gap-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Manage blog posts</h1>
          <p className="mt-1 text-sm text-zinc-700">Create and publish blog posts (admin).</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/blog-posts/new"
            className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
          >
            New post
          </Link>
          <Link href="/dashboard" className="text-sm text-zinc-700 hover:text-zinc-950">
            Dashboard
          </Link>
        </div>
      </div>

      <form className="grid gap-3 rounded-2xl border bg-white p-4 sm:grid-cols-4" method="get">
        <div className="grid gap-1 sm:col-span-3">
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
        <div className="sm:col-span-4 flex items-center justify-end">
          <button
            type="submit"
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800 focus:outline-none focus:ring-4 focus:ring-zinc-900/20"
          >
            Apply filters
          </button>
        </div>
      </form>

      {posts?.length ? (
        <div className="overflow-hidden rounded-2xl border bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-50 text-xs font-medium uppercase tracking-wide text-zinc-600">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Author</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Updated</th>
                <th className="px-4 py-3">Edit</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {posts.map((p) => {
                const author = p.author_id ? authorMap.get(p.author_id) : null
                const authorLabel = author?.name ?? author?.email ?? '—'

                return (
                  <tr key={p.id} className="hover:bg-zinc-50">
                    <td className="px-4 py-3 font-medium text-zinc-950">{p.title}</td>
                    <td className="px-4 py-3 text-zinc-700">{authorLabel}</td>
                    <td className="px-4 py-3 text-zinc-700">{p.status}</td>
                    <td className="px-4 py-3 text-zinc-700">{new Date(p.updated_at).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <Link href={`/dashboard/blog-posts/${p.id}/edit`} className="text-sm font-medium text-zinc-900 hover:underline">
                        Edit
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="rounded-2xl border bg-white p-6 text-sm text-zinc-700">No blog posts found.</div>
      )}
    </div>
  )
}

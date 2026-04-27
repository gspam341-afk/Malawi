import Link from 'next/link'
import { requireProfile } from '@/lib/auth'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { setBlogPostStatusAction } from '@/app/dashboard/blog-posts/actions'
import { AdminPageHeader } from '@/components/dashboard/AdminPageHeader'
import { BlogStatusBadge } from '@/components/dashboard/DashboardStatusBadge'
import { dashInput, dashMuted, dashPanelSolid } from '@/components/dashboard/classes'
import { TableShell } from '@/components/dashboard/TableShell'
import { ActionButton } from '@/components/dashboard/ActionButton'
import { EmptyState } from '@/components/ui/EmptyState'

export default async function BlogPostsPage(props: {
  searchParams?: Promise<{ q?: string; status?: string }>
}) {
  const profile = await requireProfile()
  if (profile.role === 'student_optional') {
    return (
      <div className="rounded-2xl border border-amber-100 bg-amber-50/60 p-8 text-center text-sm text-slate-700">
        Blog authoring is not available for optional student accounts.
      </div>
    )
  }

  const { q = '', status = '' } = (await props.searchParams) ?? {}

  const supabase = await createSupabaseServerClient()

  let query = supabase
    .from('blog_posts')
    .select('id,title,status,author_id,created_at,updated_at')
    .order('updated_at', { ascending: false })

  if (profile.role !== 'admin') {
    query = query.eq('author_id', profile.id)
  }

  if (status) query = query.eq('status', status)
  if (q.trim()) query = query.ilike('title', `%${q.trim()}%`)

  const { data: posts, error } = await query
  if (error) throw error

  const authorIds = Array.from(new Set((posts ?? []).map((p) => p.author_id).filter(Boolean))) as string[]
  const { data: authors } = authorIds.length
    ? await supabase.from('profiles').select('id,name,email').in('id', authorIds)
    : { data: [] as { id: string; name: string | null; email: string | null }[] }

  const authorMap = new Map((authors ?? []).map((a) => [a.id, a]))

  const isAdminView = profile.role === 'admin'

  return (
    <div className="grid gap-10">
      <AdminPageHeader
        eyebrow="Stories"
        title={isAdminView ? 'Blog posts (platform)' : 'My blog posts'}
        description={
          isAdminView
            ? 'Review every story across authors. Publishing here matches the visibility rules you set in actions.'
            : 'Draft ideas, submit for review, or publish when your role allows.'
        }
        actions={
          <Link
            href="/dashboard/blog-posts/new"
            className="inline-flex rounded-xl bg-gradient-to-r from-teal-600 to-teal-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:from-teal-700 hover:to-teal-800"
          >
            New post
          </Link>
        }
      />

      <section className={`${dashPanelSolid} p-5 md:p-6`}>
        <h2 className="text-sm font-semibold text-slate-900">Find a post</h2>
        <p className={`mt-1 ${dashMuted}`}>Search titles or filter by workflow status.</p>
        <form className="mt-6 grid gap-4 md:grid-cols-12" method="get">
          <div className="md:col-span-8">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Search</label>
            <input name="q" defaultValue={q} placeholder="Title contains…" className={`${dashInput} mt-2`} />
          </div>
          <div className="md:col-span-3">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Status</label>
            <select name="status" defaultValue={status} className={`${dashInput} mt-2`}>
              <option value="">All statuses</option>
              <option value="draft">draft</option>
              <option value="pending">pending</option>
              <option value="published">published</option>
              <option value="rejected">rejected</option>
              <option value="archived">archived</option>
            </select>
          </div>
          <div className="flex items-end md:col-span-1">
            <ActionButton type="submit" className="w-full md:w-auto">
              Apply
            </ActionButton>
          </div>
        </form>
      </section>

      {posts?.length ? (
        <TableShell>
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b border-slate-100 bg-gradient-to-r from-teal-50/90 via-white to-amber-50/40">
              <tr className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                <th className="px-4 py-4">Title</th>
                <th className="px-4 py-4">Status</th>
                <th className="px-4 py-4">Author</th>
                <th className="hidden px-4 py-4 md:table-cell">Created</th>
                <th className="px-4 py-4">Updated</th>
                <th className="px-4 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {posts.map((p) => {
                const author = p.author_id ? authorMap.get(p.author_id) : null
                const authorLabel = author?.name ?? author?.email ?? '—'

                const isAdmin = profile.role === 'admin'
                const isAuthor = p.author_id === profile.id
                const canEdit = isAdmin || isAuthor
                const showPublish =
                  isAdmin ? p.status !== 'published' : profile.role === 'teacher' && isAuthor && p.status !== 'published'
                const showArchive =
                  isAdmin ? p.status !== 'archived' : profile.role === 'teacher' && isAuthor && p.status !== 'archived'

                return (
                  <tr key={p.id} className="hover:bg-teal-50/20">
                    <td className="px-4 py-4 font-medium text-slate-900">{p.title}</td>
                    <td className="px-4 py-4">
                      <BlogStatusBadge status={p.status} />
                    </td>
                    <td className="px-4 py-4 text-slate-700">{authorLabel}</td>
                    <td className="hidden px-4 py-4 text-slate-600 md:table-cell">
                      {new Date(p.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4 text-slate-600">{new Date(p.updated_at).toLocaleDateString()}</td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap items-center gap-2">
                        {canEdit ? (
                          <Link
                            href={`/dashboard/blog-posts/${p.id}/edit`}
                            className="rounded-lg px-2 py-1 text-sm font-semibold text-teal-800 hover:bg-teal-50"
                          >
                            Edit
                          </Link>
                        ) : null}

                        {showPublish ? (
                          <form action={setBlogPostStatusAction.bind(null, p.id)} className="inline">
                            <input type="hidden" name="status" value="published" />
                            <button
                              type="submit"
                              className="rounded-lg px-2 py-1 text-sm font-semibold text-emerald-800 hover:bg-emerald-50"
                            >
                              Publish
                            </button>
                          </form>
                        ) : null}

                        {showArchive ? (
                          <form action={setBlogPostStatusAction.bind(null, p.id)} className="inline">
                            <input type="hidden" name="status" value="archived" />
                            <button
                              type="submit"
                              className="rounded-lg px-2 py-1 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                            >
                              Archive
                            </button>
                          </form>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </TableShell>
      ) : (
        <EmptyState
          title="No blog posts yet"
          description="Share classroom wins, printable tips, or community updates — start with a draft and refine before publishing."
        >
          <Link
            href="/dashboard/blog-posts/new"
            className="inline-flex rounded-xl bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700"
          >
            Write your first post
          </Link>
        </EmptyState>
      )}
    </div>
  )
}

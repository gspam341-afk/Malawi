import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requireProfile } from '@/lib/auth'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { updateBlogPostAction } from '@/app/dashboard/blog-posts/actions'
import type { Tables } from '@/types/db'

type BlogStatus = Tables['blog_posts']['Row']['status']

function allowedBlogStatusesForRole(role: Tables['profiles']['Row']['role']): readonly BlogStatus[] {
  if (role === 'admin') return ['draft', 'pending', 'published', 'rejected', 'archived']
  if (role === 'teacher') return ['draft', 'pending', 'published', 'archived']
  if (role === 'alumni' || role === 'donor') return ['draft', 'pending']
  return []
}

export default async function EditBlogPostPage(props: { params: Promise<{ id: string }> }) {
  const profile = await requireProfile()
  if (profile.role === 'student_optional') {
    return (
      <div className="rounded-2xl border bg-white p-6 text-sm text-zinc-700">This page is not available for students.</div>
    )
  }

  const allowedStatuses = allowedBlogStatusesForRole(profile.role)
  if (!allowedStatuses.length) {
    return (
      <div className="rounded-2xl border bg-white p-6 text-sm text-zinc-700">You do not have access to edit blog posts.</div>
    )
  }

  const { id } = await props.params

  const supabase = await createSupabaseServerClient()
  const { data: post, error } = await supabase
    .from('blog_posts')
    .select('id,title,slug,excerpt,content,cover_image_url,status,author_id')
    .eq('id', id)
    .single()

  if (error) throw error
  if (!post) notFound()

  if (profile.role !== 'admin' && post.author_id !== profile.id) {
    notFound()
  }

  if ((profile.role === 'alumni' || profile.role === 'donor') && !(post.status === 'draft' || post.status === 'pending' || post.status === 'rejected')) {
    notFound()
  }

  return (
    <div className="grid gap-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Edit blog post</h1>
          <p className="mt-1 text-sm text-zinc-700">Update content and publishing status.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/dashboard/blog-posts" className="text-sm text-zinc-700 hover:text-zinc-950">
            ← Back
          </Link>
        </div>
      </div>

      <form action={updateBlogPostAction.bind(null, id)} className="grid gap-6">
        <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-semibold">Post</h2>
          <div className="mt-4 grid gap-4">
            <div className="grid gap-1">
              <label className="text-sm font-medium">Title</label>
              <input
                name="title"
                required
                defaultValue={post.title}
                className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-zinc-900 focus:ring-4 focus:ring-zinc-900/10"
              />
            </div>

            <div className="grid gap-1">
              <label className="text-sm font-medium">Slug</label>
              <input
                name="slug"
                defaultValue={post.slug ?? ''}
                className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-zinc-900 focus:ring-4 focus:ring-zinc-900/10"
              />
            </div>

            <div className="grid gap-1">
              <label className="text-sm font-medium">Excerpt</label>
              <textarea
                name="excerpt"
                rows={2}
                defaultValue={post.excerpt ?? ''}
                className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-zinc-900 focus:ring-4 focus:ring-zinc-900/10"
              />
            </div>

            <div className="grid gap-1">
              <label className="text-sm font-medium">Content</label>
              <textarea
                name="content"
                rows={10}
                defaultValue={post.content ?? ''}
                className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-zinc-900 focus:ring-4 focus:ring-zinc-900/10"
              />
            </div>

            <div className="grid gap-1">
              <label className="text-sm font-medium">Cover image URL</label>
              <input
                name="cover_image_url"
                defaultValue={post.cover_image_url ?? ''}
                className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-zinc-900 focus:ring-4 focus:ring-zinc-900/10"
              />
            </div>

            <div className="grid gap-1">
              <label className="text-sm font-medium">Status</label>
              <select
                name="status"
                defaultValue={post.status}
                className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-zinc-900 focus:ring-4 focus:ring-zinc-900/10"
              >
                {allowedStatuses.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        <div className="flex items-center justify-end gap-3">
          <Link href="/dashboard/blog-posts" className="text-sm text-zinc-700 hover:text-zinc-950">
            Cancel
          </Link>
          <button
            type="submit"
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800 focus:outline-none focus:ring-4 focus:ring-zinc-900/20"
          >
            Save changes
          </button>
        </div>
      </form>
    </div>
  )
}

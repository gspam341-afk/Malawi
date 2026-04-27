import Link from 'next/link'
import { requireAdmin } from '@/lib/auth'
import { createBlogPostAction } from '@/app/dashboard/blog-posts/actions'

export default async function NewBlogPostPage() {
  await requireAdmin()

  return (
    <div className="grid gap-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">New blog post</h1>
          <p className="mt-1 text-sm text-zinc-700">Create a new post.</p>
        </div>
        <Link href="/dashboard/blog-posts" className="text-sm text-zinc-700 hover:text-zinc-950">
          ← Back
        </Link>
      </div>

      <form action={createBlogPostAction} className="grid gap-6">
        <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-semibold">Post</h2>
          <div className="mt-4 grid gap-4">
            <div className="grid gap-1">
              <label className="text-sm font-medium">Title</label>
              <input
                name="title"
                required
                className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-zinc-900 focus:ring-4 focus:ring-zinc-900/10"
              />
            </div>

            <div className="grid gap-1">
              <label className="text-sm font-medium">Slug</label>
              <input
                name="slug"
                placeholder="optional"
                className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-zinc-900 focus:ring-4 focus:ring-zinc-900/10"
              />
            </div>

            <div className="grid gap-1">
              <label className="text-sm font-medium">Excerpt</label>
              <textarea
                name="excerpt"
                rows={2}
                className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-zinc-900 focus:ring-4 focus:ring-zinc-900/10"
              />
            </div>

            <div className="grid gap-1">
              <label className="text-sm font-medium">Content</label>
              <textarea
                name="content"
                rows={10}
                className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-zinc-900 focus:ring-4 focus:ring-zinc-900/10"
              />
            </div>

            <div className="grid gap-1">
              <label className="text-sm font-medium">Cover image URL</label>
              <input
                name="cover_image_url"
                placeholder="optional"
                className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-zinc-900 focus:ring-4 focus:ring-zinc-900/10"
              />
            </div>

            <div className="grid gap-1">
              <label className="text-sm font-medium">Status</label>
              <select
                name="status"
                defaultValue="draft"
                className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-zinc-900 focus:ring-4 focus:ring-zinc-900/10"
              >
                <option value="draft">draft</option>
                <option value="pending">pending</option>
                <option value="published">published</option>
                <option value="rejected">rejected</option>
                <option value="archived">archived</option>
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
            Create
          </button>
        </div>
      </form>
    </div>
  )
}

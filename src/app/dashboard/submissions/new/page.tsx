import Link from 'next/link'
import { requireProfile } from '@/lib/auth'
import { createSubmissionAction } from '@/app/dashboard/submissions/actions'

export default async function NewSubmissionPage() {
  const profile = await requireProfile()
  if (profile.role === 'student_optional') {
    return (
      <div className="rounded-2xl border bg-white p-6 text-sm text-zinc-700">This page is not available for students.</div>
    )
  }

  const allowed =
    profile.role === 'admin' || profile.role === 'teacher' || profile.role === 'alumni' || profile.role === 'donor'
  if (!allowed) {
    return (
      <div className="rounded-2xl border bg-white p-6 text-sm text-zinc-700">You do not have access to create submissions.</div>
    )
  }

  return (
    <div className="grid gap-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">New submission</h1>
          <p className="mt-1 text-sm text-zinc-700">Submit an activity idea or other content for review.</p>
        </div>
        <Link href="/dashboard/submissions" className="text-sm text-zinc-700 hover:text-zinc-950">
          ← Back
        </Link>
      </div>

      <form action={createSubmissionAction} className="grid gap-6">
        <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-semibold">Submission</h2>
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
              <label className="text-sm font-medium">Description</label>
              <textarea
                name="description"
                rows={5}
                className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-zinc-900 focus:ring-4 focus:ring-zinc-900/10"
              />
            </div>

            <div className="grid gap-1">
              <label className="text-sm font-medium">Submission type</label>
              <select
                name="submission_type"
                defaultValue="activity_idea"
                className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-zinc-900 focus:ring-4 focus:ring-zinc-900/10"
              >
                <option value="blog_post">blog_post</option>
                <option value="activity_idea">activity_idea</option>
                <option value="teaching_material">teaching_material</option>
                <option value="printable_template">printable_template</option>
              </select>
            </div>

            <div className="grid gap-1">
              <label className="text-sm font-medium">File URL</label>
              <input
                name="file_url"
                placeholder="optional"
                className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-zinc-900 focus:ring-4 focus:ring-zinc-900/10"
              />
            </div>

            <div className="grid gap-1">
              <label className="text-sm font-medium">External link</label>
              <input
                name="external_link"
                placeholder="optional"
                className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-zinc-900 focus:ring-4 focus:ring-zinc-900/10"
              />
            </div>
          </div>
        </section>

        <div className="flex items-center justify-end gap-3">
          <Link href="/dashboard/submissions" className="text-sm text-zinc-700 hover:text-zinc-950">
            Cancel
          </Link>
          <button
            type="submit"
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800 focus:outline-none focus:ring-4 focus:ring-zinc-900/20"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  )
}

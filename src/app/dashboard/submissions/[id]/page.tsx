import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requireAdmin } from '@/lib/auth'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { updateSubmissionStatusAction } from '@/app/dashboard/submissions/actions'

export default async function SubmissionDetailPage(props: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin()
  const { id } = await props.params

  const supabase = await createSupabaseServerClient()

  const { data: submission, error } = await supabase
    .from('submissions')
    .select('id,title,description,submission_type,file_url,external_link,submitted_by,status,rejection_reason,created_at,updated_at')
    .eq('id', id)
    .single()

  if (error) throw error
  if (!submission) notFound()

  const submitterId = submission.submitted_by
  const { data: submitter } = submitterId
    ? await supabase.from('profiles').select('id,name,email').eq('id', submitterId).single()
    : { data: null as null | { id: string; name: string | null; email: string | null } }

  const submitterLabel = submitter?.name ?? submitter?.email ?? '—'

  return (
    <div className="grid gap-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Submission</h1>
          <p className="mt-1 text-sm text-zinc-700">Review and update status.</p>
        </div>
        <Link href="/dashboard/submissions" className="text-sm text-zinc-700 hover:text-zinc-950">
          ← Back
        </Link>
      </div>

      <section className="rounded-2xl border bg-white p-6">
        <div className="grid gap-2">
          <div className="text-lg font-semibold text-zinc-950">{submission.title}</div>
          <div className="text-sm text-zinc-700">Type: {submission.submission_type}</div>
          <div className="text-sm text-zinc-700">Submitted by: {submitterLabel}</div>
          <div className="text-sm text-zinc-700">Status: {submission.status}</div>
          <div className="text-sm text-zinc-700">Created: {new Date(submission.created_at).toLocaleString()}</div>
        </div>

        {submission.description ? (
          <div className="mt-4 text-sm text-zinc-800 whitespace-pre-wrap">{submission.description}</div>
        ) : null}

        <div className="mt-4 grid gap-2 text-sm">
          {submission.file_url ? (
            <div>
              <span className="font-medium text-zinc-900">File:</span> {submission.file_url}
            </div>
          ) : null}
          {submission.external_link ? (
            <div>
              <span className="font-medium text-zinc-900">External link:</span>{' '}
              <a className="text-zinc-900 underline" href={submission.external_link} target="_blank" rel="noreferrer">
                {submission.external_link}
              </a>
            </div>
          ) : null}
        </div>
      </section>

      <form action={updateSubmissionStatusAction.bind(null, id)} className="rounded-2xl border bg-white p-6">
        <h2 className="text-base font-semibold">Admin actions</h2>
        <div className="mt-4 grid gap-4">
          <div className="grid gap-1">
            <label className="text-sm font-medium">Status</label>
            <select
              name="status"
              defaultValue={submission.status}
              className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-zinc-900 focus:ring-4 focus:ring-zinc-900/10"
            >
              <option value="pending">pending</option>
              <option value="approved">approved</option>
              <option value="rejected">rejected</option>
              <option value="changes_requested">changes_requested</option>
            </select>
          </div>

          <div className="grid gap-1">
            <label className="text-sm font-medium">Rejection / changes reason</label>
            <textarea
              name="rejection_reason"
              defaultValue={submission.rejection_reason ?? ''}
              rows={3}
              className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-zinc-900 focus:ring-4 focus:ring-zinc-900/10"
            />
            <div className="text-xs text-zinc-600">Only used when status is rejected or changes_requested.</div>
          </div>

          <div className="flex items-center justify-end gap-3">
            <Link href="/dashboard/submissions" className="text-sm text-zinc-700 hover:text-zinc-950">
              Cancel
            </Link>
            <button
              type="submit"
              className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800 focus:outline-none focus:ring-4 focus:ring-zinc-900/20"
            >
              Save
            </button>
          </div>
        </div>

        <input type="hidden" name="reviewed_by" value={admin.id} />
      </form>
    </div>
  )
}

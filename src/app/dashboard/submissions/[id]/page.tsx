import {
  CheckCircle2,
  FileText,
  Inbox,
  ShieldCheck,
} from 'lucide-react'
import { notFound } from 'next/navigation'
import { requireProfile } from '@/lib/auth'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { updateSubmissionContentAction, updateSubmissionStatusAction } from '@/app/dashboard/submissions/actions'
import { AdminPageHeader } from '@/components/dashboard/AdminPageHeader'
import { ActionButton } from '@/components/dashboard/ActionButton'
import { FieldLabel } from '@/components/dashboard/FieldLabel'
import { FormSection } from '@/components/dashboard/FormSection'
import { SubmissionStatusBadge, SubmissionTypeBadge } from '@/components/dashboard/DashboardStatusBadge'
import { dashInput, dashPanelSolid, dashTextarea } from '@/components/dashboard/classes'

export default async function SubmissionDetailPage(props: { params: Promise<{ id: string }> }) {
  const profile = await requireProfile()
  if (profile.role === 'student_optional') {
    return (
      <div className="rounded-2xl border border-amber-100 bg-amber-50/70 p-8 text-center text-sm text-slate-700">
        Submissions are not available for optional student accounts.
      </div>
    )
  }

  const { id } = await props.params

  const supabase = await createSupabaseServerClient()

  const { data: submission, error } = await supabase
    .from('submissions')
    .select(
      'id,title,description,submission_type,file_url,external_link,submitted_by,status,rejection_reason,created_at,updated_at',
    )
    .eq('id', id)
    .single()

  if (error) throw error
  if (!submission) notFound()

  const isAdmin = profile.role === 'admin'
  const isCreator = submission.submitted_by === profile.id

  if (!isAdmin && !isCreator) {
    notFound()
  }

  const submitterId = submission.submitted_by
  const { data: submitter } = submitterId
    ? await supabase.from('profiles').select('id,name,email').eq('id', submitterId).single()
    : { data: null as null | { id: string; name: string | null; email: string | null } }

  const submitterLabel = submitter?.name ?? submitter?.email ?? '—'

  const canCreatorEdit = isCreator && (submission.status === 'pending' || submission.status === 'changes_requested')

  return (
    <div className="grid gap-10">
      <AdminPageHeader
        eyebrow="Submission"
        title={submission.title}
        description={
          isAdmin
            ? 'Review details, respond with a status, and leave guidance when something needs another pass.'
            : 'Track how your idea is progressing through review.'
        }
        backHref="/dashboard/submissions"
        backLabel="Submissions"
        titleIcon={Inbox}
      />

      <section className={`${dashPanelSolid} p-6 md:p-8`}>
        <div className="flex flex-wrap gap-2">
          <SubmissionTypeBadge type={submission.submission_type} />
          <SubmissionStatusBadge status={submission.status} />
        </div>
        <dl className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Submitted by</dt>
            <dd className="mt-1 font-medium text-slate-900">{submitterLabel}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Created</dt>
            <dd className="mt-1 text-slate-800">{new Date(submission.created_at).toLocaleString()}</dd>
          </div>
        </dl>

        {submission.description ? (
          <div className="mt-8 border-t border-slate-100 pt-8">
            <h2 className="text-sm font-semibold text-slate-900">Description</h2>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-slate-700">{submission.description}</p>
          </div>
        ) : (
          <p className="mt-6 text-sm text-slate-500">No description provided.</p>
        )}

        <div className="mt-8 grid gap-3 text-sm">
          {submission.file_url ? (
            <div>
              <span className="font-semibold text-slate-900">File</span>{' '}
              <a className="font-medium text-teal-800 underline-offset-4 hover:underline" href={submission.file_url} target="_blank" rel="noreferrer">
                Open link
              </a>
            </div>
          ) : null}
          {submission.external_link ? (
            <div>
              <span className="font-semibold text-slate-900">External link</span>{' '}
              <a
                className="font-medium text-teal-800 underline-offset-4 hover:underline"
                href={submission.external_link}
                target="_blank"
                rel="noreferrer"
              >
                {submission.external_link}
              </a>
            </div>
          ) : null}
        </div>

        {submission.rejection_reason && (submission.status === 'rejected' || submission.status === 'changes_requested') ? (
          <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
            <span className="font-semibold">Reviewer note: </span>
            {submission.rejection_reason}
          </div>
        ) : null}
      </section>

      {canCreatorEdit ? (
        <FormSection
          icon={FileText}
          title="Update your submission"
          description="You can edit while the status is pending or changes are requested."
        >
          <form action={updateSubmissionContentAction.bind(null, id)} className="grid max-w-xl gap-5">
            <div>
              <FieldLabel htmlFor="ed-title">Title</FieldLabel>
              <input id="ed-title" name="title" required defaultValue={submission.title} className={`${dashInput} mt-2`} />
            </div>
            <div>
              <FieldLabel htmlFor="ed-desc">Description</FieldLabel>
              <textarea
                id="ed-desc"
                name="description"
                rows={5}
                defaultValue={submission.description ?? ''}
                className={`${dashTextarea} mt-2`}
              />
            </div>
            <div>
              <FieldLabel htmlFor="ed-type">Submission type</FieldLabel>
              <select
                id="ed-type"
                name="submission_type"
                defaultValue={submission.submission_type}
                className={`${dashInput} mt-2`}
              >
                <option value="blog_post">blog_post</option>
                <option value="activity_idea">activity_idea</option>
                <option value="teaching_material">teaching_material</option>
                <option value="printable_template">printable_template</option>
              </select>
            </div>
            <div>
              <FieldLabel htmlFor="ed-file">File URL</FieldLabel>
              <input id="ed-file" name="file_url" defaultValue={submission.file_url ?? ''} className={`${dashInput} mt-2`} />
            </div>
            <div>
              <FieldLabel htmlFor="ed-link">External link</FieldLabel>
              <input
                id="ed-link"
                name="external_link"
                defaultValue={submission.external_link ?? ''}
                className={`${dashInput} mt-2`}
              />
            </div>
            <div className="flex justify-end pt-2">
              <ActionButton type="submit" icon={CheckCircle2}>
                Save updates
              </ActionButton>
            </div>
          </form>
        </FormSection>
      ) : null}

      {isAdmin ? (
        <section className="rounded-2xl border-l-4 border-violet-400 bg-gradient-to-br from-violet-50/80 to-white p-6 shadow-md shadow-slate-200/40 md:p-8">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
            <ShieldCheck className="h-6 w-6 text-violet-700" aria-hidden />
            Platform review
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Change status for everyone involved. Pair rejections or change requests with clear feedback.
          </p>
          <form action={updateSubmissionStatusAction.bind(null, id)} className="mt-6 grid max-w-xl gap-5">
            <div>
              <FieldLabel htmlFor="adm-status">Status</FieldLabel>
              <select id="adm-status" name="status" defaultValue={submission.status} className={`${dashInput} mt-2`}>
                <option value="pending">pending</option>
                <option value="approved">approved</option>
                <option value="rejected">rejected</option>
                <option value="changes_requested">changes_requested</option>
              </select>
            </div>
            <div>
              <FieldLabel htmlFor="adm-note" hint="Shown to the submitter when you reject or request edits.">
                Feedback for submitter
              </FieldLabel>
              <textarea
                id="adm-note"
                name="rejection_reason"
                rows={4}
                defaultValue={submission.rejection_reason ?? ''}
                className={`${dashTextarea} mt-2`}
              />
            </div>
            <div className="flex justify-end">
              <ActionButton type="submit" icon={CheckCircle2}>
                Save decision
              </ActionButton>
            </div>
          </form>
        </section>
      ) : null}
    </div>
  )
}

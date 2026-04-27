import Link from 'next/link'
import { Inbox, PlusCircle, Search, Send, SlidersHorizontal } from 'lucide-react'
import { requireProfile } from '@/lib/auth'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { AdminPageHeader } from '@/components/dashboard/AdminPageHeader'
import { ActionButton } from '@/components/dashboard/ActionButton'
import { dashInput, dashMuted, dashPanelSolid } from '@/components/dashboard/classes'
import { SubmissionStatusBadge, SubmissionTypeBadge } from '@/components/dashboard/DashboardStatusBadge'
import { TableShell } from '@/components/dashboard/TableShell'
import { EmptyState } from '@/components/ui/EmptyState'

export default async function SubmissionsPage(props: {
  searchParams?: Promise<{ q?: string; status?: string; type?: string }>
}) {
  const profile = await requireProfile()
  if (profile.role === 'student_optional') {
    return (
      <div className="rounded-2xl border border-amber-100 bg-amber-50/70 p-8 text-center text-sm text-slate-700">
        Optional student accounts cannot submit ideas through this workflow.
      </div>
    )
  }

  const { q = '', status = '', type = '' } = (await props.searchParams) ?? {}

  const supabase = await createSupabaseServerClient()

  let query = supabase
    .from('submissions')
    .select('id,title,submission_type,submitted_by,status,created_at')
    .order('created_at', { ascending: false })

  if (profile.role !== 'admin') {
    query = query.eq('submitted_by', profile.id)
  }

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

  const canCreate =
    profile.role === 'admin' || profile.role === 'teacher' || profile.role === 'alumni' || profile.role === 'donor'

  const isAdmin = profile.role === 'admin'

  return (
    <div className="grid gap-10">
      <AdminPageHeader
        eyebrow="Ideas inbox"
        title={isAdmin ? 'Submissions (platform)' : 'My submissions'}
        description={
          isAdmin
            ? 'Teachers, alumni and donors send printable ideas or materials — triage here before they become formal resources.'
            : 'Ideas stay pending until reviewed. You will see feedback if changes are requested.'
        }
        titleIcon={Inbox}
        actions={
          <>
            {canCreate ? (
              <Link
                href="/dashboard/submissions/new"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-teal-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:from-teal-700 hover:to-teal-800"
              >
                <PlusCircle className="h-4 w-4" aria-hidden />
                New submission
              </Link>
            ) : null}
          </>
        }
      />

      <section className={`${dashPanelSolid} p-5 md:p-6`}>
        <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-900">
          <SlidersHorizontal className="h-4 w-4 text-teal-700" aria-hidden />
          Filters
        </h2>
        <p className={`mt-1 ${dashMuted}`}>Find a submission by title or narrow the queue.</p>
        <form className="mt-6 grid gap-4 md:grid-cols-12" method="get">
          <div className="md:col-span-5">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Search</label>
            <input name="q" defaultValue={q} placeholder="Title…" className={`${dashInput} mt-2`} />
          </div>
          <div className="md:col-span-3">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Status</label>
            <select name="status" defaultValue={status} className={`${dashInput} mt-2`}>
              <option value="">All</option>
              <option value="pending">pending</option>
              <option value="approved">approved</option>
              <option value="rejected">rejected</option>
              <option value="changes_requested">changes_requested</option>
            </select>
          </div>
          <div className="md:col-span-3">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Type</label>
            <select name="type" defaultValue={type} className={`${dashInput} mt-2`}>
              <option value="">All</option>
              <option value="blog_post">blog_post</option>
              <option value="activity_idea">activity_idea</option>
              <option value="teaching_material">teaching_material</option>
              <option value="printable_template">printable_template</option>
            </select>
          </div>
          <div className="flex items-end md:col-span-1">
            <ActionButton type="submit" className="w-full md:w-auto" icon={Search}>
              Apply
            </ActionButton>
          </div>
        </form>
      </section>

      {submissions?.length ? (
        <TableShell>
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-slate-100 bg-gradient-to-r from-teal-50/90 via-white to-amber-50/40">
              <tr className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                <th className="px-4 py-4">Title</th>
                <th className="px-4 py-4">Type</th>
                <th className="px-4 py-4">Status</th>
                <th className="hidden px-4 py-4 lg:table-cell">Submitted by</th>
                <th className="px-4 py-4">Created</th>
                <th className="px-4 py-4"> </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {submissions.map((s) => {
                const submitter = s.submitted_by ? submitterMap.get(s.submitted_by) : null
                const submitterLabel = submitter?.name ?? submitter?.email ?? '—'

                return (
                  <tr key={s.id} className="hover:bg-teal-50/20">
                    <td className="px-4 py-4 font-medium text-slate-900">{s.title}</td>
                    <td className="px-4 py-4">
                      <SubmissionTypeBadge type={s.submission_type} />
                    </td>
                    <td className="px-4 py-4">
                      <SubmissionStatusBadge status={s.status} />
                    </td>
                    <td className="hidden px-4 py-4 text-slate-700 lg:table-cell">{submitterLabel}</td>
                    <td className="px-4 py-4 text-slate-600">{new Date(s.created_at).toLocaleDateString()}</td>
                    <td className="px-4 py-4">
                      <Link
                        href={`/dashboard/submissions/${s.id}`}
                        className="font-semibold text-teal-800 hover:text-teal-950 hover:underline"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </TableShell>
      ) : (
        <EmptyState
          icon={Inbox}
          title="Nothing in this queue yet"
          description="Submissions are informal ideas or files waiting for review — share something when you are ready."
        >
          {canCreate ? (
            <Link
              href="/dashboard/submissions/new"
              className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700"
            >
              <Send className="h-4 w-4" aria-hidden />
              Submit an idea
            </Link>
          ) : null}
        </EmptyState>
      )}
    </div>
  )
}

import Link from 'next/link'
import { requireAdmin } from '@/lib/auth'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { adminArchiveResourceAction, adminSetResourceStatusAction } from '@/app/dashboard/resources/manage/actions'
import { AdminPageHeader } from '@/components/dashboard/AdminPageHeader'
import {
  ResourceStatusBadge,
  VisibilityBadge,
} from '@/components/dashboard/DashboardStatusBadge'
import { ActionButton, SecondaryButton } from '@/components/dashboard/ActionButton'
import { dashInput, dashMuted, dashPanelSolid } from '@/components/dashboard/classes'
import { TableShell } from '@/components/dashboard/TableShell'
import { EmptyState } from '@/components/ui/EmptyState'

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
    <div className="grid gap-10">
      <AdminPageHeader
        eyebrow="Platform"
        title="Manage resources"
        description="Moderate status and visibility for any activity on the site. Prefer dialogue with teachers before archiving their work."
        actions={
          <Link href="/dashboard/resources" className="text-sm font-medium text-teal-800 hover:underline">
            Teacher view →
          </Link>
        }
      />

      <section className={`${dashPanelSolid} p-5 md:p-6`}>
        <h2 className="text-sm font-semibold text-slate-900">Filters</h2>
        <p className={`mt-1 ${dashMuted}`}>Search by title or narrow by workflow state.</p>
        <form className="mt-6 grid gap-4 md:grid-cols-12" method="get">
          <div className="md:col-span-5">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Search</label>
            <input name="q" defaultValue={q} placeholder="Title contains…" className={`${dashInput} mt-2`} />
          </div>
          <div className="md:col-span-3">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Status</label>
            <select name="status" defaultValue={status} className={`${dashInput} mt-2`}>
              <option value="">All</option>
              <option value="draft">draft</option>
              <option value="pending">pending</option>
              <option value="published">published</option>
              <option value="rejected">rejected</option>
              <option value="archived">archived</option>
            </select>
          </div>
          <div className="md:col-span-3">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Visibility</label>
            <select name="visibility" defaultValue={visibility} className={`${dashInput} mt-2`}>
              <option value="">All</option>
              <option value="public">public</option>
              <option value="teacher_only">teacher_only</option>
              <option value="logged_in_only">logged_in_only</option>
              <option value="private">private</option>
            </select>
          </div>
          <div className="flex items-end md:col-span-1">
            <ActionButton type="submit" className="w-full md:w-auto">
              Apply
            </ActionButton>
          </div>
        </form>
      </section>

      {resources?.length ? (
        <TableShell>
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="border-b border-slate-100 bg-gradient-to-r from-teal-50/90 via-white to-amber-50/40">
              <tr className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                <th className="px-4 py-4">Activity</th>
                <th className="px-4 py-4">Creator</th>
                <th className="px-4 py-4">Status</th>
                <th className="px-4 py-4">Visibility</th>
                <th className="px-4 py-4">Updated</th>
                <th className="px-4 py-4">Moderation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {resources.map((r) => {
                const creator = r.created_by ? creatorMap.get(r.created_by) : null
                const creatorLabel = creator?.name ?? creator?.email ?? (r.created_by ? r.created_by.slice(0, 8) : '—')

                return (
                  <tr key={r.id} className="align-top hover:bg-teal-50/20">
                    <td className="px-4 py-4">
                      <Link href={`/dashboard/resources/${r.id}`} className="font-semibold text-slate-900 hover:text-teal-800 hover:underline">
                        {r.title}
                      </Link>
                      <div className="mt-1 text-xs">
                        <Link href={`/dashboard/resources/${r.id}/edit`} className="font-medium text-teal-800 hover:underline">
                          Edit resource →
                        </Link>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-slate-700">{creatorLabel}</td>
                    <td className="px-4 py-4">
                      <ResourceStatusBadge status={r.status} />
                    </td>
                    <td className="px-4 py-4">
                      <VisibilityBadge visibility={r.visibility} />
                    </td>
                    <td className="px-4 py-4 text-slate-600">{new Date(r.updated_at).toLocaleDateString()}</td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                        <form action={adminSetResourceStatusAction}>
                          <input type="hidden" name="resource_id" value={r.id} />
                          <input type="hidden" name="status" value="draft" />
                          <SecondaryButton type="submit">Draft</SecondaryButton>
                        </form>
                        <form action={adminSetResourceStatusAction}>
                          <input type="hidden" name="resource_id" value={r.id} />
                          <input type="hidden" name="status" value="published" />
                          <ActionButton type="submit">Publish</ActionButton>
                        </form>
                        <form action={adminArchiveResourceAction}>
                          <input type="hidden" name="resource_id" value={r.id} />
                          <button
                            type="submit"
                            className="inline-flex rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm font-semibold text-amber-950 hover:bg-amber-100"
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
        </TableShell>
      ) : (
        <EmptyState title="No resources match" description="Try clearing filters or check another status." />
      )}
    </div>
  )
}

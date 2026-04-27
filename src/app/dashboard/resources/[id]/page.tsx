import Link from 'next/link'
import { Globe, LibraryBig, Pencil, Printer } from 'lucide-react'
import { notFound } from 'next/navigation'
import { requireRole } from '@/lib/auth'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { PrintableMaterialUploader } from '@/app/dashboard/resources/[id]/PrintableMaterialUploader'
import { AdminPageHeader } from '@/components/dashboard/AdminPageHeader'
import { dashMuted, dashPanelSolid } from '@/components/dashboard/classes'
import { ResourceStatusBadge, VisibilityBadge } from '@/components/dashboard/DashboardStatusBadge'
import { TableShell } from '@/components/dashboard/TableShell'
import { EmptyState } from '@/components/ui/EmptyState'

export default async function DashboardResourceDetailPage(props: { params: Promise<{ id: string }> }) {
  const profile = await requireRole(['admin', 'teacher'])
  const { id } = await props.params

  const supabase = await createSupabaseServerClient()

  const { data: resource, error: resourceError } = await supabase
    .from('resources')
    .select('id, title, status, visibility, created_by, updated_at')
    .eq('id', id)
    .single()

  if (resourceError) throw resourceError
  if (!resource) notFound()

  if (profile.role === 'teacher' && resource.created_by !== profile.id) {
    return (
      <div className="grid gap-8">
        <AdminPageHeader
          eyebrow="Resources"
          title="Resource"
          description="You do not have access to this activity."
          backHref="/dashboard/resources"
          backLabel="My resources"
          titleIcon={LibraryBig}
        />
        <div className={`${dashPanelSolid} p-6 md:p-8`}>
          <p className={dashMuted}>Contact your platform manager if you believe this is a mistake.</p>
        </div>
      </div>
    )
  }

  const { data: printables, error: printableError } = await supabase
    .from('printable_materials')
    .select('id, title, description, file_type, pages_count, paper_size, color_required, double_sided_recommended, created_at')
    .eq('resource_id', id)
    .order('created_at', { ascending: false })

  if (printableError) throw printableError

  const updated = new Date(resource.updated_at).toLocaleString()

  return (
    <div className="grid gap-10">
      <AdminPageHeader
        eyebrow="Resources"
        title={resource.title}
        description={`Last updated ${updated}`}
        backHref="/dashboard/resources"
        backLabel="My resources"
        titleIcon={LibraryBig}
        actions={
          <>
            <Link
              href={`/dashboard/resources/${id}/edit`}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-teal-200 hover:bg-teal-50/40"
            >
              <Pencil className="h-4 w-4" aria-hidden />
              Edit activity
            </Link>
            <Link
              href={`/resources/${id}`}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-teal-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:from-teal-700 hover:to-teal-800"
            >
              <Globe className="h-4 w-4" aria-hidden />
              Public page
            </Link>
          </>
        }
      />

      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <span>Status</span>
          <ResourceStatusBadge status={resource.status} />
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <span>Visibility</span>
          <VisibilityBadge visibility={resource.visibility} />
        </div>
      </div>

      <section className={`${dashPanelSolid} p-6 md:p-8`}>
        <h2 className="text-lg font-semibold text-slate-900">Upload printable material</h2>
        <p className={`mt-1 ${dashMuted}`}>Add PDFs or handouts teachers can download and print.</p>
        <div className="mt-6 rounded-2xl border border-dashed border-teal-200/80 bg-gradient-to-br from-teal-50/40 to-white p-4 md:p-6">
          <PrintableMaterialUploader resourceId={id} />
        </div>
      </section>

      <section className={`${dashPanelSolid} p-6 md:p-8`}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Printable materials</h2>
            <p className={`mt-1 ${dashMuted}`}>Files attached to this resource.</p>
          </div>
          <Link
            href={`/resources/${id}`}
            className="text-sm font-semibold text-teal-800 underline-offset-4 hover:underline"
          >
            Preview on public page
          </Link>
        </div>

        {printables?.length ? (
          <TableShell className="mt-6">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-slate-100 bg-gradient-to-r from-teal-50/90 to-white">
                <tr className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                  <th className="px-4 py-4">Title</th>
                  <th className="px-4 py-4">Details</th>
                  <th className="px-4 py-4">Uploaded</th>
                  <th className="px-4 py-4">Download</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {printables.map((p) => (
                  <tr key={p.id} className="hover:bg-teal-50/15">
                    <td className="px-4 py-4 font-medium text-slate-900">{p.title}</td>
                    <td className="px-4 py-4 text-slate-700">
                      <div className="grid gap-1">
                        <div>
                          {p.file_type ?? 'file'}
                          {p.pages_count ? ` · ${p.pages_count} pages` : ''}
                          {p.paper_size ? ` · ${p.paper_size}` : ''}
                        </div>
                        {p.description ? <div className="text-xs text-slate-600">{p.description}</div> : null}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-slate-600">{new Date(p.created_at).toLocaleDateString()}</td>
                    <td className="px-4 py-4">
                      <a
                        href={`/api/printable-materials/${p.id}/download`}
                        className="text-sm font-semibold text-teal-800 underline-offset-4 hover:underline"
                      >
                        Download
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableShell>
        ) : (
          <div className="mt-6">
            <EmptyState
              icon={Printer}
              title="No printable files yet"
              description="Upload a PDF or document from the panel above so teachers can print it in class."
            />
          </div>
        )}
      </section>
    </div>
  )
}

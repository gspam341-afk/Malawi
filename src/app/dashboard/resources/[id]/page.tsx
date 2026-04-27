import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requireRole } from '@/lib/auth'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { PrintableMaterialUploader } from '@/app/dashboard/resources/[id]/PrintableMaterialUploader'

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
      <div className="rounded-2xl border bg-white p-6">
        <h1 className="text-xl font-semibold tracking-tight">Resource</h1>
        <p className="mt-2 text-sm text-zinc-700">Access denied.</p>
        <div className="mt-4">
          <Link href="/dashboard/resources" className="text-sm text-zinc-700 hover:text-zinc-950">
            Back to resources
          </Link>
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

  return (
    <div className="grid gap-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{resource.title}</h1>
          <p className="mt-1 text-sm text-zinc-700">
            Status: {resource.status} · Visibility: {resource.visibility}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href={`/dashboard/resources/${id}/edit`} className="text-sm text-zinc-700 hover:text-zinc-950">
            Edit
          </Link>
          <Link href="/resources" className="text-sm text-zinc-700 hover:text-zinc-950">
            Public browse
          </Link>
          <Link href="/dashboard/resources" className="text-sm text-zinc-700 hover:text-zinc-950">
            ← Back
          </Link>
        </div>
      </div>

      <section className="rounded-2xl border bg-white p-6">
        <h2 className="text-base font-semibold">Upload printable material</h2>
        <div className="mt-4">
          <PrintableMaterialUploader resourceId={id} />
        </div>
      </section>

      <section className="rounded-2xl border bg-white p-6">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-base font-semibold">Printable materials</h2>
          <Link href={`/resources/${id}`} className="text-sm text-zinc-700 hover:text-zinc-950">
            View public resource page
          </Link>
        </div>

        {printables?.length ? (
          <div className="mt-4 overflow-hidden rounded-xl border">
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-50 text-xs font-medium uppercase tracking-wide text-zinc-600">
                <tr>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Details</th>
                  <th className="px-4 py-3">Uploaded</th>
                  <th className="px-4 py-3">Download</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {printables.map((p) => (
                  <tr key={p.id} className="hover:bg-zinc-50">
                    <td className="px-4 py-3 font-medium text-zinc-950">{p.title}</td>
                    <td className="px-4 py-3 text-zinc-700">
                      <div className="grid gap-1">
                        <div>
                          {p.file_type ?? 'file'}
                          {p.pages_count ? ` · ${p.pages_count} pages` : ''}
                          {p.paper_size ? ` · ${p.paper_size}` : ''}
                        </div>
                        {p.description ? <div className="text-xs">{p.description}</div> : null}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-zinc-700">{new Date(p.created_at).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <a
                        href={`/api/printable-materials/${p.id}/download`}
                        className="text-sm font-medium text-zinc-900 hover:underline"
                      >
                        Download
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="mt-3 text-sm text-zinc-700">No printable materials yet.</p>
        )}
      </section>
    </div>
  )
}

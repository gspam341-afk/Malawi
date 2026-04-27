import Link from 'next/link'
import { requireProfile } from '@/lib/auth'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import {
  bulkDeleteResourcesAction,
  bulkSetDraftResourcesAction,
  bulkSetPublishedResourcesAction,
} from '@/app/dashboard/resources/actions'
import { BulkResourcesTable } from '@/app/dashboard/resources/BulkResourcesTable'

export default async function DashboardResourcesPage() {
  const profile = await requireProfile()

  if (profile.role !== 'admin' && profile.role !== 'teacher') {
    return (
      <div className="rounded-2xl border bg-white p-6">
        <h1 className="text-xl font-semibold tracking-tight">Resources</h1>
        <p className="mt-2 text-sm text-zinc-700">Access denied.</p>
        <div className="mt-4">
          <Link href="/dashboard" className="text-sm text-zinc-700 hover:text-zinc-950">
            Back to dashboard
          </Link>
        </div>
      </div>
    )
  }

  const supabase = await createSupabaseServerClient()

  let query = supabase
    .from('resources')
    .select('id,title,status,visibility,created_at,updated_at')
    .order('updated_at', { ascending: false })

  if (profile.role === 'teacher') {
    query = query.eq('created_by', profile.id)
  }

  const { data, error } = await query
  if (error) throw error

  const resources = data ?? []

  return (
    <div className="grid gap-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {profile.role === 'admin' ? 'All resources' : 'My resources'}
          </h1>
          <p className="mt-1 text-sm text-zinc-700">
            {profile.role === 'admin'
              ? 'View and manage resources.'
              : 'Resources you created.'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/resources/new"
            className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
          >
            Create new
          </Link>
          <Link href="/dashboard" className="text-sm text-zinc-700 hover:text-zinc-950">
            Dashboard
          </Link>
        </div>
      </div>

      {resources.length ? (
        <BulkResourcesTable
          resources={resources}
          bulkDeleteAction={bulkDeleteResourcesAction}
          bulkSetDraftAction={bulkSetDraftResourcesAction}
          bulkSetPublishedAction={bulkSetPublishedResourcesAction}
        />
      ) : (
        <div className="rounded-2xl border bg-white p-6 text-sm text-zinc-700">
          No resources yet.
        </div>
      )}
    </div>
  )
}

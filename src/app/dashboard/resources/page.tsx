import Link from 'next/link'
import { ArrowLeft, LibraryBig, PlusCircle } from 'lucide-react'
import { requireProfile } from '@/lib/auth'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import {
  bulkDeleteResourcesAction,
  bulkSetDraftResourcesAction,
  bulkSetPublishedResourcesAction,
} from '@/app/dashboard/resources/actions'
import { BulkResourcesTable } from '@/app/dashboard/resources/BulkResourcesTable'
import { AdminPageHeader } from '@/components/dashboard/AdminPageHeader'
import { EmptyState } from '@/components/ui/EmptyState'

export default async function DashboardResourcesPage() {
  const profile = await requireProfile()

  if (profile.role !== 'admin' && profile.role !== 'teacher') {
    return (
      <div className="rounded-2xl border border-amber-100 bg-amber-50/50 p-8 text-center">
        <h1 className="text-lg font-semibold text-slate-900">Restricted</h1>
        <p className="mt-2 text-sm text-slate-600">This library is only for teachers and admins.</p>
        <Link href="/dashboard" className="mt-6 inline-flex items-center gap-2 font-medium text-teal-800 hover:underline">
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Dashboard home
        </Link>
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
    <div className="grid gap-10">
      <AdminPageHeader
        eyebrow="Activities"
        title={profile.role === 'admin' ? 'All resources' : 'My resources'}
        description={
          profile.role === 'admin'
            ? 'Browse every draft and published activity on the platform. Bulk actions affect only what you select.'
            : 'Everything you have created lives here — polish drafts until you are ready to publish.'
        }
        titleIcon={LibraryBig}
        actions={
          <Link
            href="/dashboard/resources/new"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-teal-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:from-teal-700 hover:to-teal-800"
          >
            <PlusCircle className="h-4 w-4" aria-hidden />
            Create resource
          </Link>
        }
      />

      {resources.length ? (
        <BulkResourcesTable
          resources={resources}
          bulkDeleteAction={bulkDeleteResourcesAction}
          bulkSetDraftAction={bulkSetDraftResourcesAction}
          bulkSetPublishedAction={bulkSetPublishedResourcesAction}
        />
      ) : (
        <EmptyState
          icon={LibraryBig}
          title="No resources yet"
          description="Create your first printable or classroom activity — you can save as draft and refine before publishing."
        >
          <Link
            href="/dashboard/resources/new"
            className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700"
          >
            <PlusCircle className="h-4 w-4" aria-hidden />
            Create your first resource
          </Link>
        </EmptyState>
      )}
    </div>
  )
}

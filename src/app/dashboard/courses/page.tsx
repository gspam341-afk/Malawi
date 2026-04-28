import Link from 'next/link'
import { BookMarked, Pencil, PlusCircle } from 'lucide-react'
import { requireProfile } from '@/lib/auth'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { AdminPageHeader } from '@/components/dashboard/AdminPageHeader'
import { ResourceStatusBadge } from '@/components/dashboard/DashboardStatusBadge'
import { TableShell } from '@/components/dashboard/TableShell'
import { EmptyState } from '@/components/ui/EmptyState'
import type { Tables } from '@/types/db'

type CourseRow = Tables['courses']['Row'] & {
  subject: { name: string }
  grade_level: { name: string }
}

export default async function DashboardCoursesPage() {
  const profile = await requireProfile()
  if (profile.role !== 'admin' && profile.role !== 'teacher') {
    return (
      <div className="rounded-jac-lg border border-amber-200 bg-amber-50/60 p-8 text-center text-sm text-jac-navy">
        Courses are available to teachers and admins.
      </div>
    )
  }

  const supabase = await createSupabaseServerClient()
  let q = supabase
    .from('courses')
    .select('id,title,slug,status,visibility,updated_at,subject:subjects(name),grade_level:grade_levels(name)')
    .order('updated_at', { ascending: false })

  if (profile.role === 'teacher') {
    q = q.eq('created_by', profile.id)
  }

  const { data, error } = await q
  if (error) throw error
  const courses = (data ?? []) as unknown as CourseRow[]

  return (
    <div className="grid gap-10">
      <AdminPageHeader
        eyebrow="Learning Hub"
        title={profile.role === 'admin' ? 'Manage courses' : 'My courses'}
        description={
          profile.role === 'admin'
            ? 'Review and publish courses from all teachers.'
            : 'Organise units and lessons, then publish when you are ready for students.'
        }
        titleIcon={BookMarked}
        actions={
          <Link
            href="/dashboard/courses/new"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-jac-purple px-4 py-2.5 text-sm font-semibold text-white shadow-jac-soft hover:bg-[#6240b8]"
          >
            <PlusCircle className="h-4 w-4" aria-hidden />
            Create course
          </Link>
        }
      />

      {courses.length ? (
        <TableShell>
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-jac-navy/10 bg-gradient-to-r from-jac-purple/[0.06] via-white to-jac-pink/12">
              <tr className="text-xs font-semibold uppercase tracking-wide text-jac-navy/55">
                <th className="px-4 py-4">Title</th>
                <th className="px-4 py-4">Subject</th>
                <th className="px-4 py-4">Grade</th>
                <th className="px-4 py-4">Status</th>
                <th className="hidden px-4 py-4 md:table-cell">Updated</th>
                <th className="px-4 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-jac-navy/8">
              {courses.map((c) => (
                <tr key={c.id} className="hover:bg-jac-purple/[0.04]">
                  <td className="px-4 py-4 font-medium text-jac-navy">{c.title}</td>
                  <td className="px-4 py-4 text-jac-navy/75">{c.subject?.name ?? '—'}</td>
                  <td className="px-4 py-4 text-jac-navy/75">{c.grade_level?.name ?? '—'}</td>
                  <td className="px-4 py-4">
                    <ResourceStatusBadge status={c.status} />
                  </td>
                  <td className="hidden px-4 py-4 text-jac-navy/65 md:table-cell">
                    {new Date(c.updated_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-4">
                    <Link
                      href={`/dashboard/courses/${c.id}/edit`}
                      className="inline-flex items-center gap-1 font-semibold text-jac-purple hover:underline"
                    >
                      <Pencil className="h-4 w-4" aria-hidden />
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableShell>
      ) : (
        <EmptyState
          icon={BookMarked}
          title="No courses yet"
          description="Create a course to group units and lessons, then attach your published activities."
        >
          <Link
            href="/dashboard/courses/new"
            className="inline-flex items-center gap-2 rounded-full bg-jac-purple px-4 py-2 text-sm font-semibold text-white hover:bg-[#6240b8]"
          >
            <PlusCircle className="h-4 w-4" aria-hidden />
            Create course
          </Link>
        </EmptyState>
      )}
    </div>
  )
}

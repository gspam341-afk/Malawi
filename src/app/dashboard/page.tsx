import Link from 'next/link'
import { requireProfile } from '@/lib/auth'
import { Card } from '@/components/ui/Card'

function DashboardLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="rounded-2xl border border-slate-200/90 bg-white px-4 py-3.5 text-sm font-medium text-slate-900 shadow-sm transition hover:border-emerald-200/80 hover:shadow-md"
    >
      {label}
    </Link>
  )
}

export default async function DashboardPage() {
  const profile = await requireProfile()

  const nameOrEmail = profile.name ?? profile.email ?? 'Account'
  const roleLabel =
    profile.role === 'teacher'
      ? 'content creator'
      : profile.role === 'admin'
        ? 'platform manager'
        : profile.role

  return (
    <div className="grid gap-8">
      <Card padding="p-6 md:p-8">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          {profile.role === 'admin' ? 'Admin Panel' : 'Dashboard'}
        </h1>
        <div className="mt-4 grid gap-2 text-sm text-slate-600">
          <div>
            <span className="font-medium text-slate-900">User:</span> {nameOrEmail}
          </div>
          <div>
            <span className="font-medium text-slate-900">Role:</span> {roleLabel}
          </div>
        </div>
      </Card>

      <section className="grid gap-3">
        <div className="grid gap-3 md:grid-cols-2">
          <DashboardLink href="/dashboard/account" label="Account settings" />
        </div>

        {profile.role === 'admin' ? (
          <div className="grid gap-3 md:grid-cols-2">
            <DashboardLink href="/dashboard/users" label="User management" />
            <DashboardLink href="/dashboard/users/invite-teacher" label="Invite teacher" />
            <DashboardLink href="/dashboard/resources/manage" label="Manage resources" />
            <DashboardLink href="/dashboard/blog-posts" label="Manage blog posts" />
            <DashboardLink href="/dashboard/submissions" label="Manage submissions" />
            <DashboardLink href="/dashboard/subjects" label="Manage subjects" />
            <DashboardLink href="/dashboard/grade-levels" label="Manage grade levels" />
          </div>
        ) : null}

        {profile.role === 'teacher' ? (
          <div className="grid gap-3 md:grid-cols-2">
            <DashboardLink href="/dashboard/resources" label="My resources" />
            <DashboardLink href="/dashboard/resources/new" label="Create new resource" />
            <DashboardLink href="/dashboard/blog-posts" label="My blog posts" />
            <DashboardLink href="/dashboard/submissions" label="My submissions" />
          </div>
        ) : null}

        {profile.role === 'alumni' || profile.role === 'donor' ? (
          <div className="grid gap-3 md:grid-cols-2">
            <DashboardLink href="/dashboard/blog-posts" label="My blog posts" />
            <DashboardLink href="/dashboard/submissions/new" label="Submit activity idea" />
            <DashboardLink href="/dashboard/submissions" label="My submissions" />
          </div>
        ) : null}

        {profile.role === 'student_optional' ? (
          <Card className="border-dashed border-slate-200 bg-slate-50/50" padding="p-6">
            <p className="text-sm text-slate-600">
              Student accounts are optional. Saved resources will be available later.
            </p>
          </Card>
        ) : null}
      </section>
    </div>
  )
}

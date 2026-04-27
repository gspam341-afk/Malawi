import Link from 'next/link'
import { requireProfile } from '@/lib/auth'

function DashboardLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="rounded-xl border bg-white px-4 py-3 text-sm font-medium text-zinc-900 hover:bg-zinc-50"
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
    <div className="grid gap-6">
      <section className="rounded-2xl border bg-white p-6">
        <h1 className="text-2xl font-semibold tracking-tight">
          {profile.role === 'admin' ? 'Admin Panel' : 'Dashboard'}
        </h1>
        <div className="mt-3 grid gap-1 text-sm text-zinc-700">
          <div>
            <span className="font-medium text-zinc-900">User:</span> {nameOrEmail}
          </div>
          <div>
            <span className="font-medium text-zinc-900">Role:</span> {roleLabel}
          </div>
        </div>
      </section>

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
            <DashboardLink href="/dashboard" label="Submit activity idea" />
            <DashboardLink href="/dashboard/submissions" label="My submissions" />
          </div>
        ) : null}

        {profile.role === 'student_optional' ? (
          <div className="rounded-2xl border bg-white p-6 text-sm text-zinc-700">
            Student accounts are optional. Saved resources will be available later.
          </div>
        ) : null}
      </section>
    </div>
  )
}

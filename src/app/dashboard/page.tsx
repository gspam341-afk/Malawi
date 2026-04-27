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

  return (
    <div className="grid gap-6">
      <section className="rounded-2xl border bg-white p-6">
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <div className="mt-3 grid gap-1 text-sm text-zinc-700">
          <div>
            <span className="font-medium text-zinc-900">User:</span> {nameOrEmail}
          </div>
          <div>
            <span className="font-medium text-zinc-900">Role:</span> {profile.role}
          </div>
        </div>
      </section>

      <section className="grid gap-3">
        {profile.role === 'admin' ? (
          <div className="grid gap-3 md:grid-cols-2">
            <DashboardLink href="/dashboard/resources" label="Manage resources" />
            <DashboardLink href="/dashboard/resources" label="Pending resources" />
            <DashboardLink href="/dashboard" label="Blog posts" />
            <DashboardLink href="/dashboard" label="Submissions" />
            <DashboardLink href="/dashboard" label="Users" />
          </div>
        ) : null}

        {profile.role === 'teacher' ? (
          <div className="grid gap-3 md:grid-cols-2">
            <DashboardLink href="/dashboard/resources" label="My resources" />
            <DashboardLink href="/dashboard/resources/new" label="Create new resource" />
            <DashboardLink href="/dashboard" label="My blog posts" />
            <DashboardLink href="/dashboard" label="My submissions" />
          </div>
        ) : null}

        {profile.role === 'alumni' || profile.role === 'donor' ? (
          <div className="grid gap-3 md:grid-cols-2">
            <DashboardLink href="/dashboard" label="My blog posts" />
            <DashboardLink href="/dashboard" label="Submit activity idea" />
            <DashboardLink href="/dashboard" label="My submissions" />
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

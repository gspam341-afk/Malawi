import {
  Atom,
  GraduationCap,
  Inbox,
  LayoutDashboard,
  LibraryBig,
  Lightbulb,
  Newspaper,
  PenLine,
  PlusCircle,
  Send,
  Settings,
  Sparkles,
  UserPlus,
  Users,
} from 'lucide-react'
import { requireProfile } from '@/lib/auth'
import type { ProfileRole } from '@/types/db'
import { DashboardGrid } from '@/components/dashboard/DashboardGrid'
import { DashboardNavCard } from '@/components/dashboard/DashboardNavCard'
import { RoleBadge } from '@/components/dashboard/RoleBadge'
import { dashMuted, dashPanel, dashTitle } from '@/components/dashboard/classes'

function roleExplanation(role: ProfileRole): string {
  switch (role) {
    case 'admin':
      return 'You manage users, invitations, subjects, grade levels, and platform-wide review of resources and submissions.'
    case 'teacher':
      return 'Create physical learning activities, publish to the public catalog, and share blog posts or ideas for review.'
    case 'alumni':
    case 'donor':
      return 'Contribute blog posts and submit activity ideas; the team may review submissions before they appear publicly.'
    case 'student_optional':
      return 'Student accounts are optional and lightweight—saved resources and extras can arrive in a future update.'
    default:
      return ''
  }
}

export default async function DashboardPage() {
  const profile = await requireProfile()

  const nameOrEmail = profile.name ?? profile.email ?? 'there'

  return (
    <div className="grid gap-10">
      <section
        className={`relative overflow-hidden ${dashPanel} bg-gradient-to-br from-teal-50/90 via-[#fdfcfa] to-amber-50/60 p-8 md:p-10`}
      >
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-teal-200/40 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-amber-200/40 blur-3xl" />
        <div className="relative">
          <div className="flex flex-wrap items-start gap-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-teal-100 text-teal-800 ring-1 ring-teal-600/15">
              <LayoutDashboard className="h-8 w-8" aria-hidden />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-medium text-teal-800">Welcome back</p>
              <h1 className={`mt-2 ${dashTitle}`}>{nameOrEmail}</h1>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <RoleBadge role={profile.role} />
              </div>
              <p className={`mt-6 max-w-2xl ${dashMuted}`}>{roleExplanation(profile.role)}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Quick actions</h2>
          <p className={`mt-1 ${dashMuted}`}>Jump to the tools you use most — everything stays in one place.</p>
        </div>

        {profile.role === 'admin' ? (
          <DashboardGrid>
            <DashboardNavCard
              href="/dashboard/users"
              icon={<Users className="text-teal-800" aria-hidden />}
              title="User management"
              description="Manage profiles, roles and access."
            />
            <DashboardNavCard
              href="/dashboard/users/invite-teacher"
              icon={<UserPlus className="text-teal-800" aria-hidden />}
              title="Invite teacher"
              description="Invite new teachers to publish activities."
            />
            <DashboardNavCard
              href="/dashboard/resources/manage"
              icon={<LibraryBig className="text-teal-800" aria-hidden />}
              title="Manage resources"
              description="Review, edit and organize learning activities."
            />
            <DashboardNavCard
              href="/dashboard/blog-posts"
              icon={<Newspaper className="text-teal-800" aria-hidden />}
              title="Manage blog posts"
              description="Create and manage stories and updates."
            />
            <DashboardNavCard
              href="/dashboard/submissions"
              icon={<Inbox className="text-teal-800" aria-hidden />}
              title="Manage submissions"
              description="Handle ideas and contributions."
            />
            <DashboardNavCard
              href="/dashboard/subjects"
              icon={<Atom className="text-teal-800" aria-hidden />}
              title="Manage subjects"
              description="Edit available STEM subjects."
            />
            <DashboardNavCard
              href="/dashboard/grade-levels"
              icon={<GraduationCap className="text-teal-800" aria-hidden />}
              title="Manage grade levels"
              description="Maintain grade levels from Grade 6 to Grade 14."
            />
            <DashboardNavCard
              href="/dashboard/account"
              icon={<Settings className="text-teal-800" aria-hidden />}
              title="Account settings"
              description="Update your password and account details."
            />
          </DashboardGrid>
        ) : null}

        {profile.role === 'teacher' ? (
          <DashboardGrid>
            <DashboardNavCard
              href="/dashboard/resources"
              icon={<LibraryBig className="text-teal-800" aria-hidden />}
              title="My resources"
              description="Create and manage your physical learning activities."
            />
            <DashboardNavCard
              href="/dashboard/resources/new"
              icon={<PlusCircle className="text-teal-800" aria-hidden />}
              title="Create new resource"
              description="Add a new printable or hands-on activity."
            />
            <DashboardNavCard
              href="/dashboard/blog-posts"
              icon={<PenLine className="text-teal-800" aria-hidden />}
              title="My blog posts"
              description="Write stories, guides or teaching reflections."
            />
            <DashboardNavCard
              href="/dashboard/submissions"
              icon={<Send className="text-teal-800" aria-hidden />}
              title="My submissions"
              description="Track your submitted ideas and materials."
            />
            <DashboardNavCard
              href="/dashboard/account"
              icon={<Settings className="text-teal-800" aria-hidden />}
              title="Account settings"
              description="Password and profile security."
            />
          </DashboardGrid>
        ) : null}

        {(profile.role === 'alumni' || profile.role === 'donor') && (
          <DashboardGrid>
            <DashboardNavCard
              href="/dashboard/blog-posts"
              icon={<PenLine className="text-teal-800" aria-hidden />}
              title="My blog posts"
              description="Drafts and posts tied to your account."
            />
            <DashboardNavCard
              href="/dashboard/submissions/new"
              icon={<Lightbulb className="text-teal-800" aria-hidden />}
              title="Submit activity idea"
              description="Send an idea or material for the team to review."
            />
            <DashboardNavCard
              href="/dashboard/submissions"
              icon={<Inbox className="text-teal-800" aria-hidden />}
              title="My submissions"
              description="See status and feedback on what you submitted."
            />
            <DashboardNavCard
              href="/dashboard/account"
              icon={<Settings className="text-teal-800" aria-hidden />}
              title="Account settings"
              description="Password and profile security."
            />
          </DashboardGrid>
        )}

        {profile.role === 'student_optional' ? (
          <div
            className={`flex flex-col items-center gap-4 rounded-2xl border border-dashed border-amber-200/80 bg-amber-50/40 px-8 py-10 text-center`}
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-800 ring-1 ring-amber-600/15">
              <Sparkles className="h-7 w-7" aria-hidden />
            </span>
            <div>
              <p className="font-medium text-slate-900">Optional student account</p>
              <p className={`mt-2 ${dashMuted}`}>
                Browsing stays open on the public site. Saved collections and extras can land here later.
              </p>
            </div>
          </div>
        ) : null}
      </section>
    </div>
  )
}

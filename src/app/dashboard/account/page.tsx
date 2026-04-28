import Link from 'next/link'
import { ArrowLeft, KeyRound, Settings, UserCircle } from 'lucide-react'
import { requireProfile } from '@/lib/auth'
import { ChangePasswordForm } from '@/app/dashboard/account/ChangePasswordForm'
import { AdminPageHeader } from '@/components/dashboard/AdminPageHeader'
import { FormSection } from '@/components/dashboard/FormSection'
import { RoleBadge } from '@/components/dashboard/RoleBadge'
import { dashMuted, dashPanelSolid } from '@/components/dashboard/classes'

export default async function AccountPage() {
  const profile = await requireProfile()

  return (
    <div className="grid gap-10">
      <AdminPageHeader
        eyebrow="Your account"
        title="Account settings"
        description="Manage how you sign in and see a quick snapshot of your profile."
        backHref="/dashboard"
        backLabel="Dashboard home"
        titleIcon={Settings}
      />

      <section className={`${dashPanelSolid} p-6 md:p-8`}>
        <div className="flex flex-wrap items-start gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-jac-md bg-jac-purple/12 text-jac-purple ring-1 ring-jac-purple/20">
            <UserCircle className="h-7 w-7" aria-hidden />
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-semibold text-slate-900">Profile summary</h2>
            <dl className="mt-6 grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Display name</dt>
                <dd className="mt-1 text-sm font-medium text-slate-900">{profile.name ?? '—'}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Email</dt>
                <dd className="mt-1 text-sm font-medium text-slate-900">{profile.email ?? '—'}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Role</dt>
                <dd className="mt-2">
                  <RoleBadge role={profile.role} />
                </dd>
              </div>
            </dl>
            <p className={`mt-6 ${dashMuted}`}>
              Need access changes? Ask a platform manager — roles are managed from user administration.
            </p>
          </div>
        </div>
      </section>

      <FormSection
        icon={KeyRound}
        title="Change password"
        description="Use a strong password you do not reuse elsewhere. If your organization requires the current password, enter it below."
      >
        <ChangePasswordForm />
      </FormSection>

      <p className="text-center text-sm text-slate-500">
        <Link
          href="/dashboard"
          className="inline-flex items-center justify-center gap-2 font-medium text-jac-purple hover:text-[#6240b8] hover:underline"
        >
          <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden />
          Back to dashboard home
        </Link>
      </p>
    </div>
  )
}

import Link from 'next/link'
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
      />

      <section className={`${dashPanelSolid} p-6 md:p-8`}>
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
      </section>

      <FormSection
        title="Change password"
        description="Use a strong password you do not reuse elsewhere. If your organization requires the current password, enter it below."
      >
        <ChangePasswordForm />
      </FormSection>

      <p className="text-center text-sm text-slate-500">
        <Link href="/dashboard" className="font-medium text-teal-800 hover:text-teal-950 hover:underline">
          ← Back to dashboard home
        </Link>
      </p>
    </div>
  )
}

import Link from 'next/link'
import { ArrowLeft, Info, Mail, Send, UserPlus } from 'lucide-react'
import { requireAdmin } from '@/lib/auth'
import { inviteTeacherAction } from '@/app/dashboard/users/invite-teacher/actions'
import { AdminPageHeader } from '@/components/dashboard/AdminPageHeader'
import { ActionButton } from '@/components/dashboard/ActionButton'
import { FieldLabel } from '@/components/dashboard/FieldLabel'
import { FormSection } from '@/components/dashboard/FormSection'
import { dashInput, dashMuted, dashPanelSolid } from '@/components/dashboard/classes'
import type { ProfileRole } from '@/types/db'

export default async function InviteTeacherPage(props: {
  searchParams?: Promise<{ success?: string; error?: string }>
}) {
  await requireAdmin()
  const { success, error } = (await props.searchParams) ?? {}

  const roles: readonly ProfileRole[] = ['teacher', 'alumni', 'donor', 'student_optional', 'admin']

  return (
    <div className="grid gap-10">
      <AdminPageHeader
        eyebrow="People"
        title="Invite someone"
        description="Send an email invitation so they can finish setup and publish physical learning activities. Teachers can upload resources once their account is active."
        titleIcon={UserPlus}
        actions={
          <Link
            href="/dashboard/users"
            className="inline-flex items-center gap-2 text-sm font-medium text-jac-purple underline-offset-4 hover:text-[#6240b8] hover:underline"
          >
            <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden />
            User management
          </Link>
        }
      />

      {success ? (
        <div className="rounded-jac-md border border-jac-green/30 bg-jac-green/10 px-5 py-4 text-sm font-medium text-jac-green">
          Invite queued successfully. They should receive an email shortly.
        </div>
      ) : null}

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-950" role="alert">
          {error}
        </div>
      ) : null}

      <FormSection
        icon={Mail}
        title="Invite details"
        description="We recommend inviting as teacher if they will publish classroom activities."
      >
        <form action={inviteTeacherAction} className="grid max-w-xl gap-5">
          <div>
            <FieldLabel htmlFor="invite-email">Email address</FieldLabel>
            <input
              id="invite-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className={`${dashInput} mt-2`}
            />
          </div>

          <div>
            <FieldLabel htmlFor="invite-name" hint="Shown in the dashboard and profile directory.">
              Display name (optional)
            </FieldLabel>
            <input id="invite-name" name="name" className={`${dashInput} mt-2`} />
          </div>

          <div>
            <FieldLabel htmlFor="invite-role">Initial role</FieldLabel>
            <select id="invite-role" name="role" defaultValue="teacher" className={`${dashInput} mt-2`}>
              {roles.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-wrap justify-end gap-3 pt-2">
            <Link
              href="/dashboard/users"
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden />
              Cancel
            </Link>
            <ActionButton type="submit" icon={Send}>
              Send invite
            </ActionButton>
          </div>
        </form>
      </FormSection>

      <section className={`${dashPanelSolid} p-6 text-sm leading-relaxed text-slate-700`}>
        <p className="flex items-start gap-3 font-medium text-slate-900">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-jac-purple" aria-hidden />
          <span>
            Invited teachers can log in and publish physical learning activities. Students can browse public activities
            without creating an account.
          </span>
        </p>
        <p className={`mt-4 ${dashMuted}`}>
          Invites rely on Supabase Auth email configuration. If delivery fails, you can still create the account in the
          Supabase dashboard and assign roles from{' '}
          <Link href="/dashboard/users" className="font-medium text-jac-purple underline-offset-4 hover:underline">
            User management
          </Link>
          .
        </p>
      </section>
    </div>
  )
}

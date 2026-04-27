import Link from 'next/link'
import { requireProfile } from '@/lib/auth'
import { ChangePasswordForm } from '@/app/dashboard/account/ChangePasswordForm'

export default async function AccountPage() {
  await requireProfile()

  return (
    <div className="grid gap-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Account settings</h1>
          <p className="mt-1 text-sm text-zinc-700">Manage your account.</p>
        </div>
        <Link href="/dashboard" className="text-sm text-zinc-700 hover:text-zinc-950">
          ← Back to dashboard
        </Link>
      </div>

      <section className="rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Change password</h2>
        <p className="mt-1 text-sm text-zinc-700">Set a new password for your account.</p>
        <ChangePasswordForm />
      </section>
    </div>
  )
}

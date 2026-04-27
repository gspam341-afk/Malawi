import Link from 'next/link'
import { requireAdmin } from '@/lib/auth'
import { inviteTeacherAction } from '@/app/dashboard/users/invite-teacher/actions'

export default async function InviteTeacherPage(props: { searchParams?: Promise<{ success?: string; error?: string }> }) {
  await requireAdmin()
  const { success, error } = (await props.searchParams) ?? {}

  return (
    <div className="grid gap-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Invite teacher</h1>
          <p className="mt-1 text-sm text-zinc-700">Send an invite email via Supabase Auth admin API.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/dashboard/users" className="text-sm text-zinc-700 hover:text-zinc-950">
            ← Back to users
          </Link>
        </div>
      </div>

      {success ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
          Invite sent.
        </div>
      ) : null}

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-900">{error}</div>
      ) : null}

      <form action={inviteTeacherAction} className="grid gap-4 rounded-2xl border bg-white p-6 shadow-sm">
        <div className="grid gap-1">
          <label className="text-sm font-medium">Email</label>
          <input
            name="email"
            type="email"
            required
            className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-zinc-900 focus:ring-4 focus:ring-zinc-900/10"
          />
        </div>

        <div className="grid gap-1">
          <label className="text-sm font-medium">Name</label>
          <input
            name="name"
            className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-zinc-900 focus:ring-4 focus:ring-zinc-900/10"
          />
        </div>

        <input type="hidden" name="role" value="teacher" />

        <div className="flex items-center justify-end gap-3">
          <Link href="/dashboard/users" className="text-sm text-zinc-700 hover:text-zinc-950">
            Cancel
          </Link>
          <button
            type="submit"
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800 focus:outline-none focus:ring-4 focus:ring-zinc-900/20"
          >
            Send invite
          </button>
        </div>
      </form>

      <div className="rounded-2xl border bg-white p-4 text-sm text-zinc-700">
        If inviting fails due to Auth configuration, you can still create the user in Supabase Auth and then set their
        profile role to <span className="font-medium text-zinc-900">teacher</span> from the user management page.
      </div>
    </div>
  )
}

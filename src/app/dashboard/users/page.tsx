import Link from 'next/link'
import { requireAdmin } from '@/lib/auth'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { deactivateUserAction, deleteUserAction, reactivateUserAction, updateUserAction } from '@/app/dashboard/users/actions'
import { ConfirmSubmitButton } from '@/components/ConfirmSubmitButton'
import type { ProfileRole, ProfileStatus } from '@/types/db'

function OptionList<T extends string>(props: { options: readonly T[]; value: T }) {
  return (
    <>
      {props.options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </>
  )
}

export default async function AdminUsersPage(props: {
  searchParams?: Promise<{ q?: string; role?: string; status?: string }>
}) {
  const currentAdmin = await requireAdmin()

  const { q = '', role = '', status = '' } = (await props.searchParams) ?? {}
  const supabase = await createSupabaseServerClient()

  let query = supabase
    .from('profiles')
    .select('id,name,email,role,status,created_at')
    .order('created_at', { ascending: false })

  if (role) query = query.eq('role', role)
  if (status) query = query.eq('status', status)
  if (q.trim()) {
    // Simple OR search across name/email
    query = query.or(`name.ilike.%${q.trim()}%,email.ilike.%${q.trim()}%`)
  }

  const { data, error } = await query
  if (error) throw error

  const rows = (data ?? []).filter((u) => u.id !== currentAdmin.id)

  const roles: readonly ProfileRole[] = ['admin', 'teacher', 'alumni', 'donor', 'student_optional']
  const statuses: readonly ProfileStatus[] = ['active', 'pending', 'inactive', 'banned']

  return (
    <div className="grid gap-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">User management</h1>
          <p className="mt-1 text-sm text-zinc-700">Manage profiles, roles, and access.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/users/invite-teacher"
            className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
          >
            Invite teacher
          </Link>
          <Link href="/dashboard" className="text-sm text-zinc-700 hover:text-zinc-950">
            Dashboard
          </Link>
        </div>
      </div>

      <form className="grid gap-3 rounded-2xl border bg-white p-4 sm:grid-cols-4" method="get">
        <div className="grid gap-1 sm:col-span-2">
          <label className="text-xs font-medium uppercase tracking-wide text-zinc-600">Search</label>
          <input
            name="q"
            defaultValue={q}
            placeholder="Search by name or email"
            className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-zinc-900 focus:ring-4 focus:ring-zinc-900/10"
          />
        </div>

        <div className="grid gap-1">
          <label className="text-xs font-medium uppercase tracking-wide text-zinc-600">Role</label>
          <select
            name="role"
            defaultValue={role}
            className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-zinc-900 focus:ring-4 focus:ring-zinc-900/10"
          >
            <option value="">all</option>
            <OptionList options={roles} value={roles[0]} />
          </select>
        </div>

        <div className="grid gap-1">
          <label className="text-xs font-medium uppercase tracking-wide text-zinc-600">Status</label>
          <select
            name="status"
            defaultValue={status}
            className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-zinc-900 focus:ring-4 focus:ring-zinc-900/10"
          >
            <option value="">all</option>
            <OptionList options={statuses} value={statuses[0]} />
          </select>
        </div>

        <div className="sm:col-span-4 flex items-center justify-end gap-3">
          <button
            type="submit"
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800 focus:outline-none focus:ring-4 focus:ring-zinc-900/20"
          >
            Apply filters
          </button>
        </div>
      </form>

      {rows.length ? (
        <div className="overflow-hidden rounded-2xl border bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-50 text-xs font-medium uppercase tracking-wide text-zinc-600">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Created</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {rows.map((u) => (
                <tr key={u.id} className="align-top hover:bg-zinc-50">
                  <td className="px-4 py-3">
                    <form action={updateUserAction} className="grid gap-2">
                      <input type="hidden" name="user_id" value={u.id} />
                      <input
                        name="name"
                        defaultValue={u.name ?? ''}
                        className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-zinc-900 focus:ring-4 focus:ring-zinc-900/10"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <select
                          name="role"
                          defaultValue={u.role}
                          className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-zinc-900 focus:ring-4 focus:ring-zinc-900/10"
                        >
                          {roles.map((r) => (
                            <option key={r} value={r}>
                              {r}
                            </option>
                          ))}
                        </select>
                        <select
                          name="status"
                          defaultValue={u.status}
                          className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-zinc-900 focus:ring-4 focus:ring-zinc-900/10"
                        >
                          {statuses.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <button
                          type="submit"
                          className="rounded-lg bg-zinc-900 px-3 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800 focus:outline-none focus:ring-4 focus:ring-zinc-900/20"
                        >
                          Save
                        </button>
                      </div>
                    </form>
                  </td>
                  <td className="px-4 py-3 text-zinc-700">{u.email ?? '—'}</td>
                  <td className="px-4 py-3 text-zinc-700">{u.role}</td>
                  <td className="px-4 py-3 text-zinc-700">{u.status}</td>
                  <td className="px-4 py-3 text-zinc-700">{new Date(u.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-2">
                      <form action={deactivateUserAction}>
                        <input type="hidden" name="user_id" value={u.id} />
                        <button
                          type="submit"
                          className="rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm font-medium text-red-800 shadow-sm transition hover:bg-red-100 focus:outline-none focus:ring-4 focus:ring-red-500/20"
                        >
                          Deactivate
                        </button>
                      </form>
                      <form action={reactivateUserAction}>
                        <input type="hidden" name="user_id" value={u.id} />
                        <button
                          type="submit"
                          className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-900 shadow-sm transition hover:bg-zinc-50 focus:outline-none focus:ring-4 focus:ring-zinc-900/10"
                        >
                          Reactivate
                        </button>
                      </form>

                      <form action={deleteUserAction}>
                        <input type="hidden" name="user_id" value={u.id} />
                        <ConfirmSubmitButton
                          message="Delete this user? This will delete the auth account."
                          className="rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm font-medium text-red-800 shadow-sm transition hover:bg-red-100 focus:outline-none focus:ring-4 focus:ring-red-500/20"
                        >
                          Delete
                        </ConfirmSubmitButton>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="rounded-2xl border bg-white p-6 text-sm text-zinc-700">No users found.</div>
      )}
    </div>
  )
}

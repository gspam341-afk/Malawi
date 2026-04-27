import Link from 'next/link'
import { requireAdmin } from '@/lib/auth'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { deactivateUserAction, deleteUserAction, reactivateUserAction, updateUserAction } from '@/app/dashboard/users/actions'
import { ConfirmSubmitButton } from '@/components/ConfirmSubmitButton'
import { AdminPageHeader } from '@/components/dashboard/AdminPageHeader'
import { ActionButton, SecondaryButton } from '@/components/dashboard/ActionButton'
import { dashInput, dashMuted, dashPanelSolid } from '@/components/dashboard/classes'
import { RoleBadge } from '@/components/dashboard/RoleBadge'
import { TableShell } from '@/components/dashboard/TableShell'
import { UserStatusBadge } from '@/components/dashboard/DashboardStatusBadge'
import { EmptyState } from '@/components/ui/EmptyState'
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
    query = query.or(`name.ilike.%${q.trim()}%,email.ilike.%${q.trim()}%`)
  }

  const { data, error } = await query
  if (error) throw error

  const rows = (data ?? []).filter((u) => u.id !== currentAdmin.id)

  const roles: readonly ProfileRole[] = ['admin', 'teacher', 'alumni', 'donor', 'student_optional']
  const statuses: readonly ProfileStatus[] = ['active', 'pending', 'inactive', 'banned']

  return (
    <div className="grid gap-8">
      <AdminPageHeader
        eyebrow="Platform"
        title="User management"
        description="Search and update profiles. Your own account is hidden from this list so you cannot lock yourself out by mistake."
        actions={
          <Link
            href="/dashboard/users/invite-teacher"
            className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-teal-600 to-teal-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:from-teal-700 hover:to-teal-800"
          >
            Invite teacher
          </Link>
        }
      />

      <section className={`${dashPanelSolid} p-5 md:p-6`}>
        <h2 className="text-sm font-semibold text-slate-900">Filters</h2>
        <p className={`mt-1 ${dashMuted}`}>Narrow down by name, email, role or status.</p>
        <form className="mt-6 grid gap-4 md:grid-cols-12" method="get">
          <div className="md:col-span-5">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Search</label>
            <input
              name="q"
              defaultValue={q}
              placeholder="Name or email"
              className={`${dashInput} mt-2`}
            />
          </div>
          <div className="md:col-span-3">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Role</label>
            <select name="role" defaultValue={role} className={`${dashInput} mt-2`}>
              <option value="">All roles</option>
              <OptionList options={roles} value={roles[0]} />
            </select>
          </div>
          <div className="md:col-span-3">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Status</label>
            <select name="status" defaultValue={status} className={`${dashInput} mt-2`}>
              <option value="">All statuses</option>
              <OptionList options={statuses} value={statuses[0]} />
            </select>
          </div>
          <div className="flex items-end md:col-span-1">
            <ActionButton type="submit" className="w-full md:w-auto">
              Apply
            </ActionButton>
          </div>
        </form>
      </section>

      {rows.length ? (
        <TableShell>
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-slate-100 bg-gradient-to-r from-teal-50/90 via-white to-amber-50/40">
              <tr className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                <th className="px-4 py-4">User</th>
                <th className="px-4 py-4">Email</th>
                <th className="px-4 py-4">Overview</th>
                <th className="hidden px-4 py-4 lg:table-cell">Joined</th>
                <th className="px-4 py-4">Safety</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((u) => (
                <tr key={u.id} className="align-top hover:bg-teal-50/20">
                  <td className="px-4 py-4">
                    <form action={updateUserAction} className="grid max-w-md gap-3">
                      <input type="hidden" name="user_id" value={u.id} />
                      <input
                        name="name"
                        defaultValue={u.name ?? ''}
                        placeholder="Display name"
                        className={dashInput}
                      />
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div>
                          <label className="sr-only">Role</label>
                          <select name="role" defaultValue={u.role} className={dashInput}>
                            {roles.map((r) => (
                              <option key={r} value={r}>
                                {r}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="sr-only">Status</label>
                          <select name="status" defaultValue={u.status} className={dashInput}>
                            {statuses.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <ActionButton type="submit">Save changes</ActionButton>
                    </form>
                  </td>
                  <td className="px-4 py-4 text-slate-700">{u.email ?? '—'}</td>
                  <td className="px-4 py-4">
                    <div className="flex flex-col gap-2">
                      <RoleBadge role={u.role as ProfileRole} />
                      <UserStatusBadge status={u.status} />
                    </div>
                  </td>
                  <td className="hidden px-4 py-4 text-slate-600 lg:table-cell">
                    {new Date(u.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-col gap-3 border-l border-amber-100 pl-4">
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                        Danger zone
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <form action={deactivateUserAction}>
                          <input type="hidden" name="user_id" value={u.id} />
                          <SecondaryButton type="submit">Deactivate</SecondaryButton>
                        </form>
                        <form action={reactivateUserAction}>
                          <input type="hidden" name="user_id" value={u.id} />
                          <SecondaryButton type="submit">Reactivate</SecondaryButton>
                        </form>
                      </div>
                      <form action={deleteUserAction}>
                        <input type="hidden" name="user_id" value={u.id} />
                        <ConfirmSubmitButton
                          message="Delete this user? This will delete the auth account permanently."
                          className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-900 hover:bg-red-100"
                        >
                          Delete user
                        </ConfirmSubmitButton>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableShell>
      ) : (
        <EmptyState
          title="No users match these filters"
          description="Adjust search or filters, or invite someone new to join the platform."
        >
          <Link
            href="/dashboard/users/invite-teacher"
            className="inline-flex rounded-xl bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700"
          >
            Invite teacher
          </Link>
        </EmptyState>
      )}
    </div>
  )
}

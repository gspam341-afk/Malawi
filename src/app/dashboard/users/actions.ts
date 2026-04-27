'use server'

import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/auth'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { createSupabaseAdminClient } from '@/lib/supabase/admin'
import type { ProfileRole, ProfileStatus } from '@/types/db'

function clampRole(role: string): ProfileRole {
  const allowed: ProfileRole[] = ['admin', 'teacher', 'alumni', 'donor', 'student_optional']
  return (allowed.includes(role as ProfileRole) ? (role as ProfileRole) : 'teacher')
}

function clampStatus(status: string): ProfileStatus {
  const allowed: ProfileStatus[] = ['active', 'pending', 'inactive', 'banned']
  return (allowed.includes(status as ProfileStatus) ? (status as ProfileStatus) : 'active')
}

export async function updateUserAction(formData: FormData) {
  const admin = await requireAdmin()
  const supabase = await createSupabaseServerClient()

  const userId = String(formData.get('user_id') ?? '')
  if (!userId) redirect('/dashboard/users')

  const nameRaw = String(formData.get('name') ?? '')
  const role = clampRole(String(formData.get('role') ?? 'teacher'))
  const status = clampStatus(String(formData.get('status') ?? 'active'))

  if (admin.id === userId && status !== 'active') {
    throw new Error('You cannot deactivate your own admin account.')
  }

  const { error } = await supabase
    .from('profiles')
    .update({
      name: nameRaw.trim() || null,
      role,
      status,
    })
    .eq('id', userId)

  if (error) throw error

  redirect('/dashboard/users')
}

export async function deleteUserAction(formData: FormData) {
  const admin = await requireAdmin()

  const userId = String(formData.get('user_id') ?? '')
  if (!userId) redirect('/dashboard/users')

  if (admin.id === userId) {
    throw new Error('You cannot delete your own admin account.')
  }

  const supabaseAdmin = createSupabaseAdminClient()
  const { error } = await supabaseAdmin.auth.admin.deleteUser(userId)
  if (error) throw error

  redirect('/dashboard/users')
}

export async function deactivateUserAction(formData: FormData) {
  const admin = await requireAdmin()
  const supabase = await createSupabaseServerClient()

  const userId = String(formData.get('user_id') ?? '')
  if (!userId) redirect('/dashboard/users')

  if (admin.id === userId) {
    throw new Error('You cannot deactivate your own admin account.')
  }

  const { error } = await supabase.from('profiles').update({ status: 'inactive' }).eq('id', userId)
  if (error) throw error

  redirect('/dashboard/users')
}

export async function reactivateUserAction(formData: FormData) {
  await requireAdmin()
  const supabase = await createSupabaseServerClient()

  const userId = String(formData.get('user_id') ?? '')
  if (!userId) redirect('/dashboard/users')

  const { error } = await supabase.from('profiles').update({ status: 'active' }).eq('id', userId)
  if (error) throw error

  redirect('/dashboard/users')
}

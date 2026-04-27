import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import type { Tables } from '@/types/db'

export async function getCurrentUser() {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase.auth.getUser()
  if (error) return null
  return data.user
}

export async function requireUser() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')
  return user
}

export async function getCurrentProfile() {
  const user = await getCurrentUser()
  if (!user) return null

  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (error) return null

  return data as Tables['profiles']['Row']
}

export async function requireProfile() {
  const profile = await getCurrentProfile()
  if (!profile) redirect('/login')
  return profile
}

export function hasRole(
  profile: Pick<Tables['profiles']['Row'], 'role'>,
  roles: Tables['profiles']['Row']['role'][],
) {
  return roles.includes(profile.role)
}

export async function requireRole(roles: Tables['profiles']['Row']['role'][]) {
  const profile = await requireProfile()
  if (!hasRole(profile, roles)) redirect('/dashboard')
  return profile
}

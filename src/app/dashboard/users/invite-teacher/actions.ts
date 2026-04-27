'use server'

import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/auth'
import { createSupabaseAdminClient } from '@/lib/supabase/admin'
import type { ProfileRole } from '@/types/db'

function getAppOrigin() {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL
  if (explicit) return explicit.replace(/\/$/, '')

  const vercelUrl = process.env.VERCEL_URL
  if (vercelUrl) return `https://${vercelUrl}`

  return ''
}

function clampRole(role: string): ProfileRole {
  const allowed: ProfileRole[] = ['admin', 'teacher', 'alumni', 'donor', 'student_optional']
  return (allowed.includes(role as ProfileRole) ? (role as ProfileRole) : 'teacher')
}

export async function inviteTeacherAction(formData: FormData) {
  await requireAdmin()

  const email = String(formData.get('email') ?? '').trim().toLowerCase()
  const name = String(formData.get('name') ?? '').trim()
  const role = clampRole(String(formData.get('role') ?? 'teacher'))

  if (!email) {
    redirect('/dashboard/users/invite-teacher?error=Email%20is%20required')
  }

  const admin = createSupabaseAdminClient()
  const origin = getAppOrigin()
  const redirectTo = origin ? `${origin}/auth/confirm` : undefined

  try {
    const { data, error } = await admin.auth.admin.inviteUserByEmail(email, {
      redirectTo,
      data: {
        name: name || null,
        role,
      },
    })

    if (error) {
      redirect(`/dashboard/users/invite-teacher?error=${encodeURIComponent(error.message)}`)
    }

    const invitedUserId = data?.user?.id

    if (invitedUserId) {
      const { error: upsertError } = await admin.from('profiles').upsert({
        id: invitedUserId,
        email,
        name: name || null,
        role,
        status: 'active',
      })

      if (upsertError) {
        redirect(`/dashboard/users/invite-teacher?error=${encodeURIComponent(upsertError.message)}`)
      }
    }

    redirect('/dashboard/users/invite-teacher?success=1')
  } catch (e) {
    const digest = (e as { digest?: string } | null)?.digest
    if (digest && digest.startsWith('NEXT_REDIRECT')) {
      throw e
    }

    const msg = e instanceof Error ? e.message : 'Invite failed'
    redirect(`/dashboard/users/invite-teacher?error=${encodeURIComponent(msg)}`)
  }
}

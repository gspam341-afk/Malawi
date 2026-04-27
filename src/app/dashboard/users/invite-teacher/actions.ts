'use server'

import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/auth'
import { createSupabaseAdminClient } from '@/lib/supabase/admin'

export async function inviteTeacherAction(formData: FormData) {
  await requireAdmin()

  const email = String(formData.get('email') ?? '').trim().toLowerCase()
  const name = String(formData.get('name') ?? '').trim()
  const role = String(formData.get('role') ?? 'teacher')

  if (!email) {
    redirect('/dashboard/users/invite-teacher?error=Email%20is%20required')
  }

  const admin = createSupabaseAdminClient()

  try {
    const { data, error } = await admin.auth.admin.inviteUserByEmail(email, {
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
        role: 'teacher',
        status: 'active',
      })

      if (upsertError) {
        redirect(`/dashboard/users/invite-teacher?error=${encodeURIComponent(upsertError.message)}`)
      }
    }

    redirect('/dashboard/users/invite-teacher?success=1')
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Invite failed'
    redirect(`/dashboard/users/invite-teacher?error=${encodeURIComponent(msg)}`)
  }
}

'use server'

import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/auth'
import { createSupabaseServerClient } from '@/lib/supabase/server'

function normalizeStatus(input: string) {
  const allowed = ['pending', 'approved', 'rejected', 'changes_requested']
  return allowed.includes(input) ? input : 'pending'
}

export async function updateSubmissionStatusAction(submissionId: string, formData: FormData) {
  const admin = await requireAdmin()
  const supabase = await createSupabaseServerClient()

  const status = normalizeStatus(String(formData.get('status') ?? 'pending'))
  const rejectionReason = String(formData.get('rejection_reason') ?? '').trim()

  const payload: Record<string, unknown> = {
    status,
    reviewed_by: admin.id,
  }

  if (status === 'rejected' || status === 'changes_requested') {
    payload.rejection_reason = rejectionReason || '—'
  } else {
    payload.rejection_reason = null
  }

  const { error } = await supabase.from('submissions').update(payload).eq('id', submissionId)
  if (error) throw error

  redirect(`/dashboard/submissions/${submissionId}`)
}

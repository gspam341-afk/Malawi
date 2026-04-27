'use server'

import { redirect } from 'next/navigation'
import { requireProfile } from '@/lib/auth'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import type { Tables } from '@/types/db'

function canAccessSubmissions(profile: Pick<Tables['profiles']['Row'], 'role'>) {
  return profile.role === 'admin' || profile.role === 'teacher' || profile.role === 'alumni' || profile.role === 'donor'
}

function normalizeSubmissionStatus(input: string): Tables['submissions']['Row']['status'] {
  const allowed = ['pending', 'approved', 'rejected', 'changes_requested'] as const
  return (allowed.includes(input as (typeof allowed)[number]) ? input : 'pending') as Tables['submissions']['Row']['status']
}

function normalizeSubmissionType(input: string): Tables['submissions']['Row']['submission_type'] {
  const allowed = ['blog_post', 'activity_idea', 'teaching_material', 'printable_template'] as const
  return (allowed.includes(input as (typeof allowed)[number])
    ? input
    : 'activity_idea') as Tables['submissions']['Row']['submission_type']
}

export async function createSubmissionAction(formData: FormData) {
  const profile = await requireProfile()
  if (profile.role === 'student_optional') redirect('/dashboard')
  if (!canAccessSubmissions(profile)) redirect('/dashboard')

  const supabase = await createSupabaseServerClient()

  const title = String(formData.get('title') ?? '').trim()
  if (!title) throw new Error('Title is required')

  const payload = {
    title,
    description: String(formData.get('description') ?? '').trim() || null,
    submission_type: normalizeSubmissionType(String(formData.get('submission_type') ?? '')),
    file_url: String(formData.get('file_url') ?? '').trim() || null,
    external_link: String(formData.get('external_link') ?? '').trim() || null,
    submitted_by: profile.id,
    status: 'pending' as const,
  }

  const { data, error } = await supabase.from('submissions').insert(payload).select('id').single()
  if (error) throw error

  redirect(`/dashboard/submissions/${data.id}`)
}

export async function updateSubmissionStatusAction(submissionId: string, formData: FormData) {
  const profile = await requireProfile()
  if (profile.role !== 'admin') redirect(`/dashboard/submissions/${submissionId}`)

  const supabase = await createSupabaseServerClient()

  const status = normalizeSubmissionStatus(String(formData.get('status') ?? 'pending'))
  const rejectionReason = String(formData.get('rejection_reason') ?? '').trim()

  const payload: Record<string, unknown> = {
    status,
    reviewed_by: profile.id,
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

export async function updateSubmissionContentAction(submissionId: string, formData: FormData) {
  const profile = await requireProfile()
  if (profile.role === 'student_optional') redirect('/dashboard')

  const supabase = await createSupabaseServerClient()

  const { data: existing, error: fetchError } = await supabase
    .from('submissions')
    .select('id,submitted_by,status')
    .eq('id', submissionId)
    .single()

  if (fetchError) throw fetchError
  if (!existing) redirect('/dashboard/submissions')

  const isCreator = existing.submitted_by === profile.id
  if (!isCreator || (existing.status !== 'pending' && existing.status !== 'changes_requested')) {
    redirect(`/dashboard/submissions/${submissionId}`)
  }

  const title = String(formData.get('title') ?? '').trim()
  if (!title) throw new Error('Title is required')

  const payload = {
    title,
    description: String(formData.get('description') ?? '').trim() || null,
    submission_type: normalizeSubmissionType(String(formData.get('submission_type') ?? '')),
    file_url: String(formData.get('file_url') ?? '').trim() || null,
    external_link: String(formData.get('external_link') ?? '').trim() || null,
  }

  const { error } = await supabase.from('submissions').update(payload).eq('id', submissionId)
  if (error) throw error

  redirect(`/dashboard/submissions/${submissionId}`)
}

'use client'

import type React from 'react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { CheckCircle2 } from 'lucide-react'
import { ActionButton } from '@/components/dashboard/ActionButton'
import { FieldLabel } from '@/components/dashboard/FieldLabel'
import { dashInput } from '@/components/dashboard/classes'

export function ChangePasswordForm() {
  const router = useRouter()
  const [currentPassword, setCurrentPassword] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!password || password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    if (password !== confirm) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)
    try {
      const supabase = createSupabaseBrowserClient()
      if (!supabase) {
        throw new Error(
          'Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local.',
        )
      }

      const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
      if (sessionError) throw sessionError

      const email = sessionData.session?.user.email
      if (email && currentPassword) {
        const { error: reauthError } = await supabase.auth.signInWithPassword({
          email,
          password: currentPassword,
        })
        if (reauthError) throw reauthError
      }

      const { error: updateError } = await supabase.auth.updateUser({ password })
      if (updateError) throw updateError

      setCurrentPassword('')
      setPassword('')
      setConfirm('')
      setSuccess('Your password was updated successfully.')
      router.refresh()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to update password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid max-w-xl gap-5">
      <div>
        <FieldLabel htmlFor="current-pw" hint="Helps verify it is really you when your session supports re-auth.">
          Current password (optional)
        </FieldLabel>
        <input
          id="current-pw"
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className={`${dashInput} mt-2`}
          autoComplete="current-password"
        />
      </div>

      <div>
        <FieldLabel htmlFor="new-pw">New password</FieldLabel>
        <input
          id="new-pw"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={`${dashInput} mt-2`}
          autoComplete="new-password"
          required
        />
      </div>

      <div>
        <FieldLabel htmlFor="confirm-pw">Confirm new password</FieldLabel>
        <input
          id="confirm-pw"
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className={`${dashInput} mt-2`}
          autoComplete="new-password"
          required
        />
      </div>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900" role="alert">
          {error}
        </div>
      ) : null}
      {success ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
          {success}
        </div>
      ) : null}

      <div className="flex justify-end pt-2">
        <ActionButton type="submit" disabled={loading} icon={loading ? undefined : CheckCircle2}>
          {loading ? 'Saving…' : 'Update password'}
        </ActionButton>
      </div>
    </form>
  )
}

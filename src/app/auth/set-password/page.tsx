'use client'

import Link from 'next/link'
import type React from 'react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'

export default function SetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

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
      const { error: updateError } = await supabase.auth.updateUser({ password })
      if (updateError) throw updateError

      router.replace('/dashboard')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to set password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto grid max-w-xl gap-6">
      <section className="rounded-2xl border bg-white p-6">
        <h1 className="text-2xl font-semibold tracking-tight">Set password</h1>
        <p className="mt-2 text-sm text-zinc-700">Choose a password for your account.</p>

        <form onSubmit={onSubmit} className="mt-4 grid gap-4">
          <div className="grid gap-1">
            <label className="text-sm font-medium">New password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-zinc-900 focus:ring-4 focus:ring-zinc-900/10"
            />
          </div>

          <div className="grid gap-1">
            <label className="text-sm font-medium">Confirm password</label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-zinc-900 focus:ring-4 focus:ring-zinc-900/10"
            />
          </div>

          {error ? <div className="text-sm text-red-700">{error}</div> : null}

          <div className="flex items-center justify-end gap-3">
            <Link href="/login" className="text-sm text-zinc-700 hover:text-zinc-950">
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800 focus:outline-none focus:ring-4 focus:ring-zinc-900/20 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? 'Saving…' : 'Save password'}
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}

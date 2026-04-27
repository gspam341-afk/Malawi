'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'

function parseHashParams(hash: string) {
  const clean = hash.startsWith('#') ? hash.slice(1) : hash
  const params = new URLSearchParams(clean)
  const access_token = params.get('access_token')
  const refresh_token = params.get('refresh_token')
  const token_type = params.get('token_type')
  const expires_in = params.get('expires_in')
  const type = params.get('type')
  return { access_token, refresh_token, token_type, expires_in, type }
}

export default function AuthConfirmPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const hash = typeof window !== 'undefined' ? window.location.hash : ''
  const hashData = useMemo(() => parseHashParams(hash), [hash])

  useEffect(() => {
    let cancelled = false

    async function run() {
      try {
        setLoading(true)

        const supabase = createSupabaseBrowserClient()

        // If coming from invite/reset links, Supabase typically returns tokens in the URL hash.
        if (hashData.access_token && hashData.refresh_token) {
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: hashData.access_token,
            refresh_token: hashData.refresh_token,
          })

          if (sessionError) throw sessionError

          // Clean up hash in the URL
          window.history.replaceState({}, document.title, window.location.pathname + window.location.search)

          // Route based on type
          if (hashData.type === 'recovery') {
            router.replace('/auth/set-password')
            return
          }

          // Invite + signup: send to dashboard or login
          router.replace('/dashboard')
          return
        }

        // Fallback: show a helpful message
        const msg = searchParams.get('message')
        if (msg) {
          setError(msg)
        } else {
          setError('Missing confirmation data. Please open the link from your email again.')
        }
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'Confirmation failed'
        if (!cancelled) setError(msg)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    run()
    return () => {
      cancelled = true
    }
  }, [hashData.access_token, hashData.refresh_token, hashData.type, router, searchParams])

  return (
    <div className="mx-auto grid max-w-xl gap-6">
      <section className="rounded-2xl border bg-white p-6">
        <h1 className="text-2xl font-semibold tracking-tight">Confirming…</h1>
        {loading ? <p className="mt-2 text-sm text-zinc-700">Please wait.</p> : null}
        {error ? <p className="mt-2 text-sm text-red-700">{error}</p> : null}
        <div className="mt-4 flex items-center gap-3">
          <Link href="/login" className="text-sm font-medium text-zinc-900 hover:underline">
            Go to login
          </Link>
          <Link href="/" className="text-sm text-zinc-700 hover:text-zinc-950">
            Home
          </Link>
        </div>
      </section>
    </div>
  )
}

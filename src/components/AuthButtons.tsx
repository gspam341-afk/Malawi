'use client'

import type { AuthChangeEvent, Session } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'

const btnPrimary =
  'rounded-lg bg-emerald-700 px-3 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2'

const btnOutline =
  'rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-900 shadow-sm transition hover:border-slate-400 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2'

const linkDash =
  'rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2'

export function AuthButtons() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [isAuthed, setIsAuthed] = useState(false)

  useEffect(() => {
    const supabase = createSupabaseBrowserClient()
    if (!supabase) {
      queueMicrotask(() => {
        setIsAuthed(false)
        setLoading(false)
      })
      return
    }

    let cancelled = false

    void (async () => {
      const { data } = await supabase.auth.getSession()
      if (!cancelled) {
        setIsAuthed(!!data.session)
        setLoading(false)
      }
    })()

    const { data: sub } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, session: Session | null) => {
        setIsAuthed(!!session)
      },
    )

    return () => {
      cancelled = true
      sub.subscription.unsubscribe()
    }
  }, [])

  async function onLogout() {
    const supabase = createSupabaseBrowserClient()
    if (!supabase) return
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  if (loading) {
    return (
      <div className="h-9 w-[140px] rounded-lg bg-slate-100" aria-hidden="true" />
    )
  }

  if (!isAuthed) {
    return (
      <Link href="/login" className={btnPrimary}>
        Login
      </Link>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <Link href="/dashboard" className={linkDash}>
        Dashboard
      </Link>
      <button type="button" onClick={onLogout} className={btnOutline}>
        Logout
      </button>
    </div>
  )
}

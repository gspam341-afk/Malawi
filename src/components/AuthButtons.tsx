'use client'

import type { AuthChangeEvent, Session } from '@supabase/supabase-js'
import { LayoutDashboard, LogIn, LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'

const btnPrimary =
  'inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-700 px-3 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 [&_svg]:shrink-0'

const btnOutline =
  'inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-900 shadow-sm transition hover:border-slate-400 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 [&_svg]:shrink-0'

const linkDash =
  'inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 [&_svg]:shrink-0'

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
        <LogIn className="h-4 w-4" aria-hidden />
        Login
      </Link>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <Link href="/dashboard" className={linkDash}>
        <LayoutDashboard className="h-4 w-4 text-emerald-700" aria-hidden />
        Dashboard
      </Link>
      <button type="button" onClick={onLogout} className={btnOutline}>
        <LogOut className="h-4 w-4" aria-hidden />
        Logout
      </button>
    </div>
  )
}

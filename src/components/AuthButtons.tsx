'use client'

import type { AuthChangeEvent, Session } from '@supabase/supabase-js'
import { LayoutDashboard, LogIn, LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'

const btnPrimary =
  'inline-flex items-center justify-center gap-2 rounded-full border border-transparent bg-jac-purple px-4 py-2 text-sm font-semibold text-white no-underline shadow-[0_6px_20px_-4px_rgba(115,72,206,0.45)] transition hover:bg-[#6240b8] hover:text-white visited:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-jac-purple focus-visible:ring-offset-2 [&_svg]:shrink-0'

const btnOutline =
  'inline-flex items-center justify-center gap-2 rounded-full border border-jac-navy/18 bg-white px-4 py-2 text-sm font-semibold text-jac-navy no-underline shadow-jac-soft transition hover:border-jac-purple/35 hover:bg-jac-purple/8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-jac-purple focus-visible:ring-offset-2 [&_svg]:shrink-0'

const linkDash =
  'inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-jac-navy transition hover:bg-jac-purple/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-jac-purple focus-visible:ring-offset-2 [&_svg]:shrink-0'

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
      <div className="h-9 w-[140px] rounded-full bg-jac-navy/10" aria-hidden="true" />
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
        <LayoutDashboard className="h-4 w-4 text-jac-purple" aria-hidden />
        Dashboard
      </Link>
      <button type="button" onClick={onLogout} className={btnOutline}>
        <LogOut className="h-4 w-4" aria-hidden />
        Logout
      </button>
    </div>
  )
}

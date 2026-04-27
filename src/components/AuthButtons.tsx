'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'

export function AuthButtons() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [isAuthed, setIsAuthed] = useState(false)

  useEffect(() => {
    const supabase = createSupabaseBrowserClient()

    supabase.auth.getSession().then(({ data }) => {
      setIsAuthed(!!data.session)
      setLoading(false)
    })

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthed(!!session)
    })

    return () => {
      sub.subscription.unsubscribe()
    }
  }, [])

  async function onLogout() {
    const supabase = createSupabaseBrowserClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  if (loading) {
    return (
      <div className="h-8 w-[160px] rounded-md bg-zinc-100" aria-hidden="true" />
    )
  }

  if (!isAuthed) {
    return (
      <Link
        href="/login"
        className="rounded-md border px-3 py-1.5 text-zinc-800 hover:bg-zinc-50"
      >
        Login
      </Link>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <Link href="/dashboard" className="text-zinc-700 hover:text-zinc-950">
        Dashboard
      </Link>
      <button
        type="button"
        onClick={onLogout}
        className="rounded-md border px-3 py-1.5 text-zinc-800 hover:bg-zinc-50"
      >
        Logout
      </button>
    </div>
  )
}

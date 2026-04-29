'use client'

import { LogIn } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { dashInput } from '@/components/dashboard/classes'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'

export function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createSupabaseBrowserClient()
    if (!supabase) return

    let cancelled = false

    void (async () => {
      const { data } = await supabase.auth.getSession()
      if (cancelled || !data.session) return

      const { data: profile } = await supabase
        .from('profiles')
        .select('id,status')
        .eq('id', data.session.user.id)
        .single()

      if (!cancelled && profile?.status === 'active') {
        router.replace('/dashboard')
      }
    })()

    return () => {
      cancelled = true
    }
  }, [router])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const supabase = createSupabaseBrowserClient()
      if (!supabase) {
        setError(
          'Supabase is not configured. Copy .env.example to .env.local and set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.',
        )
        return
      }
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        setError(signInError.message)
        return
      }

      router.replace('/dashboard')
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-5">
      <div className="grid gap-1.5">
        <label className="text-sm font-semibold text-jac-navy">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={dashInput}
          autoComplete="email"
          placeholder="name@school.org"
        />
      </div>

      <div className="grid gap-1.5">
        <label className="text-sm font-semibold text-jac-navy">Password</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={dashInput}
          autoComplete="current-password"
          placeholder="Enter your password"
        />
      </div>

      {error ? (
        <div className="rounded-jac-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <Button type="submit" disabled={loading} className="w-full py-3" icon={loading ? undefined : LogIn}>
        {loading ? 'Signing in...' : 'Sign in'}
      </Button>
    </form>
  )
}

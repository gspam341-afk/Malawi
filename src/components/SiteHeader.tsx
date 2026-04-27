import Link from 'next/link'
import { AuthButtons } from '@/components/AuthButtons'

export function SiteHeader() {
  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-sm font-semibold tracking-tight">
          Physical Learning Activities
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/resources" className="text-zinc-700 hover:text-zinc-950">
            Resources
          </Link>
          <Link href="/blog" className="text-zinc-700 hover:text-zinc-950">
            Blog
          </Link>
          <AuthButtons />
        </nav>
      </div>
    </header>
  )
}

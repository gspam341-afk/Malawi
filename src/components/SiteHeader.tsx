import Link from 'next/link'
import { AuthButtons } from '@/components/AuthButtons'

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-sm font-semibold tracking-tight text-zinc-950">
          Physical Learning Activities
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link
            href="/resources"
            className="rounded-md px-2 py-1 text-zinc-700 transition hover:bg-zinc-100 hover:text-zinc-950 focus:outline-none focus:ring-4 focus:ring-zinc-900/10"
          >
            Resources
          </Link>
          <Link
            href="/blog"
            className="rounded-md px-2 py-1 text-zinc-700 transition hover:bg-zinc-100 hover:text-zinc-950 focus:outline-none focus:ring-4 focus:ring-zinc-900/10"
          >
            Blog
          </Link>
          <AuthButtons />
        </nav>
      </div>
    </header>
  )
}

import Link from 'next/link'
import { AuthButtons } from '@/components/AuthButtons'

const navLink =
  'rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2'

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/90 bg-white/95 shadow-sm backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="text-base font-semibold tracking-tight text-slate-900">
          STEM Activities
        </Link>
        <nav className="flex flex-1 flex-wrap items-center justify-end gap-1 sm:gap-2">
          <Link href="/" className={navLink}>
            Home
          </Link>
          <Link href="/resources" className={navLink}>
            STEM / Resources
          </Link>
          <Link href="/blog" className={navLink}>
            Blog
          </Link>
          <AuthButtons />
        </nav>
      </div>
    </header>
  )
}

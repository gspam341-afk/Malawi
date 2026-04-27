import Link from 'next/link'
import { AuthButtons } from '@/components/AuthButtons'
import { BookOpen, Home, LibraryBig, Newspaper } from 'lucide-react'

const navLink =
  'inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 [&_svg]:shrink-0'

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/90 bg-white/95 shadow-sm backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 text-base font-semibold tracking-tight text-slate-900">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800 ring-1 ring-emerald-600/15">
            <BookOpen className="h-5 w-5" aria-hidden />
          </span>
          STEM Activities
        </Link>
        <nav className="flex flex-1 flex-wrap items-center justify-end gap-1 sm:gap-2">
          <Link href="/" className={navLink}>
            <Home className="h-4 w-4 text-emerald-700" aria-hidden />
            Home
          </Link>
          <Link href="/resources" className={navLink}>
            <LibraryBig className="h-4 w-4 text-emerald-700" aria-hidden />
            STEM / Resources
          </Link>
          <Link href="/blog" className={navLink}>
            <Newspaper className="h-4 w-4 text-emerald-700" aria-hidden />
            Blog
          </Link>
          <AuthButtons />
        </nav>
      </div>
    </header>
  )
}

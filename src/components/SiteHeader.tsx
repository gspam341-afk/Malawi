import Link from 'next/link'
import { AuthButtons } from '@/components/AuthButtons'
import { BookOpen, Briefcase, Info } from 'lucide-react'

const navLink =
  'inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 [&_svg]:shrink-0'

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/90 bg-white/95 shadow-sm backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-3 md:px-6">
        <Link href="/" className="flex min-w-0 flex-1 items-center gap-2 text-base font-semibold tracking-tight text-slate-900 sm:flex-none">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800 ring-1 ring-emerald-600/15">
            <BookOpen className="h-5 w-5" aria-hidden />
          </span>
          <span className="truncate leading-tight">
            Jacaranda School
            <span className="hidden font-normal text-slate-600 sm:block sm:text-sm">STEM activities</span>
          </span>
        </Link>
        <nav className="flex flex-1 flex-wrap items-center justify-end gap-1 sm:gap-2">
          <Link href="/jobs" className={navLink}>
            <Briefcase className="h-4 w-4 text-emerald-700" aria-hidden />
            Jobs
          </Link>
          <Link href="/subjects" className={navLink}>
            <BookOpen className="h-4 w-4 text-emerald-700" aria-hidden />
            Subjects
          </Link>
          <Link href="/about" className={navLink}>
            <Info className="h-4 w-4 text-emerald-700" aria-hidden />
            About us
          </Link>
          <AuthButtons />
        </nav>
      </div>
    </header>
  )
}

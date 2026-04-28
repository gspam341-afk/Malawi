import Link from 'next/link'
import { AuthButtons } from '@/components/AuthButtons'
import { BookMarked, BookOpen, Briefcase, Info } from 'lucide-react'

const navLink =
  'inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-jac-navy transition hover:bg-jac-purple/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-jac-purple focus-visible:ring-offset-2 [&_svg]:shrink-0'

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b-2 border-jac-purple/18 bg-white/92 shadow-[0_4px_24px_-6px_rgba(28,24,48,0.12)] backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-3 md:px-6">
        <Link
          href="/"
          className="flex min-w-0 flex-1 items-center gap-2 text-base font-semibold tracking-tight text-jac-navy sm:flex-none"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-jac-md bg-jac-purple/12 text-jac-purple ring-1 ring-jac-purple/15">
            <BookOpen className="h-5 w-5" aria-hidden />
          </span>
          <span className="truncate leading-tight">
            Jacaranda School
            <span className="hidden font-normal text-jac-navy/70 sm:block sm:text-sm">STEM activities</span>
          </span>
        </Link>
        <nav className="flex flex-1 flex-wrap items-center justify-end gap-1 sm:gap-2">
          <Link href="/jobs" className={navLink}>
            <Briefcase className="h-4 w-4 text-jac-purple" aria-hidden />
            Jobs
          </Link>
          <Link href="/subjects" className={navLink}>
            <BookOpen className="h-4 w-4 text-jac-purple" aria-hidden />
            Subjects
          </Link>
          <Link href="/courses" className={navLink}>
            <BookMarked className="h-4 w-4 text-jac-purple" aria-hidden />
            Courses
          </Link>
          <Link href="/about" className={navLink}>
            <Info className="h-4 w-4 text-jac-purple" aria-hidden />
            About us
          </Link>
          <AuthButtons />
        </nav>
      </div>
    </header>
  )
}

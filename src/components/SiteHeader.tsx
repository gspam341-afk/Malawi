 'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { AuthButtons } from '@/components/AuthButtons'
import { BookMarked, BookOpen, Briefcase, Info, Menu, X } from 'lucide-react'

const navLink =
  'inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-jac-navy hover:bg-jac-purple/8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-jac-purple focus-visible:ring-offset-2 [&_svg]:shrink-0'

const mobileNavLink =
  'inline-flex items-center gap-3 rounded-jac-md border border-jac-purple/15 bg-white/85 px-4 py-3 text-base font-semibold text-jac-navy shadow-[0_2px_8px_rgba(28,24,48,0.08)] transition hover:border-jac-purple/25 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-jac-purple focus-visible:ring-offset-2'

export function SiteHeader() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!menuOpen) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [menuOpen])

  return (
    <header className="sticky top-0 z-40 border-b border-jac-purple/15 bg-white/96 shadow-[0_1px_6px_rgba(28,24,48,0.08)]">
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

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          className={`relative inline-flex h-11 w-11 items-center justify-center rounded-full border bg-white text-jac-navy shadow-[0_2px_8px_rgba(28,24,48,0.1)] transition-all duration-300 hover:bg-jac-purple/6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-jac-purple md:hidden ${
            menuOpen ? 'border-jac-purple/45 rotate-90 scale-105' : 'border-jac-purple/20'
          }`}
        >
          <span
            className={`absolute h-0.5 w-5 rounded-full bg-jac-navy transition-all duration-300 ${
              menuOpen ? 'translate-y-0 rotate-45' : '-translate-y-1.5 rotate-0'
            }`}
          />
          <span
            className={`absolute h-0.5 w-5 rounded-full bg-jac-navy transition-all duration-300 ${
              menuOpen ? 'opacity-0' : 'opacity-100'
            }`}
          />
          <span
            className={`absolute h-0.5 w-5 rounded-full bg-jac-navy transition-all duration-300 ${
              menuOpen ? 'translate-y-0 -rotate-45' : 'translate-y-1.5 rotate-0'
            }`}
          />
        </button>

        <nav className="hidden flex-1 flex-wrap items-center justify-end gap-1 sm:gap-2 md:flex">
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

      <div
        className={`fixed inset-0 z-50 bg-jac-navy/35 backdrop-blur-sm transition-all duration-500 md:hidden ${
          menuOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        <div
          className={`absolute right-0 top-0 h-full w-full max-w-sm overflow-hidden border-l border-jac-purple/15 bg-gradient-to-b from-white via-jac-offwhite to-[#ece7f8] p-5 shadow-[-10px_0_30px_-20px_rgba(28,24,48,0.4)] transition-all duration-500 ${
            menuOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-80'
          }`}
        >
          <div className="pointer-events-none absolute -right-12 -top-14 h-52 w-52 rounded-full bg-jac-purple/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-12 -left-12 h-44 w-44 rounded-full bg-jac-pink/25 blur-3xl" />

          <div className="mb-5 flex items-center justify-between">
            <p className={`text-sm font-semibold uppercase tracking-wide text-jac-purple transition-all duration-500 ${menuOpen ? 'translate-y-0 opacity-100' : 'translate-y-1 opacity-0'}`}>
              Menu
            </p>
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
              className={`inline-flex h-9 w-9 items-center justify-center rounded-full border border-jac-purple/20 bg-white text-jac-navy transition-all duration-300 hover:bg-jac-purple/6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-jac-purple ${
                menuOpen ? 'scale-100 rotate-0' : 'scale-75 rotate-45 opacity-0'
              }`}
            >
              <X className="h-5 w-5" aria-hidden />
            </button>
          </div>

          <div className="grid gap-3">
            <Link
              href="/jobs"
              className={`${mobileNavLink} transition-all duration-500 ${menuOpen ? 'translate-x-0 opacity-100' : 'translate-x-6 opacity-0'}`}
              style={{ transitionDelay: menuOpen ? '70ms' : '0ms' }}
            >
              <Briefcase className="h-5 w-5 text-jac-purple" aria-hidden />
              Jobs
            </Link>
            <Link
              href="/subjects"
              className={`${mobileNavLink} transition-all duration-500 ${menuOpen ? 'translate-x-0 opacity-100' : 'translate-x-6 opacity-0'}`}
              style={{ transitionDelay: menuOpen ? '130ms' : '0ms' }}
            >
              <BookOpen className="h-5 w-5 text-jac-purple" aria-hidden />
              Subjects
            </Link>
            <Link
              href="/courses"
              className={`${mobileNavLink} transition-all duration-500 ${menuOpen ? 'translate-x-0 opacity-100' : 'translate-x-6 opacity-0'}`}
              style={{ transitionDelay: menuOpen ? '190ms' : '0ms' }}
            >
              <BookMarked className="h-5 w-5 text-jac-purple" aria-hidden />
              Courses
            </Link>
            <Link
              href="/about"
              className={`${mobileNavLink} transition-all duration-500 ${menuOpen ? 'translate-x-0 opacity-100' : 'translate-x-6 opacity-0'}`}
              style={{ transitionDelay: menuOpen ? '250ms' : '0ms' }}
            >
              <Info className="h-5 w-5 text-jac-purple" aria-hidden />
              About us
            </Link>
          </div>

          <div
            className={`mt-6 rounded-jac-lg border border-jac-purple/12 bg-white/80 p-3 transition-all duration-500 ${
              menuOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}
            style={{ transitionDelay: menuOpen ? '320ms' : '0ms' }}
          >
            <AuthButtons />
          </div>
        </div>
      </div>
    </header>
  )
}

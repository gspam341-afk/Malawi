import Link from 'next/link'
import { BookOpen, Mail, MapPin } from 'lucide-react'

const footerLink =
  'text-sm text-jac-navy/70 hover:text-jac-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-jac-purple focus-visible:ring-offset-2 rounded-sm'

export function SiteFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-10 border-t border-jac-purple/16 bg-white/85">
      <div className="mx-auto grid w-full max-w-[1400px] gap-8 px-4 py-10 md:grid-cols-3 md:gap-10 md:px-8 md:py-12">
        <div className="space-y-3">
          <Link href="/" className="inline-flex items-center gap-2 text-jac-navy">
            <span className="flex h-8 w-8 items-center justify-center rounded-jac-md bg-jac-purple/10 text-jac-purple">
              <BookOpen className="h-4 w-4" aria-hidden />
            </span>
            <span className="font-semibold tracking-tight">Jacaranda School</span>
          </Link>
          <p className="max-w-sm text-sm leading-relaxed text-jac-navy/68">
            A calm, practical STEM learning hub with activities, courses and classroom-ready resources.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-jac-navy/55">Explore</h2>
          <nav className="grid gap-2">
            <Link href="/subjects" className={footerLink}>
              Subjects
            </Link>
            <Link href="/courses" className={footerLink}>
              Courses
            </Link>
            <Link href="/resources" className={footerLink}>
              Activities
            </Link>
            <Link href="/about" className={footerLink}>
              About us
            </Link>
          </nav>
        </div>

        <div className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-jac-navy/55">Contact</h2>
          <ul className="grid gap-2 text-sm text-jac-navy/70">
            <li className="inline-flex items-center gap-2">
              <Mail className="h-4 w-4 text-jac-purple" aria-hidden />
              <span>hello@jacarandaschool.mw</span>
            </li>
            <li className="inline-flex items-center gap-2">
              <MapPin className="h-4 w-4 text-jac-purple" aria-hidden />
              <span>Blantyre, Malawi</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-jac-purple/12">
        <div className="mx-auto flex w-full max-w-[1400px] flex-wrap items-center justify-between gap-2 px-4 py-4 text-xs text-jac-navy/55 md:px-8">
          <p>© {year} Jacaranda School. All rights reserved.</p>
          <p>Built for focused, real-world STEM learning.</p>
        </div>
      </div>
    </footer>
  )
}

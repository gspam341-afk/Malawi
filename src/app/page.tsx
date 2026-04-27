import Link from 'next/link'
import {
  ArrowRight,
  BookOpen,
  Cpu,
  Download,
  Filter,
  Globe,
  GraduationCap,
  LayoutDashboard,
  Shield,
  UserCheck,
} from 'lucide-react'
import { ButtonLink } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { STEM_CATEGORY_LIST } from '@/lib/stemCategories'
import { StemCategoryIcon } from '@/components/stem/StemCategoryIcon'

export default function Home() {
  return (
    <div className="grid gap-16 pb-8">
      <section className="relative overflow-hidden rounded-3xl border border-slate-200/90 bg-gradient-to-br from-emerald-50/90 via-white to-sky-50/80 px-6 py-12 shadow-sm md:px-10 md:py-16">
        <div className="relative max-w-3xl">
          <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-800">
            <BookOpen className="h-4 w-4" aria-hidden />
            Classroom STEM
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl lg:text-5xl">
            Physical STEM learning activities for the classroom
          </h1>
          <p className="mt-4 text-lg text-slate-700">
            Find printable, hands-on and movement-based activities organized by STEM category, subject and grade level.
            Teachers can upload and publish resources; students can browse public activities without an account.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <ButtonLink href="/resources" icon={LayoutDashboard} iconRight={ArrowRight}>
              Browse STEM activities
            </ButtonLink>
            <ButtonLink href="/login" variant="secondary" icon={GraduationCap}>
              Teacher login
            </ButtonLink>
          </div>
          <p className="mt-6 inline-flex items-center gap-2 text-sm text-slate-600">
            <Globe className="h-4 w-4 shrink-0 text-emerald-700" aria-hidden />
            Students can explore activities without signing in.
          </p>
        </div>
      </section>

      <section className="grid gap-6">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Explore by STEM</h2>
          <p className="mt-2 max-w-2xl text-slate-600">
            Choose a pathway to see activities aligned to science, technology, engineering, or mathematics — then filter
            by grade and subject.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {STEM_CATEGORY_LIST.map((cat) => {
            const href = `/stem/${cat.slug}`
            const inner = (
              <>
                <div className="flex items-start justify-between gap-4">
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800 ring-1 ring-emerald-600/15">
                    <StemCategoryIcon slug={cat.slug} className="h-8 w-8" />
                  </span>
                  {cat.comingSoon ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-900 ring-1 ring-amber-600/20">
                      <Cpu className="h-3.5 w-3.5" aria-hidden />
                      Coming soon
                    </span>
                  ) : null}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-slate-900">{cat.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{cat.description}</p>
                {cat.subjectNames.length ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {cat.subjectNames.map((n) => (
                      <span
                        key={n}
                        className="rounded-full bg-sky-50 px-2.5 py-0.5 text-xs font-medium text-sky-900 ring-1 ring-sky-600/15"
                      >
                        {n}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="mt-4 text-sm text-slate-500">No subject tags yet — content is planned.</p>
                )}
                <span className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-emerald-800 group-hover:underline">
                  {cat.comingSoon ? 'View Technology page' : `Open ${cat.title}`}
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden />
                </span>
              </>
            )

            return (
              <Link
                key={cat.slug}
                href={href}
                className="group block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
              >
                <Card className="h-full transition group-hover:border-emerald-200 group-hover:shadow-md" padding="p-6">
                  {inner}
                </Card>
              </Link>
            )
          })}
        </div>
      </section>

      <section className="grid gap-8 md:grid-cols-2 md:items-start md:gap-10">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">How it works</h2>
          <p className="mt-2 text-slate-600">A simple path from browsing to running an activity in class.</p>
        </div>
        <ol className="grid gap-4">
          {[
            {
              Icon: LayoutDashboard,
              text: 'Choose a STEM category that fits your lesson.',
            },
            { Icon: Filter, text: 'Filter by grade level or subject to narrow the list.' },
            { Icon: BookOpen, text: 'Open an activity to read outcomes, timing, and materials.' },
            { Icon: Download, text: 'Prepare materials or download printables for students.' },
          ].map((step, i) => (
            <li key={step.text} className="flex gap-4 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800">
                <step.Icon className="h-5 w-5" aria-hidden />
              </span>
              <div className="pt-0.5">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Step {i + 1}</p>
                <p className="mt-1 text-sm leading-relaxed text-slate-700">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="rounded-3xl border border-slate-200/90 bg-white px-6 py-10 shadow-sm md:px-10">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Built for teachers</h2>
        <p className="mt-3 max-w-3xl text-slate-600">
          Teachers create and publish their own resources when they sign in. An admin manages users and platform
          settings — not every individual activity — so your classroom ideas can go live quickly.
        </p>
        <ul className="mt-6 grid gap-4 sm:grid-cols-3">
          <li className="flex gap-3 rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
            <UserCheck className="h-6 w-6 shrink-0 text-emerald-800" aria-hidden />
            <span className="text-sm leading-relaxed text-slate-700">
              <span className="font-semibold text-slate-900">Teachers publish directly</span> — activities go from draft to
              live when you are ready.
            </span>
          </li>
          <li className="flex gap-3 rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
            <Shield className="h-6 w-6 shrink-0 text-emerald-800" aria-hidden />
            <span className="text-sm leading-relaxed text-slate-700">
              <span className="font-semibold text-slate-900">Admin manages platform</span> — users, subjects, and review
              workflows stay organized.
            </span>
          </li>
          <li className="flex gap-3 rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
            <Globe className="h-6 w-6 shrink-0 text-emerald-800" aria-hidden />
            <span className="text-sm leading-relaxed text-slate-700">
              <span className="font-semibold text-slate-900">Students browse freely</span> — no login required for public
              activities.
            </span>
          </li>
        </ul>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href="/login" icon={GraduationCap}>
            Teacher login
          </ButtonLink>
          <ButtonLink href="/blog" variant="secondary" icon={BookOpen}>
            Read the blog
          </ButtonLink>
        </div>
      </section>
    </div>
  )
}

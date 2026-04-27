import {
  ArrowRight,
  BookOpen,
  ClipboardList,
  Compass,
  Globe2,
  GraduationCap,
  Printer,
  Route,
  ShieldCheck,
  Sparkles,
  UploadCloud,
  UserCheck,
} from 'lucide-react'
import { LatestBlogSection } from '@/components/public/LatestBlogSection'
import { StemPathwayGrid } from '@/components/public/StemPathwayGrid'
import { ButtonLink } from '@/components/ui/Button'

export default async function Home() {
  return (
    <div className="grid w-full gap-20 pb-12">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-[2rem] border border-emerald-200/60 bg-gradient-to-br from-emerald-50 via-white to-teal-50/90 px-6 py-14 shadow-lg shadow-emerald-900/5 md:px-14 md:py-20 lg:py-24">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-teal-200/35 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-16 h-64 w-64 rounded-full bg-amber-200/30 blur-3xl" />
        <div className="relative mx-auto max-w-4xl text-center lg:max-w-5xl">
          <p className="inline-flex items-center justify-center gap-2 text-sm font-semibold uppercase tracking-wider text-emerald-800">
            <Sparkles className="h-5 w-5" aria-hidden />
            Jacaranda School
          </p>
          <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-900 md:text-5xl lg:text-6xl">
            Explore STEM activities at Jacaranda School
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-slate-700 md:text-xl">
            Browse hands-on, printable and movement-based activities for{' '}
            <span className="font-semibold text-slate-900">Grade 6 to Grade 14</span>. Choose a STEM pathway, discover
            activities and get curious before class.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:flex-wrap">
            <ButtonLink href="/subjects" icon={BookOpen} iconRight={ArrowRight}>
              Explore subjects
            </ButtonLink>
            <ButtonLink href="/login" variant="secondary" icon={GraduationCap}>
              Teacher login
            </ButtonLink>
          </div>
          <p className="mx-auto mt-8 inline-flex max-w-xl flex-wrap items-center justify-center gap-2 text-center text-sm text-slate-600">
            <Compass className="h-4 w-4 shrink-0 text-emerald-700" aria-hidden />
            Students can explore public activities without signing in.
          </p>
        </div>
      </section>

      <LatestBlogSection />

      {/* STEM pathways */}
      <section className="grid gap-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">Choose your STEM pathway</h2>
          <p className="mt-4 text-lg leading-relaxed text-slate-600">
            Pick a category to explore activities connected to your subjects. Each pathway only shows the activities
            that belong to that STEM area.
          </p>
        </div>
        <StemPathwayGrid />
      </section>

      {/* Student curiosity */}
      <section className="rounded-[2rem] border border-slate-200/80 bg-white/90 px-6 py-14 shadow-md md:px-12">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Learn by exploring</h2>
          <p className="mt-4 text-lg text-slate-600">
            Activities help you become curious before class — see what you need, prepare for lessons and connect STEM to
            the real world.
          </p>
        </div>
        <ul className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-3">
          <li className="rounded-2xl border border-emerald-100 bg-gradient-to-b from-emerald-50/80 to-white p-6 shadow-sm">
            <Compass className="h-10 w-10 text-emerald-800" aria-hidden />
            <h3 className="mt-4 font-semibold text-slate-900">Explore before class</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Skim outcomes and materials so you walk in ready to participate.
            </p>
          </li>
          <li className="rounded-2xl border border-teal-100 bg-gradient-to-b from-teal-50/80 to-white p-6 shadow-sm">
            <ClipboardList className="h-10 w-10 text-teal-800" aria-hidden />
            <h3 className="mt-4 font-semibold text-slate-900">Understand what you need</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Check timing, group size and supplies before the lesson starts.
            </p>
          </li>
          <li className="rounded-2xl border border-sky-100 bg-gradient-to-b from-sky-50/70 to-white p-6 shadow-sm">
            <Globe2 className="h-10 w-10 text-sky-800" aria-hidden />
            <h3 className="mt-4 font-semibold text-slate-900">Connect subjects to real life</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              See how science, maths, agriculture and more show up beyond the textbook.
            </p>
          </li>
        </ul>
      </section>

      {/* How it works */}
      <section className="grid gap-10 lg:grid-cols-2 lg:items-start lg:gap-16">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">How it works</h2>
          <p className="mt-3 text-lg text-slate-600">Four simple steps from browsing to showing up prepared.</p>
        </div>
        <ol className="grid gap-4">
          {[
            { Icon: Route, text: 'Choose a STEM pathway that matches what you are studying.' },
            { Icon: GraduationCap, text: 'Pick your grade level to narrow the list.' },
            { Icon: BookOpen, text: 'Open an activity to read outcomes and materials.' },
            { Icon: Printer, text: 'Prepare materials or questions for class — or print what you need.' },
          ].map((step, i) => (
            <li
              key={step.text}
              className="flex gap-4 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm transition hover:border-emerald-200"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-900">
                <step.Icon className="h-6 w-6" aria-hidden />
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Step {i + 1}</p>
                <p className="mt-1 text-base leading-relaxed text-slate-700">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Teachers */}
      <section className="rounded-[2rem] border border-slate-200/90 bg-slate-50/40 px-6 py-12 md:px-12">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">For teachers</h2>
        <p className="mt-3 max-w-2xl text-slate-600">
          Teachers can log in to create and publish hands-on activities for their classes. Administrators manage users
          and platform settings so the space stays safe and organised.
        </p>
        <ul className="mt-8 grid gap-4 sm:grid-cols-3">
          <li className="flex gap-3 rounded-xl bg-white/90 p-4 shadow-sm ring-1 ring-slate-100">
            <UserCheck className="h-6 w-6 shrink-0 text-emerald-800" aria-hidden />
            <span className="text-sm leading-relaxed text-slate-700">
              <span className="font-semibold text-slate-900">Teachers</span> sign in to add and publish activities.
            </span>
          </li>
          <li className="flex gap-3 rounded-xl bg-white/90 p-4 shadow-sm ring-1 ring-slate-100">
            <UploadCloud className="h-6 w-6 shrink-0 text-emerald-800" aria-hidden />
            <span className="text-sm leading-relaxed text-slate-700">
              <span className="font-semibold text-slate-900">Publish</span> printable and classroom-ready resources.
            </span>
          </li>
          <li className="flex gap-3 rounded-xl bg-white/90 p-4 shadow-sm ring-1 ring-slate-100">
            <ShieldCheck className="h-6 w-6 shrink-0 text-emerald-800" aria-hidden />
            <span className="text-sm leading-relaxed text-slate-700">
              <span className="font-semibold text-slate-900">Admins</span> oversee users and settings.
            </span>
          </li>
        </ul>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href="/login" icon={GraduationCap}>
            Teacher login
          </ButtonLink>
          <ButtonLink href="/resources" variant="secondary" icon={BookOpen}>
            All activities
          </ButtonLink>
        </div>
      </section>
    </div>
  )
}

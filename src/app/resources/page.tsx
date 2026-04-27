import Link from 'next/link'
import { Atom, Calculator, Cpu, LibraryBig, SearchX, SlidersHorizontal, Sprout } from 'lucide-react'
import { EmptyState } from '@/components/ui/EmptyState'
import { PageHeader } from '@/components/ui/PageHeader'
import { PublicResourceFilterForm } from '@/components/PublicResourceFilterForm'
import { ResourceCard } from '@/components/ResourceCard'
import { ButtonLink } from '@/components/ui/Button'
import { STEM_CATEGORY_LIST } from '@/lib/stemCategories'
import { getGradeLevels, getPublicResources, getSubjects } from '@/lib/queries/publicResources'

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

function getParam(sp: Record<string, string | string[] | undefined>, key: string) {
  const v = sp[key]
  return Array.isArray(v) ? v[0] : v
}

const stemChipIcon = {
  science: Atom,
  technology: Cpu,
  engineering: Sprout,
  mathematics: Calculator,
} as const

export default async function ResourcesPage({ searchParams }: Props) {
  const sp = await searchParams

  const q = getParam(sp, 'q') ?? ''
  const grade = getParam(sp, 'grade') ?? ''
  const subject = getParam(sp, 'subject') ?? ''

  const print_required = getParam(sp, 'print_required')
  const extra_materials_required = getParam(sp, 'extra_materials_required')

  const [gradeLevels, subjects, resources] = await Promise.all([
    getGradeLevels(),
    getSubjects(),
    getPublicResources({
      q: q || undefined,
      grade: grade || undefined,
      subject: subject || undefined,
      print_required: print_required ? print_required === 'true' : undefined,
      extra_materials_required: extra_materials_required
        ? extra_materials_required === 'true'
        : undefined,
    }),
  ])

  const defaults = {
    q,
    grade,
    subject,
    print_required: print_required ?? '',
    extra_materials_required: extra_materials_required ?? '',
  }

  return (
    <div className="grid gap-10">
      <PageHeader
        eyebrow="Jacaranda School"
        title="All Jacaranda STEM activities"
        description="Every published public activity across Science, Engineering, Mathematics and more — filter by grade, subject, printables and materials, or open a STEM pathway for a narrower list."
        icon={LibraryBig}
      />

      <div className="rounded-2xl border border-emerald-100/80 bg-gradient-to-br from-emerald-50/50 via-white to-teal-50/40 p-6 md:p-8">
        <p className="text-base leading-relaxed text-slate-700">
          This page shows all published activities in one place. When you want to focus on one STEM area only, use a
          pathway so you only see activities for the subjects in that category.
        </p>
        <p className="mt-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
          <SlidersHorizontal className="h-4 w-4 text-emerald-700" aria-hidden />
          STEM pathways
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {STEM_CATEGORY_LIST.map((c) => {
            const ChipIcon = stemChipIcon[c.slug]
            return (
              <Link
                key={c.slug}
                href={`/stem/${c.slug}`}
                className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-sm font-medium text-emerald-900 shadow-sm ring-1 ring-slate-200 transition hover:bg-emerald-50 hover:ring-emerald-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
              >
                <ChipIcon className="h-4 w-4 text-emerald-800" aria-hidden />
                {c.title}
              </Link>
            )
          })}
        </div>
      </div>

      <PublicResourceFilterForm action="/resources" gradeLevels={gradeLevels} subjects={subjects} defaults={defaults} />

      {resources.length ? (
        <div className="grid gap-5 md:grid-cols-2">
          {resources.map((r) => (
            <ResourceCard key={r.id} resource={r} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={SearchX}
          title="No activities match your filters"
          description="Try clearing one filter at a time, browse by STEM pathway, or check back when more resources are published."
        >
          <Link
            href="/resources"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-900 shadow-sm hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
          >
            Reset filters (reload)
          </Link>
          <ButtonLink href="/stem/science" variant="primary">
            Explore Science
          </ButtonLink>
        </EmptyState>
      )}
    </div>
  )
}

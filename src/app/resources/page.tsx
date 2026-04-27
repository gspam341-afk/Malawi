import Link from 'next/link'
import { EmptyState } from '@/components/ui/EmptyState'
import { PageHeader } from '@/components/ui/PageHeader'
import { PublicResourceFilterForm } from '@/components/PublicResourceFilterForm'
import { ResourceCard } from '@/components/ResourceCard'
import { STEM_CATEGORY_LIST } from '@/lib/stemCategories'
import { getGradeLevels, getPublicResources, getSubjects } from '@/lib/queries/publicResources'

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

function getParam(sp: Record<string, string | string[] | undefined>, key: string) {
  const v = sp[key]
  return Array.isArray(v) ? v[0] : v
}

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
        eyebrow="Browse"
        title="All learning activities"
        description="Browse every published physical learning activity. Filter by grade, subject, printables, and materials — or jump into a STEM category."
      />

      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">STEM categories</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {STEM_CATEGORY_LIST.map((c) => (
            <Link
              key={c.slug}
              href={`/stem/${c.slug}`}
              className="rounded-full bg-white px-3 py-1.5 text-sm font-medium text-emerald-900 shadow-sm ring-1 ring-slate-200 transition hover:bg-emerald-50 hover:ring-emerald-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
            >
              {c.letter} · {c.title}
            </Link>
          ))}
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
          title="No activities match your filters"
          description="Try clearing one filter at a time, browse by STEM category, or check back when more resources are published."
        >
          <Link
            href="/resources"
            className="inline-flex rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-900 shadow-sm hover:bg-slate-50"
          >
            Reset filters (reload)
          </Link>
          <Link
            href="/stem/science"
            className="inline-flex rounded-lg bg-emerald-700 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-800"
          >
            Explore Science
          </Link>
        </EmptyState>
      )}
    </div>
  )
}

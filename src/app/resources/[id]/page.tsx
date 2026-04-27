import Link from 'next/link'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { getPublicResourceById } from '@/lib/queries/publicResources'

type Props = {
  params: Promise<{ id: string }>
}

function field(label: string, value: string | number | null | undefined) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50/60 px-3 py-2">
      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</div>
      <div className="mt-1 text-sm font-medium text-slate-900">{value ?? '—'}</div>
    </div>
  )
}

export default async function ResourceDetailPage({ params }: Props) {
  const { id } = await params
  const resource = await getPublicResourceById(id)

  return (
    <div className="grid gap-10 pb-8">
      <div className="flex flex-wrap items-center gap-4">
        <Link
          href="/resources"
          className="text-sm font-medium text-emerald-800 underline-offset-4 hover:text-emerald-900 hover:underline"
        >
          ← Back to all activities
        </Link>
      </div>

      <Card className="overflow-hidden border-emerald-100 bg-gradient-to-br from-white via-white to-emerald-50/40 p-8 md:p-10">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="min-w-0 max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-800">Learning activity</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">{resource.title}</h1>
            {resource.result_description ? (
              <p className="mt-4 text-lg leading-relaxed text-slate-700">{resource.result_description}</p>
            ) : (
              <p className="mt-4 text-slate-500">No outcome summary provided.</p>
            )}
          </div>
          <div className="flex flex-wrap justify-end gap-2">
            {resource.print_required ? <Badge variant="stem">Printable</Badge> : null}
            {!resource.extra_materials_required ? <Badge variant="outline">No extra materials</Badge> : null}
            {resource.cutting_required ? <Badge variant="neutral">Cutting required</Badge> : null}
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-2 border-t border-slate-100 pt-8">
          {resource.subjects?.length ? (
            resource.subjects.map((s) => (
              <Badge key={s.id} variant="subject">
                {s.name}
              </Badge>
            ))
          ) : (
            <span className="text-sm text-slate-500">No subjects tagged.</span>
          )}
          {resource.grade_levels?.length
            ? resource.grade_levels
                .slice()
                .sort((a, b) => a.grade_number - b.grade_number)
                .map((g) => (
                  <Badge key={g.id} variant="outline">
                    {g.name}
                  </Badge>
                ))
            : null}
        </div>
      </Card>

      <section className="grid gap-6">
        <SectionHeader title="Activity details" />
        <Card padding="p-6">
          {resource.description ? (
            <div className="whitespace-pre-wrap text-sm leading-relaxed text-slate-800">{resource.description}</div>
          ) : (
            <EmptyState title="No full description yet" description="Open printable materials below if available." />
          )}
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {field('Activity type', resource.activity_type)}
            {field('Preparation time', resource.preparation_time)}
            {field('Activity duration', resource.activity_duration)}
            {field(
              'Group size',
              resource.group_size_min || resource.group_size_max
                ? `${resource.group_size_min ?? '—'}–${resource.group_size_max ?? '—'}`
                : null,
            )}
            {field('Difficulty', resource.difficulty_level)}
            {field('Resource type', resource.resource_type)}
          </div>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-2 lg:gap-8">
        <div className="grid gap-4">
          <SectionHeader title="Required materials" />
          <Card padding="p-6">
            {resource.required_materials?.length ? (
              <ul className="grid gap-3">
                {resource.required_materials.map((m) => (
                  <li key={m.id} className="rounded-xl border border-slate-100 bg-slate-50/50 px-4 py-3">
                    <div className="font-medium text-slate-900">
                      {m.quantity ? `${m.quantity}× ` : ''}
                      {m.name}
                    </div>
                    {m.note ? <div className="mt-1 text-xs text-slate-600">{m.note}</div> : null}
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState
                title="No materials listed"
                description="This activity may rely on everyday classroom items only, or details may be in the description."
              />
            )}
          </Card>
        </div>

        <div className="grid gap-4">
          <SectionHeader title="Printable materials" />
          <Card padding="p-6">
            {resource.printable_materials?.length ? (
              <ul className="grid gap-4">
                {resource.printable_materials.map((f) => (
                  <li key={f.id} className="rounded-xl border border-slate-100 bg-white px-4 py-4 shadow-sm">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <div className="font-semibold text-slate-900">{f.title}</div>
                        {f.description ? <div className="mt-1 text-xs text-slate-600">{f.description}</div> : null}
                        <div className="mt-3 flex flex-wrap gap-2">
                          {f.pages_count ? <Badge>{f.pages_count} pages</Badge> : null}
                          {f.paper_size ? <Badge>{f.paper_size}</Badge> : null}
                          {f.color_required ? <Badge>Color</Badge> : <Badge>B/W OK</Badge>}
                          {f.double_sided_recommended ? <Badge>Double-sided</Badge> : null}
                        </div>
                      </div>
                      <a
                        href={`/api/printable-materials/${f.id}/download`}
                        className="inline-flex shrink-0 items-center justify-center rounded-lg bg-emerald-700 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Download
                      </a>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState
                title="No printable files attached"
                description="Check the activity description for anything students can reproduce by hand."
              />
            )}
          </Card>
        </div>
      </section>

      <Card className="border-sky-100 bg-sky-50/40 p-6">
        <p className="text-sm leading-relaxed text-slate-800">
          <span className="font-semibold text-slate-900">Students:</span> you do not need an account to view public
          activities or download printables shared here.
        </p>
      </Card>
    </div>
  )
}

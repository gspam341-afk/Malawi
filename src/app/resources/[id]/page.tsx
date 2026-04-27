import Link from 'next/link'
import { Badge } from '@/components/ui/Badge'
import { getPublicResourceById } from '@/lib/queries/publicResources'

type Props = {
  params: Promise<{ id: string }>
}

function field(label: string, value: string | number | null | undefined) {
  return (
    <div>
      <div className="text-xs font-medium uppercase tracking-wide text-zinc-500">
        {label}
      </div>
      <div className="mt-1 text-sm text-zinc-800">{value ?? '—'}</div>
    </div>
  )
}

export default async function ResourceDetailPage({ params }: Props) {
  const { id } = await params
  const resource = await getPublicResourceById(id)

  const gradeLevels = resource.grade_levels?.length
    ? resource.grade_levels
        .slice()
        .sort((a, b) => a.grade_number - b.grade_number)
        .map((g) => g.name)
        .join(', ')
    : '—'

  const subjects = resource.subjects?.length
    ? resource.subjects.map((s) => s.name).join(', ')
    : '—'

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <Link href="/resources" className="text-sm text-zinc-700 hover:text-zinc-950">
          ← Back to resources
        </Link>
      </div>

      <section className="rounded-2xl border bg-white p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-950">
              {resource.title}
            </h1>
            {resource.result_description ? (
              <p className="mt-2 text-sm text-zinc-700">{resource.result_description}</p>
            ) : null}
          </div>
          <div className="flex flex-wrap gap-2">
            {resource.print_required ? <Badge>Printable</Badge> : null}
            {resource.cutting_required ? <Badge>Cutting required</Badge> : null}
            {!resource.extra_materials_required ? <Badge>No extra materials</Badge> : null}
          </div>
        </div>

        {resource.description ? (
          <div className="mt-4">
            <div className="text-xs font-medium uppercase tracking-wide text-zinc-500">
              Description
            </div>
            <p className="mt-1 whitespace-pre-wrap text-sm text-zinc-800">
              {resource.description}
            </p>
          </div>
        ) : null}

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {field('Grade levels', gradeLevels)}
          {field('Subjects', subjects)}
          {field('Activity type', resource.activity_type)}
          {field('Preparation time', resource.preparation_time)}
          {field('Duration', resource.activity_duration)}
          {field(
            'Group size',
            resource.group_size_min || resource.group_size_max
              ? `${resource.group_size_min ?? '—'}–${resource.group_size_max ?? '—'}`
              : null,
          )}
          {field('Difficulty', resource.difficulty_level)}
          {field('Resource type', resource.resource_type)}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border bg-white p-6">
          <h2 className="text-base font-semibold">Required materials</h2>
          {resource.required_materials?.length ? (
            <ul className="mt-3 grid gap-2 text-sm text-zinc-800">
              {resource.required_materials.map((m) => (
                <li key={m.id} className="rounded-md border px-3 py-2">
                  <div className="font-medium">
                    {m.quantity ? `${m.quantity}× ` : ''}
                    {m.name}
                  </div>
                  {m.note ? <div className="mt-1 text-xs text-zinc-600">{m.note}</div> : null}
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-3 text-sm text-zinc-700">No materials listed.</div>
          )}
        </div>

        <div className="rounded-2xl border bg-white p-6">
          <h2 className="text-base font-semibold">Printable materials</h2>
          {resource.printable_materials?.length ? (
            <ul className="mt-3 grid gap-2 text-sm">
              {resource.printable_materials.map((f) => (
                <li key={f.id} className="rounded-md border px-3 py-2">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="font-medium text-zinc-950">{f.title}</div>
                      {f.description ? (
                        <div className="mt-1 text-xs text-zinc-600">{f.description}</div>
                      ) : null}
                      <div className="mt-2 flex flex-wrap gap-2">
                        {f.pages_count ? <Badge>{f.pages_count} pages</Badge> : null}
                        {f.paper_size ? <Badge>{f.paper_size}</Badge> : null}
                        {f.color_required ? <Badge>Color</Badge> : <Badge>B/W OK</Badge>}
                        {f.double_sided_recommended ? <Badge>Double-sided</Badge> : null}
                      </div>
                    </div>
                    <a
                      href={f.file_url}
                      className="shrink-0 rounded-md bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-zinc-800"
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
            <div className="mt-3 text-sm text-zinc-700">No printable files yet.</div>
          )}
        </div>
      </section>
    </div>
  )
}

import Link from 'next/link'
import { Badge } from '@/components/ui/Badge'
import type { ResourceListItem } from '@/types/db'

function formatDuration(value: string | null) {
  if (!value) return null
  return value
}

function materialsSummary(materials: { name: string; quantity: number | null }[]) {
  if (!materials?.length) return 'No extra materials'
  return materials
    .slice(0, 4)
    .map((m) => (m.quantity ? `${m.quantity}× ${m.name}` : m.name))
    .join(', ')
}

export function ResourceCard({ resource }: { resource: ResourceListItem }) {
  const gradeLabel = resource.grade_levels?.length
    ? resource.grade_levels
        .slice()
        .sort((a, b) => a.grade_number - b.grade_number)
        .map((g) => g.name)
        .join(', ')
    : null

  const subjectsLabel = resource.subjects?.length
    ? resource.subjects.map((s) => s.name).join(', ')
    : null

  return (
    <Link
      href={`/resources/${resource.id}`}
      className="block rounded-xl border bg-white p-4 transition hover:bg-zinc-50"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold text-zinc-950">
            {resource.title}
          </h3>
          {resource.result_description ? (
            <p className="mt-1 line-clamp-2 text-sm text-zinc-700">
              {resource.result_description}
            </p>
          ) : null}
        </div>
        <div className="flex flex-wrap justify-end gap-2">
          {resource.print_required ? <Badge>Printable</Badge> : null}
          {resource.cutting_required ? <Badge>Cutting required</Badge> : null}
          {!resource.extra_materials_required ? <Badge>No extra materials</Badge> : null}
        </div>
      </div>

      <div className="mt-3 grid gap-2 text-sm text-zinc-700 sm:grid-cols-2">
        <div>
          <div className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            Outcome
          </div>
          <div className="line-clamp-2">{resource.result_description ?? '—'}</div>
        </div>
        <div>
          <div className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            Meta
          </div>
          <div className="line-clamp-2">
            {gradeLabel ? `${gradeLabel}` : 'Grades: —'}
            {resource.activity_duration ? ` · ${formatDuration(resource.activity_duration)}` : ''}
            {' · '}Requires: {materialsSummary(resource.required_materials ?? [])}
          </div>
          {subjectsLabel ? (
            <div className="mt-1 line-clamp-1 text-xs text-zinc-600">Subjects: {subjectsLabel}</div>
          ) : null}
        </div>
      </div>
    </Link>
  )
}

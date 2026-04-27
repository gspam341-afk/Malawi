import Link from 'next/link'
import { ResourceCard } from '@/components/ResourceCard'
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

  return (
    <div className="grid gap-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Resources</h1>
          <p className="mt-1 text-sm text-zinc-700">
            Browse published public activities and printable materials.
          </p>
        </div>
        <Link href="/" className="text-sm text-zinc-700 hover:text-zinc-950">
          Home
        </Link>
      </div>

      <form className="grid gap-3 rounded-2xl border bg-white p-4 sm:grid-cols-2 lg:grid-cols-6">
        <div className="lg:col-span-2">
          <label className="text-xs font-medium text-zinc-600">Search</label>
          <input
            name="q"
            defaultValue={q}
            placeholder="Search title or description"
            className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-zinc-600">Grade</label>
          <select
            name="grade"
            defaultValue={grade}
            className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
          >
            <option value="">All</option>
            {gradeLevels.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-medium text-zinc-600">Subject</label>
          <select
            name="subject"
            defaultValue={subject}
            className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
          >
            <option value="">All</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-medium text-zinc-600">Printable</label>
          <select
            name="print_required"
            defaultValue={print_required ?? ''}
            className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
          >
            <option value="">Any</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-medium text-zinc-600">Extra materials</label>
          <select
            name="extra_materials_required"
            defaultValue={extra_materials_required ?? ''}
            className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
          >
            <option value="">Any</option>
            <option value="true">Required</option>
            <option value="false">Not required</option>
          </select>
        </div>

        <div className="flex items-end gap-2">
          <button
            type="submit"
            className="inline-flex w-full items-center justify-center rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
          >
            Apply
          </button>
        </div>
      </form>

      {resources.length ? (
        <div className="grid gap-4 md:grid-cols-2">
          {resources.map((r) => (
            <ResourceCard key={r.id} resource={r} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border bg-white p-6 text-sm text-zinc-700">
          No resources found.
        </div>
      )}
    </div>
  )
}

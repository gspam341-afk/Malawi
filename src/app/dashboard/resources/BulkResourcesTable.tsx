'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'

type ResourceRow = {
  id: string
  title: string
  status: string
  visibility: string
  created_at: string
  updated_at: string
}

export function BulkResourcesTable(props: {
  resources: ResourceRow[]
  bulkDeleteAction: (formData: FormData) => void
  bulkSetDraftAction: (formData: FormData) => void
  bulkSetPublishedAction: (formData: FormData) => void
}) {
  const [selected, setSelected] = useState<Record<string, boolean>>({})

  const selectedIds = useMemo(() => {
    return props.resources.map((r) => r.id).filter((id) => selected[id])
  }, [props.resources, selected])

  const allSelected = props.resources.length > 0 && selectedIds.length === props.resources.length
  const anySelected = selectedIds.length > 0

  function toggleAll(next: boolean) {
    const map: Record<string, boolean> = {}
    for (const r of props.resources) map[r.id] = next
    setSelected(map)
  }

  return (
    <div className="overflow-hidden rounded-2xl border bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b bg-zinc-50 px-4 py-3">
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-zinc-800">
            <input
              type="checkbox"
              className="h-4 w-4 accent-zinc-900"
              checked={allSelected}
              onChange={(e) => toggleAll(e.target.checked)}
              aria-label="Select all"
            />
            Select all
          </label>
          <div className="text-sm text-zinc-700">Selected: {selectedIds.length}</div>
        </div>

        <div className="flex items-center gap-2">
          <form action={props.bulkSetPublishedAction}>
            {selectedIds.map((id) => (
              <input key={id} type="hidden" name="resource_ids" value={id} />
            ))}
            <button
              type="submit"
              disabled={!anySelected}
              className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-900 shadow-sm transition hover:bg-zinc-50 focus:outline-none focus:ring-4 focus:ring-zinc-900/10 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Publish
            </button>
          </form>

          <form action={props.bulkSetDraftAction}>
            {selectedIds.map((id) => (
              <input key={id} type="hidden" name="resource_ids" value={id} />
            ))}
            <button
              type="submit"
              disabled={!anySelected}
              className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-900 shadow-sm transition hover:bg-zinc-50 focus:outline-none focus:ring-4 focus:ring-zinc-900/10 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Set to draft
            </button>
          </form>

          <form
            action={(formData) => {
              if (!anySelected) return
              const ok = window.confirm(
                `Delete ${selectedIds.length} resource(s)? This will remove them and all related materials. This cannot be undone.`,
              )
              if (!ok) return
              props.bulkDeleteAction(formData)
            }}
          >
            {selectedIds.map((id) => (
              <input key={id} type="hidden" name="resource_ids" value={id} />
            ))}
            <button
              type="submit"
              disabled={!anySelected}
              className="rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm font-medium text-red-800 shadow-sm transition hover:bg-red-100 focus:outline-none focus:ring-4 focus:ring-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Delete selected
            </button>
          </form>
        </div>
      </div>

      <table className="w-full text-left text-sm">
        <thead className="bg-zinc-50 text-xs font-medium uppercase tracking-wide text-zinc-600">
          <tr>
            <th className="w-10 px-4 py-3"> </th>
            <th className="px-4 py-3">Title</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Visibility</th>
            <th className="px-4 py-3">Created</th>
            <th className="px-4 py-3">Updated</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {props.resources.map((r) => (
            <tr key={r.id} className="hover:bg-zinc-50">
              <td className="px-4 py-3">
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-zinc-900"
                  checked={Boolean(selected[r.id])}
                  onChange={(e) => setSelected((prev) => ({ ...prev, [r.id]: e.target.checked }))}
                  aria-label={`Select ${r.title}`}
                />
              </td>
              <td className="px-4 py-3 font-medium text-zinc-950">
                <Link href={`/dashboard/resources/${r.id}`} className="hover:underline">
                  {r.title}
                </Link>
              </td>
              <td className="px-4 py-3 text-zinc-700">{r.status}</td>
              <td className="px-4 py-3 text-zinc-700">{r.visibility}</td>
              <td className="px-4 py-3 text-zinc-700">{new Date(r.created_at).toLocaleDateString()}</td>
              <td className="px-4 py-3 text-zinc-700">{new Date(r.updated_at).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import {
  ResourceStatusBadge,
  VisibilityBadge,
} from '@/components/dashboard/DashboardStatusBadge'
import { SecondaryButton } from '@/components/dashboard/ActionButton'

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
    <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-md shadow-slate-200/40">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 bg-gradient-to-r from-teal-50/80 to-amber-50/40 px-4 py-4">
        <div className="flex flex-wrap items-center gap-4">
          <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-slate-800">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
              checked={allSelected}
              onChange={(e) => toggleAll(e.target.checked)}
              aria-label="Select all resources"
            />
            Select all
          </label>
          <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
            Selected: {selectedIds.length}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <form action={props.bulkSetPublishedAction}>
            {selectedIds.map((id) => (
              <input key={id} type="hidden" name="resource_ids" value={id} />
            ))}
            <SecondaryButton type="submit" disabled={!anySelected}>
              Publish
            </SecondaryButton>
          </form>

          <form action={props.bulkSetDraftAction}>
            {selectedIds.map((id) => (
              <input key={id} type="hidden" name="resource_ids" value={id} />
            ))}
            <SecondaryButton type="submit" disabled={!anySelected}>
              Move to draft
            </SecondaryButton>
          </form>

          <form
            action={(formData) => {
              if (!anySelected) return
              const ok = window.confirm(
                `Delete ${selectedIds.length} resource(s)? Related materials will be removed. This cannot be undone.`,
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
              className="inline-flex items-center justify-center rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-900 shadow-sm hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Delete selected
            </button>
          </form>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-slate-100 bg-white">
            <tr className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              <th className="w-12 px-4 py-3"> </th>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Visibility</th>
              <th className="hidden px-4 py-3 md:table-cell">Created</th>
              <th className="px-4 py-3">Updated</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {props.resources.map((r) => (
              <tr key={r.id} className="hover:bg-teal-50/25">
                <td className="px-4 py-4 align-middle">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                    checked={Boolean(selected[r.id])}
                    onChange={(e) => setSelected((prev) => ({ ...prev, [r.id]: e.target.checked }))}
                    aria-label={`Select ${r.title}`}
                  />
                </td>
                <td className="px-4 py-4 align-middle">
                  <Link
                    href={`/dashboard/resources/${r.id}`}
                    className="font-semibold text-slate-900 hover:text-teal-800 hover:underline"
                  >
                    {r.title}
                  </Link>
                  <div className="mt-1 text-xs text-slate-500">
                    <Link href={`/dashboard/resources/${r.id}/edit`} className="font-medium text-teal-800 hover:underline">
                      Edit →
                    </Link>
                  </div>
                </td>
                <td className="px-4 py-4 align-middle">
                  <ResourceStatusBadge status={r.status} />
                </td>
                <td className="px-4 py-4 align-middle">
                  <VisibilityBadge visibility={r.visibility} />
                </td>
                <td className="hidden px-4 py-4 align-middle text-slate-600 md:table-cell">
                  {new Date(r.created_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-4 align-middle text-slate-600">
                  {new Date(r.updated_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

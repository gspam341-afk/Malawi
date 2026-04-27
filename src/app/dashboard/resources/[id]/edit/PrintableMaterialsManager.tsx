'use client'

import { useMemo, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { updatePrintableMaterialAction, deletePrintableMaterialAction } from '@/app/dashboard/resources/[id]/edit/actions'

type Row = {
  id: string
  title: string
  description: string | null
  file_type: string | null
  pages_count: number | null
  paper_size: string
  color_required: boolean
  double_sided_recommended: boolean
  created_at: string
}

function PrintableRowEditor(props: {
  resourceId: string
  row: Row
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const [title, setTitle] = useState(props.row.title)
  const [description, setDescription] = useState(props.row.description ?? '')
  const [pagesCount, setPagesCount] = useState(props.row.pages_count ? String(props.row.pages_count) : '')
  const [paperSize, setPaperSize] = useState(props.row.paper_size || 'A4')
  const [colorRequired, setColorRequired] = useState(Boolean(props.row.color_required))
  const [doubleSidedRecommended, setDoubleSidedRecommended] = useState(Boolean(props.row.double_sided_recommended))
  const [error, setError] = useState<string | null>(null)

  const parsedPagesCount = useMemo(() => {
    const v = pagesCount.trim()
    if (!v) return null
    const n = Number(v)
    return Number.isFinite(n) ? n : null
  }, [pagesCount])

  function onSave() {
    setError(null)
    startTransition(() => {
      void updatePrintableMaterialAction({
        resourceId: props.resourceId,
        printableId: props.row.id,
        title,
        description: description.trim() || null,
        pagesCount: parsedPagesCount,
        colorRequired,
        doubleSidedRecommended,
        paperSize,
      })
        .then(() => router.refresh())
        .catch((e: unknown) => {
          setError(e instanceof Error ? e.message : 'Save failed')
        })
    })
  }

  function onDelete() {
    setError(null)
    startTransition(() => {
      void deletePrintableMaterialAction({ resourceId: props.resourceId, printableId: props.row.id })
        .then(() => router.refresh())
        .catch((e: unknown) => {
          setError(e instanceof Error ? e.message : 'Delete failed')
        })
    })
  }

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="grid gap-1 sm:col-span-2">
          <div className="text-xs font-medium uppercase tracking-wide text-zinc-500">File</div>
          <div className="text-sm text-zinc-800">
            {props.row.file_type ?? 'file'} · uploaded {new Date(props.row.created_at).toLocaleDateString()}
          </div>
        </div>

        <div className="grid gap-1 sm:col-span-2">
          <label className="text-sm font-medium">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-zinc-900 focus:ring-4 focus:ring-zinc-900/10"
          />
        </div>

        <div className="grid gap-1 sm:col-span-2">
          <label className="text-sm font-medium">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-zinc-900 focus:ring-4 focus:ring-zinc-900/10"
          />
        </div>

        <div className="grid gap-1">
          <label className="text-sm font-medium">Pages</label>
          <input
            value={pagesCount}
            onChange={(e) => setPagesCount(e.target.value)}
            className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-zinc-900 focus:ring-4 focus:ring-zinc-900/10"
          />
        </div>

        <div className="grid gap-1">
          <label className="text-sm font-medium">Paper size</label>
          <select
            value={paperSize}
            onChange={(e) => setPaperSize(e.target.value)}
            className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-zinc-900 focus:ring-4 focus:ring-zinc-900/10"
          >
            <option value="A4">A4</option>
            <option value="A3">A3</option>
            <option value="Letter">Letter</option>
          </select>
        </div>

        <div className="grid gap-2">
          <label className="flex items-center gap-2 text-sm text-zinc-800">
            <input
              type="checkbox"
              className="h-4 w-4 accent-zinc-900"
              checked={colorRequired}
              onChange={(e) => setColorRequired(e.target.checked)}
            />
            Color required
          </label>
          <label className="flex items-center gap-2 text-sm text-zinc-800">
            <input
              type="checkbox"
              className="h-4 w-4 accent-zinc-900"
              checked={doubleSidedRecommended}
              onChange={(e) => setDoubleSidedRecommended(e.target.checked)}
            />
            Double-sided recommended
          </label>
        </div>
      </div>

      {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}

      <div className="mt-3 flex items-center justify-end gap-3">
        <button type="button" onClick={onDelete} disabled={isPending} className="text-sm text-zinc-700 hover:text-zinc-950 disabled:opacity-60">
          Delete
        </button>
        <button
          type="button"
          onClick={onSave}
          disabled={isPending}
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800 focus:outline-none focus:ring-4 focus:ring-zinc-900/20 disabled:opacity-60"
        >
          Save
        </button>
      </div>
    </div>
  )
}

export function PrintableMaterialsManager(props: { resourceId: string; rows: Row[] }) {
  return (
    <div className="mt-4 grid gap-4">
      {props.rows.length ? (
        props.rows.map((r) => <PrintableRowEditor key={r.id} resourceId={props.resourceId} row={r} />)
      ) : (
        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-700">
          No printable materials yet.
        </div>
      )}
    </div>
  )
}

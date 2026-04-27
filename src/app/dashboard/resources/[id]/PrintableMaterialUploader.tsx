'use client'

import { useMemo, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { createPrintableMaterialAction } from '@/app/dashboard/resources/[id]/actions'

const allowedExtensions = ['pdf', 'docx', 'pptx']

function getExt(name: string) {
  const parts = name.split('.')
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : ''
}

export function PrintableMaterialUploader(props: { resourceId: string }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [pagesCount, setPagesCount] = useState<string>('')
  const [colorRequired, setColorRequired] = useState(false)
  const [doubleSidedRecommended, setDoubleSidedRecommended] = useState(false)
  const [paperSize, setPaperSize] = useState('A4')
  const [error, setError] = useState<string | null>(null)

  const ext = useMemo(() => (file ? getExt(file.name) : ''), [file])

  async function onUpload() {
    setError(null)

    if (!file) {
      setError('Select a file')
      return
    }

    if (!allowedExtensions.includes(ext)) {
      setError('Only PDF, DOCX, and PPTX are allowed')
      return
    }

    const cleanedTitle = title.trim()
    if (!cleanedTitle) {
      setError('Title is required')
      return
    }

    const supabase = createSupabaseBrowserClient()
    if (!supabase) {
      setError('Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.')
      return
    }

    const safeName = file.name.replaceAll('..', '.').replaceAll('\\', '_').replaceAll('/', '_')
    const filePath = `resources/${props.resourceId}/${Date.now()}-${safeName}`

    const { error: uploadError } = await supabase.storage
      .from('printable-materials')
      .upload(filePath, file, {
        upsert: false,
        contentType: file.type || undefined,
      })

    if (uploadError) {
      setError(uploadError.message)
      return
    }

    const parsedPagesCount = pagesCount.trim() ? Number(pagesCount) : null

    startTransition(() => {
      void createPrintableMaterialAction({
        resourceId: props.resourceId,
        title: cleanedTitle,
        description: description.trim() || null,
        filePath,
        fileType: file.type || ext || null,
        pagesCount: parsedPagesCount !== null && Number.isFinite(parsedPagesCount) ? parsedPagesCount : null,
        colorRequired,
        doubleSidedRecommended,
        paperSize,
      })
        .then(() => {
          setFile(null)
          setTitle('')
          setDescription('')
          setPagesCount('')
          setColorRequired(false)
          setDoubleSidedRecommended(false)
          setPaperSize('A4')
          router.refresh()
        })
        .catch((e: unknown) => {
          setError(e instanceof Error ? e.message : 'Upload failed')
        })
    })
  }

  return (
    <div className="grid gap-4">
      <div className="grid gap-1">
        <label className="text-sm font-medium">File (PDF/DOCX/PPTX)</label>
        <input
          type="file"
          accept=".pdf,.docx,.pptx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.presentationml.presentation"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-zinc-900 focus:ring-4 focus:ring-zinc-900/10"
        />
      </div>

      <div className="grid gap-1">
        <label className="text-sm font-medium">Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-zinc-900 focus:ring-4 focus:ring-zinc-900/10"
        />
      </div>

      <div className="grid gap-1">
        <label className="text-sm font-medium">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-zinc-900 focus:ring-4 focus:ring-zinc-900/10"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="grid gap-1">
          <label className="text-sm font-medium">Pages</label>
          <input
            value={pagesCount}
            onChange={(e) => setPagesCount(e.target.value)}
            inputMode="numeric"
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
          <label className="text-sm font-medium">Options</label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              className="h-4 w-4 accent-zinc-900"
              checked={colorRequired}
              onChange={(e) => setColorRequired(e.target.checked)}
            />
            Color required
          </label>
          <label className="flex items-center gap-2 text-sm">
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

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <div>
        <button
          type="button"
          onClick={() => void onUpload()}
          disabled={isPending}
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800 focus:outline-none focus:ring-4 focus:ring-zinc-900/20 disabled:opacity-60"
        >
          {isPending ? 'Saving…' : 'Upload'}
        </button>
      </div>
    </div>
  )
}

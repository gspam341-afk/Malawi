'use client'

import { useCallback, useRef, useState } from 'react'
import {
  Eye,
  Heading2,
  Heading3,
  Image as ImageIcon,
  List,
  ListOrdered,
  PenLine,
  Quote,
  SeparatorHorizontal,
  UploadCloud,
} from 'lucide-react'
import { BlogMarkdownRenderer } from '@/components/blog/BlogMarkdownRenderer'
import { dashFocusRing, dashTextarea } from '@/components/dashboard/classes'

function insertIntoTextarea(textarea: HTMLTextAreaElement, snippet: string) {
  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const value = textarea.value
  const next = value.slice(0, start) + snippet + value.slice(end)
  const caret = start + snippet.length
  return { next, caret }
}

type Tab = 'edit' | 'preview'

export function BlogMarkdownEditor({
  defaultValue = '',
  name = 'content',
  blogPostId,
  id = 'blog-content',
}: {
  defaultValue?: string
  name?: string
  /** When set, uploads go under `blog-posts/{id}/`; otherwise drafts path. */
  blogPostId?: string | null
  id?: string
}) {
  const [value, setValue] = useState(defaultValue)
  const [tab, setTab] = useState<Tab>('edit')
  const taRef = useRef<HTMLTextAreaElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploadBusy, setUploadBusy] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const applyInsert = useCallback((snippet: string) => {
    const ta = taRef.current
    if (!ta) {
      setValue((v) => v + snippet)
      return
    }
    const { next, caret } = insertIntoTextarea(ta, snippet)
    setValue(next)
    requestAnimationFrame(() => {
      ta.focus()
      ta.setSelectionRange(caret, caret)
    })
  }, [])

  const toolbarBtn =
    `inline-flex h-9 w-9 items-center justify-center rounded-jac-sm border border-jac-navy/12 bg-white text-jac-navy shadow-jac-soft transition hover:border-jac-purple/35 hover:bg-jac-purple/8 hover:text-jac-navy ${dashFocusRing}`

  const onUploadFile = async (file: File | null) => {
    if (!file || uploadBusy) return
    setUploadBusy(true)
    setUploadError(null)
    try {
      const fd = new FormData()
      fd.append('file', file)
      if (blogPostId) fd.append('blog_post_id', blogPostId)

      const res = await fetch('/api/blog-images/upload', { method: 'POST', body: fd })
      const json = (await res.json()) as { url?: string; error?: string }
      if (!res.ok) throw new Error(json.error ?? 'Upload failed')

      const alt = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ') || 'Image'
      applyInsert(`\n\n![${alt}](${json.url})\n\n`)
    } catch (e) {
      console.error(e)
      setUploadError(e instanceof Error ? e.message : 'Upload failed')
    } finally {
      setUploadBusy(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  return (
    <div className="grid gap-4">
      <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" onChange={(e) => onUploadFile(e.target.files?.[0] ?? null)} />

      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/80 p-2">
        <span className="px-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Insert</span>
        <button
          type="button"
          className={toolbarBtn}
          onClick={() => applyInsert('\n## ')}
          title="Heading 2"
          aria-label="Insert heading 2"
        >
          <Heading2 className="h-4 w-4" aria-hidden />
        </button>
        <button
          type="button"
          className={toolbarBtn}
          onClick={() => applyInsert('\n### ')}
          title="Heading 3"
          aria-label="Insert heading 3"
        >
          <Heading3 className="h-4 w-4" aria-hidden />
        </button>
        <button
          type="button"
          className={toolbarBtn}
          onClick={() => applyInsert('\n- ')}
          title="Bullet list"
          aria-label="Insert bullet list item"
        >
          <List className="h-4 w-4" aria-hidden />
        </button>
        <button
          type="button"
          className={toolbarBtn}
          onClick={() => applyInsert('\n1. ')}
          title="Numbered list"
          aria-label="Insert numbered list item"
        >
          <ListOrdered className="h-4 w-4" aria-hidden />
        </button>
        <button
          type="button"
          className={toolbarBtn}
          onClick={() => applyInsert('\n> ')}
          title="Quote"
          aria-label="Insert quote"
        >
          <Quote className="h-4 w-4" aria-hidden />
        </button>
        <button
          type="button"
          className={toolbarBtn}
          onClick={() => applyInsert('\n\n---\n\n')}
          title="Divider"
          aria-label="Insert horizontal divider"
        >
          <SeparatorHorizontal className="h-4 w-4" aria-hidden />
        </button>
        <button
          type="button"
          className={toolbarBtn}
          onClick={() => fileRef.current?.click()}
          disabled={uploadBusy}
          title="Upload image"
          aria-label="Upload image"
        >
          <UploadCloud className="h-4 w-4" aria-hidden />
        </button>
        <button
          type="button"
          className={toolbarBtn}
          onClick={() => {
            const url = typeof window !== 'undefined' ? window.prompt('Image URL (https://)', 'https://') : null
            if (url) applyInsert(`\n\n![Describe the image](${url})\n\n`)
          }}
          title="Insert image by URL"
          aria-label="Insert image by URL"
        >
          <ImageIcon className="h-4 w-4" aria-hidden />
        </button>

        <div className="ml-auto flex rounded-lg border border-slate-200 bg-white p-0.5 shadow-sm">
          <button
            type="button"
            onClick={() => setTab('edit')}
            className={`inline-flex items-center gap-1.5 rounded-jac-sm px-3 py-1.5 text-xs font-semibold ${tab === 'edit' ? 'bg-jac-purple text-white' : 'text-jac-navy/70 hover:bg-jac-offwhite'}`}
            aria-pressed={tab === 'edit'}
          >
            <PenLine className="h-3.5 w-3.5" aria-hidden />
            Edit
          </button>
          <button
            type="button"
            onClick={() => setTab('preview')}
            className={`inline-flex items-center gap-1.5 rounded-jac-sm px-3 py-1.5 text-xs font-semibold ${tab === 'preview' ? 'bg-jac-purple text-white' : 'text-jac-navy/70 hover:bg-jac-offwhite'}`}
            aria-pressed={tab === 'preview'}
          >
            <Eye className="h-3.5 w-3.5" aria-hidden />
            Preview
          </button>
        </div>
      </div>

      <p className="text-sm text-slate-600">
        Use headings, lists and images to make the post easier to read. Upload images or paste a public URL.
      </p>
      {uploadError ? (
        <p className="text-sm font-medium text-red-700" role="alert">
          {uploadError}
        </p>
      ) : null}

      <input type="hidden" name={name} value={value} readOnly />

      {tab === 'edit' ? (
        <textarea
          ref={taRef}
          id={id}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          rows={18}
          className={`${dashTextarea} min-h-[320px] font-[family-name:var(--font-geist-mono)] text-sm leading-relaxed md:min-h-[400px]`}
          placeholder="Start with an introduction… Use the toolbar for structure."
          spellCheck
        />
      ) : (
        <div
          className={`${dashTextarea} min-h-[320px] overflow-auto bg-white md:min-h-[400px]`}
          aria-label="Markdown preview"
        >
          <BlogMarkdownRenderer markdown={value} />
        </div>
      )}
    </div>
  )
}

'use client'

import type { ImgHTMLAttributes, ReactNode } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize'
import type { Components } from 'react-markdown'

const schema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    img: [...(defaultSchema.attributes?.img ?? []), 'src', 'alt', 'title', 'loading'],
  },
}

/** react-markdown passes non-DOM props (e.g. node); strip before spreading onto elements. */
function stripExtra<T extends Record<string, unknown>>(props: T) {
  const { node, ...rest } = props as T & { node?: unknown }
  void node
  return rest
}

const markdownComponents: Components = {
  h2: (props) => (
    <h2
      className="mt-10 scroll-mt-24 text-2xl font-bold tracking-tight text-jac-navy first:mt-0"
      {...stripExtra(props as Record<string, unknown>)}
    />
  ),
  h3: (props) => (
    <h3
      className="mt-8 scroll-mt-24 text-xl font-semibold tracking-tight text-jac-navy"
      {...stripExtra(props as Record<string, unknown>)}
    />
  ),
  p: (props) => <p className="leading-relaxed text-jac-navy/90" {...stripExtra(props as Record<string, unknown>)} />,
  ul: (props) => <ul className="my-4 list-disc space-y-2 pl-6 text-jac-navy/90" {...stripExtra(props as Record<string, unknown>)} />,
  ol: (props) => <ol className="my-4 list-decimal space-y-2 pl-6 text-jac-navy/90" {...stripExtra(props as Record<string, unknown>)} />,
  li: (props) => <li className="leading-relaxed marker:text-jac-purple" {...stripExtra(props as Record<string, unknown>)} />,
  blockquote: (props) => (
    <blockquote
      className="my-6 border-l-4 border-jac-purple/35 bg-jac-purple/8 py-2 pl-4 pr-2 text-jac-navy/90 italic"
      {...stripExtra(props as Record<string, unknown>)} />
  ),
  hr: (props) => <hr className="my-10 border-jac-navy/12" {...stripExtra(props as Record<string, unknown>)} />,
  a: (props) => (
    <a
      className="font-medium text-jac-purple underline-offset-4 hover:underline"
      target="_blank"
      rel="noreferrer"
      {...stripExtra(props as Record<string, unknown>)}
    />
  ),
  img: (props) => {
    const r = stripExtra(props as Record<string, unknown>) as ImgHTMLAttributes<HTMLImageElement>
    return (
      // eslint-disable-next-line @next/next/no-img-element -- user-controlled URLs from sanitized markdown
      <img
        {...r}
        alt={r.alt ?? ''}
        className="my-6 max-h-[min(480px,70vh)] w-full rounded-jac-md border border-jac-navy/10 bg-jac-offwhite object-contain shadow-jac-soft"
        loading="lazy"
      />
    )
  },
  table: (props) => (
    <div className="my-6 overflow-x-auto rounded-jac-md border border-jac-navy/12">
      <table className="w-full border-collapse text-left text-sm text-jac-navy/90" {...stripExtra(props as Record<string, unknown>)} />
    </div>
  ),
  th: (props) => <th className="border border-jac-navy/12 bg-jac-offwhite px-3 py-2 font-semibold" {...stripExtra(props as Record<string, unknown>)} />,
  td: (props) => <td className="border border-jac-navy/12 px-3 py-2" {...stripExtra(props as Record<string, unknown>)} />,
  pre: (props) => (
    <pre className="my-4 overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm text-slate-100" {...stripExtra(props as Record<string, unknown>)} />
  ),
  code: (props) => {
    const rest = stripExtra(props as Record<string, unknown>) as {
      className?: string
      children?: ReactNode
    }
    const isBlock = Boolean(rest.className?.includes('language-'))
    if (isBlock) {
      return (
        <code className={`font-mono text-sm ${rest.className ?? ''}`}>{rest.children}</code>
      )
    }
    return (
      <code className="rounded bg-jac-purple/10 px-1.5 py-0.5 font-mono text-[0.9em] text-jac-purple">{rest.children}</code>
    )
  },
}

export function BlogMarkdownRenderer({ markdown }: { markdown: string }) {
  if (!markdown?.trim()) {
    return <p className="text-jac-navy/55">No content yet.</p>
  }

  return (
    <div className="blog-markdown max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[[rehypeSanitize, schema]]}
        components={markdownComponents}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  )
}

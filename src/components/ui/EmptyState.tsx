import { type ReactNode } from 'react'

export function EmptyState({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children?: ReactNode
}) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 px-6 py-12 text-center">
      <p className="text-base font-medium text-slate-900">{title}</p>
      {description ? <p className="mx-auto mt-2 max-w-md text-sm text-slate-600">{description}</p> : null}
      {children ? <div className="mt-6 flex flex-wrap justify-center gap-3">{children}</div> : null}
    </div>
  )
}

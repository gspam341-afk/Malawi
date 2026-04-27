import { type ReactNode } from 'react'

export function Card({
  children,
  className = '',
  padding = 'p-6',
}: {
  children: ReactNode
  className?: string
  padding?: string
}) {
  return (
    <div
      className={`rounded-2xl border border-slate-200/90 bg-white shadow-sm ${padding} ${className}`}
    >
      {children}
    </div>
  )
}

export function CardHeader({
  title,
  description,
  action,
}: {
  title: string
  description?: string
  action?: ReactNode
}) {
  return (
    <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
      <div>
        <h3 className="text-lg font-semibold tracking-tight text-slate-900">{title}</h3>
        {description ? <p className="mt-1 text-sm text-slate-600">{description}</p> : null}
      </div>
      {action}
    </div>
  )
}

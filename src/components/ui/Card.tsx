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
      className={`rounded-jac-lg border border-jac-purple/10 bg-white shadow-jac-soft ${padding} ${className}`}
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
        <h3 className="text-h4 font-semibold text-jac-navy">{title}</h3>
        {description ? <p className="mt-1 text-body">{description}</p> : null}
      </div>
      {action}
    </div>
  )
}

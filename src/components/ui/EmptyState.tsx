import type { LucideIcon } from 'lucide-react'
import { type ReactNode } from 'react'

export function EmptyState({
  title,
  description,
  icon: Icon,
  children,
}: {
  title: string
  description?: string
  icon?: LucideIcon
  children?: ReactNode
}) {
  return (
    <div className="rounded-jac-md border-[length:var(--border-regular)] border-dashed border-jac-pink/40 bg-jac-pink/15 px-6 py-12 text-center md:rounded-jac-lg md:px-8 md:py-14">
      {Icon ? (
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-jac-lg bg-jac-purple/12 text-jac-purple shadow-jac-soft ring-1 ring-jac-purple/15">
          <Icon className="h-7 w-7" aria-hidden />
        </div>
      ) : null}
      <p className="text-base font-semibold text-jac-navy">{title}</p>
      {description ? <p className="mx-auto mt-2 max-w-md text-body">{description}</p> : null}
      {children ? <div className="mt-6 flex flex-wrap justify-center gap-3">{children}</div> : null}
    </div>
  )
}

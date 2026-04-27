import type { LucideIcon } from 'lucide-react'
import { type ReactNode } from 'react'
import { dashMuted, dashPanelSolid } from '@/components/dashboard/classes'

export function FormSection({
  title,
  description,
  children,
  id,
  icon: Icon,
}: {
  title: string
  description?: string
  children: ReactNode
  id?: string
  icon?: LucideIcon
}) {
  return (
    <section id={id} className={`${dashPanelSolid} overflow-hidden p-6 md:p-8`}>
      <div className="flex flex-wrap items-start gap-4">
        {Icon ? (
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-teal-100 text-teal-800 ring-1 ring-teal-600/15">
            <Icon className="h-5 w-5" aria-hidden />
          </span>
        ) : null}
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          {description ? <p className={`mt-1 ${dashMuted}`}>{description}</p> : null}
        </div>
      </div>
      <div className="mt-6">{children}</div>
    </section>
  )
}

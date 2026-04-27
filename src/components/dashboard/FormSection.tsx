import { type ReactNode } from 'react'
import { dashMuted, dashPanelSolid } from '@/components/dashboard/classes'

export function FormSection({
  title,
  description,
  children,
  id,
}: {
  title: string
  description?: string
  children: ReactNode
  id?: string
}) {
  return (
    <section id={id} className={`${dashPanelSolid} overflow-hidden p-6 md:p-8`}>
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      {description ? <p className={`mt-1 ${dashMuted}`}>{description}</p> : null}
      <div className="mt-6">{children}</div>
    </section>
  )
}

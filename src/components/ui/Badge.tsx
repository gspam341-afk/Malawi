import { type ReactNode } from 'react'

const variants = {
  default: 'bg-slate-100 text-slate-800 ring-slate-600/10',
  subject: 'bg-sky-50 text-sky-900 ring-sky-600/15',
  stem: 'bg-emerald-50 text-emerald-900 ring-emerald-600/15',
  neutral: 'bg-white text-slate-700 ring-slate-300',
  outline: 'bg-transparent text-slate-700 ring-slate-300',
} as const

export type BadgeVariant = keyof typeof variants

export function Badge({
  children,
  variant = 'default',
}: {
  children: ReactNode
  variant?: BadgeVariant
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${variants[variant]}`}
    >
      {children}
    </span>
  )
}

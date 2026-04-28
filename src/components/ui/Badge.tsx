import { type ReactNode } from 'react'

const variants = {
  default: 'bg-jac-navy/5 text-jac-navy ring-jac-navy/10',
  subject: 'bg-jac-blue/10 text-jac-blue ring-jac-blue/20',
  stem: 'bg-jac-green/12 text-jac-green ring-jac-green/25',
  neutral: 'bg-white text-jac-navy ring-jac-navy/12',
  outline: 'bg-transparent text-jac-navy ring-jac-navy/15',
  orange: 'bg-jac-orange/15 text-[#8a5200] ring-jac-orange/30',
  purple: 'bg-jac-purple/12 text-jac-purple ring-jac-purple/20',
  pink: 'bg-jac-pink/35 text-jac-navy ring-jac-pink/40',
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
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${variants[variant]}`}
    >
      {children}
    </span>
  )
}

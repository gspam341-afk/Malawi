import type { LucideIcon } from 'lucide-react'
import { type ButtonHTMLAttributes } from 'react'
import { dashFocusRing } from '@/components/dashboard/classes'

const base = `inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold shadow-jac-soft transition ${dashFocusRing} [&_svg]:pointer-events-none [&_svg]:shrink-0`

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon?: LucideIcon
}

export function ActionButton({ type = 'button', className = '', icon: Icon, children, ...props }: Props) {
  return (
    <button
      type={type}
      className={`${base} bg-jac-purple text-white hover:bg-[#6240b8] disabled:opacity-50 ${className}`}
      {...props}
    >
      {Icon ? <Icon className="h-4 w-4" aria-hidden /> : null}
      {children}
    </button>
  )
}

export function SecondaryButton({ type = 'button', className = '', icon: Icon, children, ...props }: Props) {
  return (
    <button
      type={type}
      className={`${base} border border-jac-navy/12 bg-jac-offwhite text-jac-navy hover:border-jac-purple/25 hover:bg-white disabled:opacity-50 ${className}`}
      {...props}
    >
      {Icon ? <Icon className="h-4 w-4" aria-hidden /> : null}
      {children}
    </button>
  )
}

export function DangerButton({ type = 'button', className = '', icon: Icon, children, ...props }: Props) {
  return (
    <button
      type={type}
      className={`${base} border border-red-200 bg-red-50 text-red-900 hover:bg-red-100 disabled:opacity-50 ${className}`}
      {...props}
    >
      {Icon ? <Icon className="h-4 w-4" aria-hidden /> : null}
      {children}
    </button>
  )
}

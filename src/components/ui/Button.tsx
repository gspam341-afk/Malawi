import Link from 'next/link'
import type { LucideIcon } from 'lucide-react'
import { type ButtonHTMLAttributes, type ReactNode } from 'react'

const base =
  'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0'

const variants = {
  primary: 'bg-emerald-700 text-white shadow-sm hover:bg-emerald-800',
  secondary:
    'border border-slate-300 bg-white text-slate-900 shadow-sm hover:border-slate-400 hover:bg-slate-50',
  ghost: 'text-slate-700 hover:bg-slate-100 hover:text-slate-950',
  accent: 'bg-sky-700 text-white shadow-sm hover:bg-sky-800',
} as const

export type ButtonVariant = keyof typeof variants

type ButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> & {
  variant?: ButtonVariant
  children: ReactNode
  className?: string
  icon?: LucideIcon
  iconRight?: LucideIcon
}

export function Button({
  variant = 'primary',
  type = 'button',
  className = '',
  children,
  icon: Icon,
  iconRight: IconRight,
  ...props
}: ButtonProps) {
  return (
    <button type={type} className={`${base} ${variants[variant]} ${className}`} {...props}>
      {Icon ? <Icon className="h-4 w-4" aria-hidden /> : null}
      {children}
      {IconRight ? <IconRight className="h-4 w-4" aria-hidden /> : null}
    </button>
  )
}

type ButtonLinkProps = {
  href: string
  variant?: ButtonVariant
  children: ReactNode
  className?: string
  icon?: LucideIcon
  iconRight?: LucideIcon
}

export function ButtonLink({
  href,
  variant = 'primary',
  children,
  className = '',
  icon: Icon,
  iconRight: IconRight,
}: ButtonLinkProps) {
  return (
    <Link href={href} className={`${base} ${variants[variant]} ${className}`}>
      {Icon ? <Icon className="h-4 w-4" aria-hidden /> : null}
      {children}
      {IconRight ? <IconRight className="h-4 w-4" aria-hidden /> : null}
    </Link>
  )
}

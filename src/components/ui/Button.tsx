import Link from 'next/link'
import type { LucideIcon } from 'lucide-react'
import { type ButtonHTMLAttributes, type ReactNode } from 'react'

const base =
  'inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold no-underline transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-jac-purple focus-visible:ring-offset-2 focus-visible:ring-offset-jac-offwhite disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0'

const variants = {
  primary:
    'border border-transparent bg-jac-purple text-white shadow-[0_6px_20px_-4px_rgba(115,72,206,0.45)] hover:bg-[#6240b8] hover:text-white active:bg-[#5635a8] hover:shadow-[0_8px_24px_-4px_rgba(115,72,206,0.55)] visited:text-white',
  secondary:
    'border border-transparent bg-jac-navy text-white shadow-[0_6px_20px_-4px_rgba(28,24,48,0.35)] hover:bg-[#2d2848] hover:text-white active:bg-[#252040] visited:text-white',
  outline:
    'border border-jac-navy/18 bg-white text-jac-navy shadow-jac-soft hover:border-jac-purple/35 hover:bg-jac-purple/8 hover:text-jac-navy',
  ghost:
    'border border-transparent text-jac-navy hover:bg-jac-purple/12 hover:text-jac-navy active:bg-jac-purple/18',
  accent:
    'border border-transparent bg-jac-blue text-white shadow-[0_6px_20px_-4px_rgba(46,122,168,0.4)] hover:bg-[#256891] hover:text-white active:bg-[#1f5f7d] visited:text-white',
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

import { type ButtonHTMLAttributes } from 'react'
import { dashFocusRing } from '@/components/dashboard/classes'

const base = `inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold shadow-sm transition ${dashFocusRing}`

export function ActionButton({
  type = 'button',
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type={type}
      className={`${base} bg-gradient-to-r from-teal-600 to-teal-700 text-white hover:from-teal-700 hover:to-teal-800 disabled:opacity-50 ${className}`}
      {...props}
    />
  )
}

export function SecondaryButton({
  type = 'button',
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type={type}
      className={`${base} border border-slate-200 bg-white text-slate-900 hover:border-teal-200 hover:bg-teal-50/50 disabled:opacity-50 ${className}`}
      {...props}
    />
  )
}

export function DangerButton({
  type = 'button',
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type={type}
      className={`${base} border border-red-200 bg-red-50 text-red-900 hover:bg-red-100 disabled:opacity-50 ${className}`}
      {...props}
    />
  )
}

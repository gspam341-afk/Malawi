'use client'

import type React from 'react'

export function ConfirmSubmitButton(props: {
  message: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <button
      type="submit"
      className={props.className}
      onClick={(e) => {
        const ok = window.confirm(props.message)
        if (!ok) {
          e.preventDefault()
          e.stopPropagation()
        }
      }}
    >
      {props.children}
    </button>
  )
}

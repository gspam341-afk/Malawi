'use client'

import { useTransition } from 'react'

export function DeleteResourceForm(props: { action: () => void }) {
  const [pending, startTransition] = useTransition()

  return (
    <form
      action={() => {
        const ok = window.confirm('Are you sure you want to delete this resource? This cannot be undone.')
        if (!ok) return

        startTransition(() => {
          props.action()
        })
      }}
    >
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg border border-red-300 bg-red-50 px-4 py-2 text-sm font-medium text-red-800 shadow-sm transition hover:bg-red-100 focus:outline-none focus:ring-4 focus:ring-red-500/20 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? 'Deleting…' : 'Delete resource'}
      </button>
    </form>
  )
}

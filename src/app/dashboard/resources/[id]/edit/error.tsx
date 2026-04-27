'use client'

import Link from 'next/link'

export default function EditResourceError(props: { error: Error; reset: () => void }) {
  return (
    <div className="rounded-2xl border bg-white p-6">
      <h1 className="text-xl font-semibold tracking-tight">Edit resource</h1>
      <p className="mt-2 text-sm text-red-600">{props.error.message || 'Something went wrong.'}</p>
      <div className="mt-4 flex items-center gap-3">
        <button
          type="button"
          onClick={() => props.reset()}
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
        >
          Try again
        </button>
        <Link href="/dashboard/resources" className="text-sm text-zinc-700 hover:text-zinc-950">
          Back to resources
        </Link>
      </div>
    </div>
  )
}

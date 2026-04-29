'use client'

import { useEffect, useState } from 'react'
import { Waves, X } from 'lucide-react'
import { BuoyancyLabGame } from '@/components/public/BuoyancyLabGame'

export function BuoyancyLabModal() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [open])

  return (
    <>
      <div className="w-full overflow-hidden rounded-jac-xl border border-jac-purple/18 bg-white shadow-[0_8px_24px_-14px_rgba(28,24,48,0.22)]">
        <button type="button" onClick={() => setOpen(true)} className="group block w-full text-left" aria-label="Open Float or Sink Lab modal">
          <div className="relative border-b border-jac-purple/12 bg-gradient-to-br from-cyan-100 via-sky-100 to-blue-100 p-6 md:p-8">
            <p className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700 ring-1 ring-blue-200">
              <Waves className="h-3.5 w-3.5" aria-hidden />
              Buoyancy lab
            </p>
            <h3 className="mt-4 text-2xl font-black text-slate-900 md:text-3xl">Float or Sink</h3>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-700 md:text-base">
              Adjust mass and volume, compare buoyancy vs weight, and hit mission goals in water and air.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 p-4 md:p-5">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1.5 text-xs font-semibold text-blue-700">
              5 missions
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-jac-purple/10 px-3 py-1.5 text-xs font-semibold text-jac-purple">
              Density + buoyancy
            </span>
            <span className="ml-auto rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition group-hover:bg-blue-500">
              Open game
            </span>
          </div>
        </button>
      </div>

      {open ? (
        <div className="fixed inset-0 z-[100] bg-slate-950/75 p-4 md:p-8" role="dialog" aria-modal="true">
          <div className="mx-auto flex w-full max-w-6xl justify-end">
            <button
              type="button"
              aria-label="Close game modal"
              onClick={() => setOpen(false)}
              className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-slate-900/80 text-white hover:bg-slate-800"
            >
              <X className="h-5 w-5" aria-hidden />
            </button>
          </div>
          <div className="mx-auto w-full max-w-6xl">
            <BuoyancyLabGame />
          </div>
        </div>
      ) : null}
    </>
  )
}

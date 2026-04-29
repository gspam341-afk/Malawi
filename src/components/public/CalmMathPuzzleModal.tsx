'use client'

import { useEffect, useState } from 'react'
import { Brain, Grid3X3, Sparkles, X } from 'lucide-react'
import { CalmMathPuzzleGame } from '@/components/public/CalmMathPuzzleGame'

export function CalmMathPuzzleModal() {
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
        <button type="button" onClick={() => setOpen(true)} className="group block w-full text-left" aria-label="Open Number Workshop game modal">
          <div className="relative border-b border-jac-purple/12 bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-900 p-6 md:p-8">
            <p className="inline-flex items-center gap-2 rounded-full bg-emerald-300/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-200">
              <Grid3X3 className="h-3.5 w-3.5" aria-hidden />
              Logic puzzle
            </p>
            <h3 className="mt-4 inline-flex items-center gap-2 text-2xl font-black text-emerald-300 md:text-3xl">
              <Brain className="h-7 w-7" aria-hidden />
              Number Workshop
            </h3>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-200/90 md:text-base">
              Calm strategy mode with operation cards. Reach target numbers in limited moves, no timer.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 p-4 md:p-5">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-semibold text-emerald-700">
              <Sparkles className="h-3.5 w-3.5" aria-hidden />
              No timer pressure
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-jac-purple/10 px-3 py-1.5 text-xs font-semibold text-jac-purple">
              Card strategy + hints
            </span>
            <span className="ml-auto rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition group-hover:bg-emerald-500">
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
            <CalmMathPuzzleGame />
          </div>
        </div>
      ) : null}
    </>
  )
}

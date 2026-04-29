'use client'

import { useEffect, useState } from 'react'
import { Gamepad2, Swords, Timer, Trophy, X } from 'lucide-react'
import { MathMonsterGame } from '@/components/public/MathMonsterGame'

export function MathQuickfireModal() {
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
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="group block w-full text-left"
          aria-label="Open Math Monster game modal"
        >
          <div className="relative border-b border-jac-purple/12 bg-gradient-to-br from-slate-950 via-violet-950 to-slate-900 p-6 md:p-8">
            <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-cyan-400/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-violet-500/20 blur-3xl" />
            <p className="relative inline-flex items-center gap-2 rounded-full bg-cyan-400/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-cyan-200">
              <Gamepad2 className="h-3.5 w-3.5" aria-hidden />
              Playable game
            </p>
            <h3 className="relative mt-4 inline-flex items-center gap-2 text-2xl font-black text-cyan-300 md:text-3xl">
              <Swords className="h-7 w-7" aria-hidden />
              Math Monster
            </h3>
            <p className="relative mt-3 max-w-xl text-sm leading-relaxed text-slate-200/90 md:text-base">
              Fast combat-style arithmetic where you defeat monsters with correct answers, streaks, and speed.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 p-4 md:p-5">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-jac-purple/10 px-3 py-1.5 text-xs font-semibold text-jac-purple">
              <Timer className="h-3.5 w-3.5" aria-hidden />
              45 seconds
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-jac-blue/12 px-3 py-1.5 text-xs font-semibold text-jac-blue">
              <Trophy className="h-3.5 w-3.5" aria-hidden />
              Score + streak bonus
            </span>
            <span className="ml-auto inline-flex items-center gap-2 rounded-full bg-jac-purple px-4 py-2 text-sm font-semibold text-white shadow-[0_2px_8px_rgba(28,24,48,0.14)] transition group-hover:bg-[#6941bf]">
              <Gamepad2 className="h-4 w-4" aria-hidden />
              Open game
            </span>
          </div>
        </button>
      </div>

      {open ? (
        <div className="fixed inset-0 z-[100] bg-slate-950/70 p-4 md:p-8" role="dialog" aria-modal="true">
          <div className="mx-auto flex w-full max-w-3xl justify-end">
            <button
              type="button"
              aria-label="Close game modal"
              onClick={() => setOpen(false)}
              className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-slate-900/80 text-white hover:bg-slate-800"
            >
              <X className="h-5 w-5" aria-hidden />
            </button>
          </div>
          <div className="mx-auto w-full max-w-4xl">
            <MathMonsterGame />
          </div>
        </div>
      ) : null}
    </>
  )
}

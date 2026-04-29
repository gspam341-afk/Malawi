'use client'

import { useMemo, useState } from 'react'

const ATOMS = {
  H: { name: 'Hydrogen', color: 'bg-[#dbeafe]' },
  O: { name: 'Oxygen', color: 'bg-[#fecaca]' },
  C: { name: 'Carbon', color: 'bg-[#d1d5db]' },
  N: { name: 'Nitrogen', color: 'bg-[#bfdbfe]' },
  Na: { name: 'Sodium', color: 'bg-[#ddd6fe]' },
  Cl: { name: 'Chlorine', color: 'bg-[#bbf7d0]' },
} as const

const LEVELS = [
  { title: 'Make Water', product: 'Water', formula: 'H2O', recipe: { H: 2, O: 1 }, atoms: ['H', 'O', 'C', 'N'], success: 'Water created 💧' },
  { title: 'Make Carbon Dioxide', product: 'Carbon Dioxide', formula: 'CO2', recipe: { C: 1, O: 2 }, atoms: ['C', 'O', 'H', 'N'], success: 'CO2 created 🫧' },
  { title: 'Make Oxygen', product: 'Oxygen', formula: 'O2', recipe: { O: 2 }, atoms: ['O', 'H', 'C', 'N'], success: 'O2 created 🐟' },
  { title: 'Make Salt', product: 'Salt', formula: 'NaCl', recipe: { Na: 1, Cl: 1 }, atoms: ['Na', 'Cl', 'H', 'O'], success: 'NaCl created 🍟' },
  { title: 'Make Methane', product: 'Methane', formula: 'CH4', recipe: { C: 1, H: 4 }, atoms: ['C', 'H', 'O', 'N'], success: 'CH4 created 🚀' },
] as const

type AtomSymbol = keyof typeof ATOMS
type AtomItem = { id: string; symbol: AtomSymbol; left: number; top: number; duration: number; delay: number }
type GameState = 'start' | 'playing' | 'won' | 'finished'

function shuffle<T>(array: T[]) {
  const copy = [...array]
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

function buildAtomField(level: (typeof LEVELS)[number]): AtomItem[] {
  const guaranteed: AtomSymbol[] = []
  Object.entries(level.recipe).forEach(([symbol, count]) => {
    for (let i = 0; i < count + 1; i += 1) guaranteed.push(symbol as AtomSymbol)
  })
  while (guaranteed.length < 14) {
    const symbol = level.atoms[Math.floor(Math.random() * level.atoms.length)] as AtomSymbol
    guaranteed.push(symbol)
  }
  return shuffle(guaranteed).map((symbol, index) => ({
    id: `${symbol}-${index}-${Math.random().toString(36).slice(2, 8)}`,
    symbol,
    left: 8 + Math.random() * 76,
    top: 12 + Math.random() * 62,
    duration: 2.2 + Math.random() * 1.8,
    delay: Math.random() * 0.8,
  }))
}

function isComplete(counts: Record<string, number>, recipe: Record<string, number>) {
  const keys = new Set([...Object.keys(counts), ...Object.keys(recipe)])
  for (const key of keys) if ((counts[key] ?? 0) !== (recipe[key] ?? 0)) return false
  return true
}

function totalAtoms(counts: Record<string, number>) {
  return Object.values(counts).reduce((sum, value) => sum + value, 0)
}

function calculateRoundScore(misses: number) {
  return Math.max(60, 120 - misses * 10)
}

export function MoleculeCatcherGame() {
  const [gameState, setGameState] = useState<GameState>('start')
  const [levelIndex, setLevelIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [misses, setMisses] = useState(0)
  const [counts, setCounts] = useState<Record<string, number>>({})
  const [atoms, setAtoms] = useState<AtomItem[]>([])
  const [message, setMessage] = useState('Catch the correct atoms.')
  const [popMessage, setPopMessage] = useState('')

  const level = LEVELS[levelIndex]
  const progress = `${levelIndex + 1}/${LEVELS.length}`
  const totalCollected = useMemo(() => totalAtoms(counts), [counts])

  function loadLevel(index: number, text?: string) {
    const nextLevel = LEVELS[index]
    setCounts({})
    setMisses(0)
    setAtoms(buildAtomField(nextLevel))
    setMessage(text ?? `Catch atoms for ${nextLevel.formula}`)
    setPopMessage('')
  }

  function startGame() {
    setScore(0)
    setLevelIndex(0)
    setGameState('playing')
    loadLevel(0, 'Catch the correct atoms.')
  }

  function reshuffleAtoms() {
    if (gameState !== 'playing') return
    setAtoms(buildAtomField(level))
    setMessage('New atom field ready.')
  }

  function resetRound() {
    if (gameState === 'finished') return
    setGameState('playing')
    loadLevel(levelIndex, 'Try again.')
  }

  function handleCatch(atom: AtomItem) {
    if (gameState !== 'playing') return
    const needed = (level.recipe as Partial<Record<AtomSymbol, number>>)[atom.symbol] ?? 0
    const current = counts[atom.symbol] ?? 0
    const isUseful = current < needed
    setAtoms((prev) => prev.filter((item) => item.id !== atom.id))

    if (!isUseful) {
      setMisses((prev) => prev + 1)
      setScore((prev) => Math.max(0, prev - 5))
      setPopMessage(`Wrong: ${atom.symbol}`)
      setMessage('You no longer need that atom.')
      return
    }

    const nextCounts = { ...counts, [atom.symbol]: current + 1 }
    setCounts(nextCounts)
    setPopMessage(`+ ${atom.symbol}`)
    setMessage(`${atom.symbol} captured`)

    if (isComplete(nextCounts, level.recipe)) {
      const gained = calculateRoundScore(misses)
      setScore((prev) => prev + gained)
      setGameState('won')
      setMessage(`${level.success} +${gained} points`)
    }
  }

  function nextLevel() {
    const nextIndex = levelIndex + 1
    if (nextIndex >= LEVELS.length) {
      setGameState('finished')
      return
    }
    setLevelIndex(nextIndex)
    setGameState('playing')
    loadLevel(nextIndex, `Catch atoms for ${LEVELS[nextIndex].formula}`)
  }

  return (
    <main className="min-h-[620px] rounded-jac-xl border-4 border-[#1c1c1c] bg-[#fffaf0] p-4 text-[#1c1c1c] md:p-6">
      <div className="mx-auto w-full max-w-5xl">
        <header className="mb-5 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="inline-block rounded-full border-2 border-[#1c1c1c] bg-[#ffdd57] px-3 py-1 text-xs font-black uppercase tracking-[0.16em]">Easy chemistry</p>
            <h1 className="mt-3 text-4xl font-black leading-none md:text-6xl">Molecule Catcher</h1>
            <p className="mt-3 text-base md:text-lg">Catch the right atoms and build molecules.</p>
          </div>
          <div className="grid min-w-full grid-cols-3 gap-2 md:min-w-[330px]">
            <Stat label="Score" value={score} />
            <Stat label="Level" value={progress} />
            <Stat label="Misses" value={misses} />
          </div>
        </header>

        {gameState === 'start' ? (
          <section className="grid items-center gap-5 rounded-[2rem] border-4 border-[#1c1c1c] bg-[#c4b5fd] p-6 md:grid-cols-[1fr_180px]">
            <div>
              <h2 className="mb-3 text-3xl font-black md:text-4xl">Catch atoms. Build molecules.</h2>
              <p className="mb-5 text-lg">Click the right atoms to match the formula.</p>
              <button onClick={startGame} className="rounded-2xl border-2 border-[#1c1c1c] bg-[#1c1c1c] px-8 py-4 text-lg font-black text-white">Start</button>
            </div>
            <div className="text-center text-[8rem]">⚗️</div>
          </section>
        ) : null}

        {gameState === 'playing' || gameState === 'won' ? (
          <section className="grid gap-5">
            <div className="rounded-[2rem] border-4 border-[#1c1c1c] bg-white p-5">
              <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="inline-block rounded-full border-2 border-[#1c1c1c] bg-[#93c5fd] px-3 py-1 text-xs font-black uppercase tracking-wide">{level.title}</p>
                  <h2 className="mt-2 text-3xl font-black md:text-5xl">{level.formula}</h2>
                </div>
                <div className="rounded-2xl border-4 border-[#1c1c1c] bg-[#ffdd57] px-5 py-3 text-center">
                  <p className="text-xs font-black uppercase tracking-wide">Catch these</p>
                  <div className="mt-2 flex flex-wrap justify-center gap-2">
                    {Object.entries(level.recipe).map(([symbol, needed]) => (
                      <RecipeBadge key={symbol} symbol={symbol} needed={needed} current={counts[symbol] ?? 0} />
                    ))}
                  </div>
                </div>
              </div>

              <AtomPlayfield atoms={atoms} onCatch={handleCatch} popMessage={popMessage} gameState={gameState} />
              <p className="mt-4 min-h-7 rounded-2xl border-4 border-[#1c1c1c] bg-[#fde68a] p-3 text-center text-lg font-black">{message}</p>

              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <BigStat label="Target" value={level.formula} />
                <BigStat label="Product" value={level.product} />
                <BigStat label="Collected" value={totalCollected} />
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              {gameState === 'playing' ? (
                <>
                  <button onClick={reshuffleAtoms} className="rounded-2xl border-4 border-[#1c1c1c] bg-[#2563eb] px-6 py-4 text-lg font-black text-white">
                    NEW ATOMS
                  </button>
                  <button onClick={resetRound} className="rounded-2xl border-4 border-[#1c1c1c] bg-white px-6 py-4 text-lg font-black">
                    RESET
                  </button>
                </>
              ) : null}

              {gameState === 'won' ? (
                <button onClick={nextLevel} className="rounded-2xl border-4 border-[#1c1c1c] bg-[#16a34a] px-6 py-4 text-lg font-black text-white">
                  NEXT
                </button>
              ) : null}
            </div>
          </section>
        ) : null}

        {gameState === 'finished' ? (
          <section className="rounded-[2rem] border-4 border-[#1c1c1c] bg-[#a7f3d0] p-8 text-center md:p-12">
            <div className="mb-4 text-8xl">🏆</div>
            <p className="text-sm font-black uppercase tracking-[0.2em]">Complete</p>
            <h2 className="my-3 text-7xl font-black">{score}</h2>
            <p className="mx-auto mb-7 max-w-2xl text-lg font-bold">You built the molecules.</p>
            <button onClick={startGame} className="rounded-2xl border-2 border-[#1c1c1c] bg-[#1c1c1c] px-8 py-4 text-lg font-black text-white">
              Play again
            </button>
          </section>
        ) : null}
      </div>
    </main>
  )
}

function AtomPlayfield({
  atoms,
  onCatch,
  popMessage,
  gameState,
}: {
  atoms: AtomItem[]
  onCatch: (atom: AtomItem) => void
  popMessage: string
  gameState: GameState
}) {
  return (
    <div className="relative h-[380px] overflow-hidden rounded-[2rem] border-4 border-[#1c1c1c] bg-[#e0f2fe]">
      <div className="absolute inset-x-0 bottom-0 h-[42%] border-t-4 border-[#1c1c1c] bg-[#bfdbfe]" />
      {atoms.map((atom) => (
        <button
          key={atom.id}
          type="button"
          onClick={() => onCatch(atom)}
          disabled={gameState !== 'playing'}
          style={{ left: `${atom.left}%`, top: `${atom.top}%` }}
          className={`absolute h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-[#1c1c1c] text-xl font-black shadow-[3px_3px_0_#1c1c1c] transition hover:scale-105 ${ATOMS[atom.symbol].color}`}
        >
          {atom.symbol}
        </button>
      ))}
      {popMessage ? (
        <div className="absolute left-1/2 top-5 -translate-x-1/2 rounded-2xl border-4 border-[#1c1c1c] bg-[#ffdd57] px-4 py-2 font-black shadow-[3px_3px_0_#1c1c1c]">
          {popMessage}
        </div>
      ) : null}
    </div>
  )
}

function RecipeBadge({
  symbol,
  needed,
  current,
}: {
  symbol: string
  needed: number
  current: number
}) {
  const done = current >= needed
  return (
    <div className={`rounded-2xl border-4 border-[#1c1c1c] px-4 py-2 font-black shadow-[3px_3px_0_#1c1c1c] ${done ? 'bg-[#86efac]' : 'bg-white'}`}>
      {symbol} {current}/{needed}
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border-4 border-[#1c1c1c] bg-white px-3 py-3 text-center shadow-[3px_3px_0_#1c1c1c]">
      <p className="text-[0.68rem] font-black uppercase tracking-wide md:text-xs">{label}</p>
      <p className="truncate text-lg font-black md:text-2xl">{value}</p>
    </div>
  )
}

function BigStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border-4 border-[#1c1c1c] bg-[#f8fafc] p-4 text-center shadow-[3px_3px_0_#1c1c1c]">
      <p className="text-xs font-black uppercase tracking-[0.2em]">{label}</p>
      <p className="text-xl font-black md:text-2xl">{value}</p>
    </div>
  )
}

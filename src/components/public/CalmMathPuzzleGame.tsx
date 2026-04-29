'use client'

import { useMemo, useState } from 'react'

const OPS = ['+', '-', 'x', '/'] as const
const PUZZLE_NAMES = [
  'The Broken Machine',
  'Crystal Lock',
  'Space Station Code',
  'Professor Number Box',
  'The Magic Bridge',
]

type Op = (typeof OPS)[number]
type GameState = 'start' | 'playing' | 'won' | 'lost'

type Card = {
  id: string
  op: Op
  amount: number
  label: string
}

type Puzzle = {
  id: string
  name: string
  level: number
  start: number
  target: number
  solution: Card[]
  maxMoves: number
  cards: Card[]
}

type HistoryEntry = {
  currentValue: number
  availableCards: Card[]
  usedCards: Card[]
  message: string
}

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function shuffle<T>(items: T[]): T[] {
  return [...items].sort(() => Math.random() - 0.5)
}

function applyOperation(value: number, card: Pick<Card, 'op' | 'amount'>) {
  if (card.op === '+') return value + card.amount
  if (card.op === '-') return value - card.amount
  if (card.op === 'x') return value * card.amount
  if (card.op === '/') return value / card.amount
  return value
}

function isValidResult(result: number) {
  return Number.isInteger(result) && result >= 0 && result <= 120
}

function makeCard(op: Op, amount: number, idPrefix: string): Card {
  return {
    id: `${idPrefix}-${op}-${amount}-${Math.random().toString(16).slice(2)}`,
    op,
    amount,
    label: `${op}${amount}`,
  }
}

function getCandidateCards(value: number, level: number) {
  const candidates: Card[] = []
  const addMax = Math.min(18, 5 + level * 2)
  const subtractMax = Math.min(14, 4 + level * 2)

  for (let amount = 1; amount <= addMax; amount += 1) {
    const card = makeCard('+', amount, 'solution')
    if (isValidResult(applyOperation(value, card))) candidates.push(card)
  }
  for (let amount = 1; amount <= subtractMax; amount += 1) {
    const card = makeCard('-', amount, 'solution')
    if (isValidResult(applyOperation(value, card))) candidates.push(card)
  }
  ;[2, 3, 4].forEach((amount) => {
    const card = makeCard('x', amount, 'solution')
    if (isValidResult(applyOperation(value, card))) candidates.push(card)
  })
  ;[2, 3, 4, 5].forEach((amount) => {
    const card = makeCard('/', amount, 'solution')
    if (value % amount === 0 && isValidResult(applyOperation(value, card))) candidates.push(card)
  })

  return candidates
}

function buildSolution(start: number, level: number, length: number) {
  let value = start
  const solution: Card[] = []
  const seenValues = new Set([start])

  for (let step = 0; step < length; step += 1) {
    const candidates = shuffle(getCandidateCards(value, level)).filter((card) => {
      const nextValue = applyOperation(value, card)
      return !seenValues.has(nextValue) || step === length - 1
    })
    const fallback = getCandidateCards(value, level)[0]
    const card = candidates[0] ?? fallback
    if (!card) break
    value = applyOperation(value, card)
    seenValues.add(value)
    solution.push(card)
  }
  return { target: value, solution }
}

function createDecoyCards(count: number, level: number) {
  const decoys: Card[] = []
  while (decoys.length < count) {
    const op = OPS[randomInt(0, OPS.length - 1)]
    const amount = op === 'x' || op === '/' ? randomInt(2, 5) : randomInt(1, Math.min(18, 5 + level * 2))
    decoys.push(makeCard(op, amount, 'decoy'))
  }
  return decoys
}

function createPuzzle(level: number): Puzzle {
  const start = randomInt(3, 12 + level)
  const solutionLength = Math.min(5, 3 + Math.floor(level / 2))
  const { target, solution } = buildSolution(start, level, solutionLength)
  const decoys = createDecoyCards(3 + Math.min(2, level), level)
  return {
    id: `puzzle-${level}-${Math.random().toString(16).slice(2)}`,
    name: PUZZLE_NAMES[(level - 1) % PUZZLE_NAMES.length],
    level,
    start,
    target,
    solution,
    maxMoves: solution.length,
    cards: shuffle([...solution, ...decoys]),
  }
}

function calculateWinScore(level: number, movesLeft: number) {
  return 80 + level * 20 + movesLeft * 15
}

export function CalmMathPuzzleGame() {
  const [gameState, setGameState] = useState<GameState>('start')
  const [score, setScore] = useState(0)
  const [level, setLevel] = useState(1)
  const [puzzle, setPuzzle] = useState<Puzzle>(() => createPuzzle(1))
  const [currentValue, setCurrentValue] = useState(puzzle.start)
  const [availableCards, setAvailableCards] = useState<Card[]>(puzzle.cards)
  const [usedCards, setUsedCards] = useState<Card[]>([])
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [message, setMessage] = useState('Take your time. No timer. No stress.')
  const [showHint, setShowHint] = useState(false)

  const movesLeft = useMemo(() => puzzle.maxMoves - usedCards.length, [puzzle.maxMoves, usedCards.length])
  const progress = useMemo(() => `${usedCards.length}/${puzzle.maxMoves}`, [usedCards.length, puzzle.maxMoves])
  const hintCard = useMemo(
    () => puzzle.solution.find((s) => availableCards.some((card) => card.id === s.id)),
    [availableCards, puzzle.solution],
  )

  function loadPuzzle(nextLevel: number) {
    const nextPuzzle = createPuzzle(nextLevel)
    setPuzzle(nextPuzzle)
    setCurrentValue(nextPuzzle.start)
    setAvailableCards(nextPuzzle.cards)
    setUsedCards([])
    setHistory([])
    setShowHint(false)
    setMessage('Build a path from start number to target.')
  }

  function startGame() {
    setScore(0)
    setLevel(1)
    loadPuzzle(1)
    setGameState('playing')
  }

  function playCard(card: Card) {
    if (gameState !== 'playing') return
    const nextValue = applyOperation(currentValue, card)
    if (!isValidResult(nextValue)) {
      setMessage(`${card.label} is not valid here. Result must be a whole number between 0 and 120.`)
      return
    }

    const nextAvailableCards = availableCards.filter((c) => c.id !== card.id)
    const nextUsedCards = [...usedCards, card]
    const nextMovesLeft = puzzle.maxMoves - nextUsedCards.length

    setHistory((prev) => [...prev, { currentValue, availableCards, usedCards, message }])
    setCurrentValue(nextValue)
    setAvailableCards(nextAvailableCards)
    setUsedCards(nextUsedCards)
    setShowHint(false)

    if (nextValue === puzzle.target) {
      const gainedScore = calculateWinScore(level, nextMovesLeft)
      setScore((prev) => prev + gainedScore)
      setMessage(`Solved! You hit ${puzzle.target} and gained ${gainedScore} points.`)
      setGameState('won')
      return
    }
    if (nextMovesLeft <= 0) {
      setMessage(`Close. You ended on ${nextValue}, but target was ${puzzle.target}.`)
      setGameState('lost')
      return
    }
    setMessage(`${currentValue} ${card.label} = ${nextValue}. What is your next move?`)
  }

  function undoMove() {
    if (history.length === 0 || gameState !== 'playing') return
    const previous = history[history.length - 1]
    setCurrentValue(previous.currentValue)
    setAvailableCards(previous.availableCards)
    setUsedCards(previous.usedCards)
    setMessage('Move undone. Try a different route.')
    setHistory((prev) => prev.slice(0, -1))
    setShowHint(false)
  }

  function nextLevel() {
    const newLevel = level + 1
    setLevel(newLevel)
    loadPuzzle(newLevel)
    setGameState('playing')
  }

  function retryPuzzle() {
    setCurrentValue(puzzle.start)
    setAvailableCards(puzzle.cards)
    setUsedCards([])
    setHistory([])
    setShowHint(false)
    setMessage('Same puzzle. New strategy.')
    setGameState('playing')
  }

  function newPuzzleSameLevel() {
    loadPuzzle(level)
    setGameState('playing')
  }

  return (
    <main className="min-h-[620px] rounded-jac-xl bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-900 p-4 text-white md:p-6">
      <div className="mx-auto w-full max-w-5xl">
        <header className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-emerald-200">calm math puzzle</p>
            <h1 className="text-4xl font-black md:text-5xl">Number Workshop</h1>
            <p className="mt-2 max-w-xl text-sm text-slate-300">
              A no-timer strategy game: use operation cards to reach the target number in limited moves.
            </p>
          </div>
          <div className="grid min-w-full grid-cols-3 gap-2 md:min-w-[320px]">
            <SmallStat label="Score" value={score} />
            <SmallStat label="Level" value={level} />
            <SmallStat label="Moves" value={progress} />
          </div>
        </header>

        {gameState === 'start' ? (
          <section className="grid gap-5 rounded-jac-lg border border-white/10 bg-black/25 p-6 md:grid-cols-[1fr_180px] md:items-center">
            <div>
              <h2 className="mb-2 text-2xl font-black">Think first, then play</h2>
              <p className="mb-4 text-slate-300">
                Choose cards like +7, x2, or /3. Each card transforms your value. Reach the target in the allowed number of moves.
              </p>
              <button onClick={startGame} className="rounded-jac-md bg-emerald-500 px-6 py-3 font-bold text-emerald-950 hover:bg-emerald-400">
                Start puzzle
              </button>
            </div>
            <div className="text-center text-8xl">🧩</div>
          </section>
        ) : null}

        {gameState === 'playing' || gameState === 'won' || gameState === 'lost' ? (
          <section className="grid gap-5 lg:grid-cols-[1fr_280px]">
            <div className="rounded-jac-lg border border-white/10 bg-black/25 p-5">
              <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-200">{puzzle.name}</p>
                  <h2 className="text-2xl font-black">Build the path</h2>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={undoMove}
                    disabled={history.length === 0 || gameState !== 'playing'}
                    className="rounded-jac-md bg-white/15 px-4 py-2 text-sm font-semibold disabled:opacity-50"
                  >
                    Undo
                  </button>
                  <button
                    onClick={() => setShowHint((v) => !v)}
                    disabled={gameState !== 'playing'}
                    className="rounded-jac-md bg-white/15 px-4 py-2 text-sm font-semibold disabled:opacity-50"
                  >
                    Hint
                  </button>
                </div>
              </div>

              <div className="mb-5 grid grid-cols-3 gap-3">
                <BigStat label="Start" value={puzzle.start} />
                <BigStat label="Now" value={currentValue} highlight />
                <BigStat label="Target" value={puzzle.target} />
              </div>

              <div className="mb-5 min-h-[88px] rounded-jac-md border border-white/10 bg-slate-950/70 p-4">
                <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">Your formula</p>
                <div className="flex flex-wrap items-center gap-2 text-xl font-black">
                  <span className="rounded-jac-md bg-white/10 px-3 py-2">{puzzle.start}</span>
                  {usedCards.map((card) => (
                    <span key={card.id} className="rounded-jac-md bg-emerald-400 px-3 py-2 text-emerald-950">
                      {card.label}
                    </span>
                  ))}
                  {usedCards.length === 0 ? <span className="text-base font-medium text-slate-500">Pick your first card...</span> : null}
                </div>
              </div>

              <p className="mb-4 min-h-6 font-bold text-emerald-200">{message}</p>

              {showHint ? (
                <div className="mb-4 rounded-jac-md bg-yellow-300 p-3 font-bold text-yellow-950">
                  {hintCard
                    ? `Hint: one valid route uses card ${hintCard.label}.`
                    : 'Hint: you may have moved away from the built-in route. Try Undo.'}
                </div>
              ) : null}

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                {availableCards.map((card) => {
                  const preview = applyOperation(currentValue, card)
                  const valid = isValidResult(preview)
                  return (
                    <button
                      key={card.id}
                      onClick={() => playCard(card)}
                      disabled={gameState !== 'playing'}
                      className={`rounded-jac-md border p-3 text-left shadow ${
                        valid ? 'border-white bg-white text-slate-950 hover:bg-emerald-100' : 'cursor-not-allowed border-white/10 bg-white/10 text-slate-500'
                      } ${gameState !== 'playing' ? 'opacity-60' : ''}`}
                    >
                      <div className="text-2xl font-black">{card.label}</div>
                      <div className="mt-1 text-xs font-bold opacity-70">{valid ? `${currentValue} -> ${preview}` : 'not valid'}</div>
                    </button>
                  )
                })}
              </div>
            </div>

            <aside className="flex flex-col gap-4 rounded-jac-lg border border-white/10 bg-black/25 p-4">
              <div>
                <h3 className="mb-2 text-xl font-black">How to play</h3>
                <ol className="list-inside list-decimal space-y-2 text-sm text-slate-300">
                  <li>Start from the current number.</li>
                  <li>Pick one operation card.</li>
                  <li>Reach the target before moves run out.</li>
                  <li>Use Undo if strategy goes wrong.</li>
                </ol>
              </div>
              <div className="rounded-jac-md border border-white/10 bg-white/10 p-3">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Moves left</p>
                <p className="text-4xl font-black">{movesLeft}</p>
              </div>

              {gameState === 'won' ? (
                <div className="rounded-jac-md bg-emerald-400 p-4 text-emerald-950">
                  <h4 className="text-xl font-black">Puzzle solved!</h4>
                  <p className="mb-3 font-semibold">Ready for the next level?</p>
                  <button onClick={nextLevel} className="w-full rounded-jac-md bg-emerald-950 px-4 py-2 font-bold text-emerald-200">
                    Next level
                  </button>
                </div>
              ) : null}

              {gameState === 'lost' ? (
                <div className="rounded-jac-md bg-rose-400 p-4 text-rose-950">
                  <h4 className="text-xl font-black">Not quite</h4>
                  <p className="mb-3 font-semibold">Retry this puzzle or generate a new one.</p>
                  <div className="grid gap-2">
                    <button onClick={retryPuzzle} className="rounded-jac-md bg-rose-950 px-4 py-2 font-bold text-rose-200">
                      Retry
                    </button>
                    <button onClick={newPuzzleSameLevel} className="rounded-jac-md bg-white px-4 py-2 font-bold text-rose-950">
                      New puzzle
                    </button>
                  </div>
                </div>
              ) : null}
            </aside>
          </section>
        ) : null}
      </div>
    </main>
  )
}

function SmallStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-jac-md border border-white/10 bg-white/10 px-3 py-2 text-center">
      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-300">{label}</p>
      <p className="text-xl font-black">{value}</p>
    </div>
  )
}

function BigStat({ label, value, highlight = false }: { label: string; value: string | number; highlight?: boolean }) {
  return (
    <div className={`rounded-jac-md border p-3 text-center ${highlight ? 'border-emerald-200 bg-emerald-400 text-emerald-950' : 'border-white/10 bg-white/10'}`}>
      <p className={`text-[10px] font-bold uppercase tracking-[0.2em] ${highlight ? 'text-emerald-950/70' : 'text-slate-300'}`}>{label}</p>
      <p className="text-4xl font-black">{value}</p>
    </div>
  )
}

'use client'

import { useMemo, useState } from 'react'

type CaseData = {
  id: string
  topic: string
  title: string
  mission: string
  question: string
  answer: string
  options: string[]
  xRange: [number, number]
  yRange: [number, number]
  fn: (x: number) => number
  clues: string[]
  explanation: string
  points: { x: number; y: number }[]
}

const CASES: CaseData[] = [
  {
    id: 'linear-laser',
    topic: 'Linear Function',
    title: 'Skewed Laser',
    mission: 'Find the model from slope and y-intercept.',
    question: 'Which function matches the graph?',
    answer: 'f(x) = 2x - 1',
    options: ['f(x) = 2x - 1', 'f(x) = -2x - 1', 'f(x) = x + 2', 'f(x) = 2x + 1'],
    xRange: [-5, 5],
    yRange: [-8, 8],
    fn: (x) => 2 * x - 1,
    clues: [
      'The graph crosses the y-axis at -1.',
      'When x increases by 1, y increases by 2.',
      'The graph passes through (2, 3).',
    ],
    explanation: 'Linear form is f(x)=ax+b. Here slope a=2 and intercept b=-1.',
    points: [{ x: 0, y: -1 }, { x: 2, y: 3 }],
  },
  {
    id: 'quadratic-crystal',
    topic: 'Quadratic Function',
    title: 'Crystal Parabola',
    mission: 'Use vertex, direction, and a known point.',
    question: 'Which equation describes the parabola?',
    answer: 'f(x) = 0.5(x - 1)^2 - 3',
    options: [
      'f(x) = 0.5(x - 1)^2 - 3',
      'f(x) = -0.5(x - 1)^2 - 3',
      'f(x) = 0.5(x + 1)^2 - 3',
      'f(x) = (x - 1)^2 + 3',
    ],
    xRange: [-5, 7],
    yRange: [-5, 12],
    fn: (x) => 0.5 * (x - 1) ** 2 - 3,
    clues: [
      'Vertex is at (1, -3).',
      'Parabola opens upward, so coefficient is positive.',
      'At x=3, function value is -1.',
    ],
    explanation: 'Vertex form is f(x)=a(x-r)^2+s. Vertex (1,-3), wider than x^2, gives a=0.5.',
    points: [{ x: 1, y: -3 }, { x: 3, y: -1 }],
  },
  {
    id: 'exponential-signal',
    topic: 'Exponential Function',
    title: 'Signal Transmitter',
    mission: 'Model percentage-based growth.',
    question: 'Which exponential model fits best?',
    answer: 'f(x) = 3 * 1.4^x',
    options: ['f(x) = 3 * 1.4^x', 'f(x) = 1.4 * 3^x', 'f(x) = 3x + 1.4', 'f(x) = 3 * 0.4^x'],
    xRange: [-3, 5],
    yRange: [0, 18],
    fn: (x) => 3 * 1.4 ** x,
    clues: [
      'The graph crosses the y-axis at 3.',
      'For each +1 in x, value is multiplied by 1.4.',
      'That is 40% growth per step.',
    ],
    explanation: 'Exponential form is f(x)=b*a^x. Here b=3 and a=1.4.',
    points: [{ x: 0, y: 3 }, { x: 2, y: 5.88 }],
  },
  {
    id: 'roots-bridge',
    topic: 'Roots and Factoring',
    title: 'Bridge Roots',
    mission: 'Use zeros and direction to pick factor form.',
    question: 'Which factored equation matches the graph?',
    answer: 'f(x) = -(x + 2)(x - 3)',
    options: ['f(x) = -(x + 2)(x - 3)', 'f(x) = (x + 2)(x - 3)', 'f(x) = -(x - 2)(x + 3)', 'f(x) = -x^2 - 6'],
    xRange: [-5, 6],
    yRange: [-10, 10],
    fn: (x) => -(x + 2) * (x - 3),
    clues: [
      'Roots are x=-2 and x=3.',
      'Parabola opens downward, so a leading minus is needed.',
      'At x=0, f(0)=6.',
    ],
    explanation: 'Roots -2 and 3 give factors (x+2)(x-3), then multiply by -1 for downward opening.',
    points: [{ x: -2, y: 0 }, { x: 3, y: 0 }, { x: 0, y: 6 }],
  },
  {
    id: 'derivative-drone',
    topic: 'Derivatives',
    title: 'Drone Height Curve',
    mission: 'Find the derivative from a quadratic height function.',
    question: 'Which derivative function matches?',
    answer: "f'(x) = 2x - 4",
    options: ["f'(x) = 2x - 4", "f'(x) = x^2 - 4x + 1", "f'(x) = 2x + 4", "f'(x) = -2x + 4"],
    xRange: [-2, 6],
    yRange: [-6, 12],
    fn: (x) => x ** 2 - 4 * x + 1,
    clues: [
      'Horizontal tangent at x=2.',
      'Slope is negative before x=2 and positive after x=2.',
      'Differentiate each term of x^2 - 4x + 1.',
    ],
    explanation: 'd/dx(x^2)=2x, d/dx(-4x)=-4, d/dx(1)=0, so f\'(x)=2x-4.',
    points: [{ x: 2, y: -3 }, { x: 0, y: 1 }],
  },
  {
    id: 'trig-tide',
    topic: 'Trigonometric Model',
    title: 'Tidal Code',
    mission: 'Use amplitude, midline, and period clues.',
    question: 'Which sine model fits the graph?',
    answer: 'f(x) = 2 sin(x) + 1',
    options: ['f(x) = 2 sin(x) + 1', 'f(x) = sin(2x) + 1', 'f(x) = 2 cos(x) + 1', 'f(x) = 2 sin(x) - 1'],
    xRange: [-6.28, 6.28],
    yRange: [-2.5, 4.5],
    fn: (x) => 2 * Math.sin(x) + 1,
    clues: [
      'Midline is y=1.',
      'Amplitude is 2.',
      'Graph passes through (0,1) and rises right after x=0.',
    ],
    explanation: 'Midline +1 and amplitude 2, with rising crossing at x=0, matches 2sin(x)+1.',
    points: [{ x: 0, y: 1 }, { x: Math.PI / 2, y: 3 }, { x: -Math.PI / 2, y: -1 }],
  },
]

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function scoreForCase(cluesUsed: number, mistakes: number) {
  return Math.max(35, 150 - cluesUsed * 25 - mistakes * 20)
}

function evaluateCaseAnswer(caseData: CaseData, option: string) {
  return option === caseData.answer
}

function getCaseByIndex(index: number) {
  return CASES[index % CASES.length]
}

export function FunctionDetectiveGame() {
  const [gameState, setGameState] = useState<'start' | 'playing' | 'solved' | 'finished'>('start')
  const [caseIndex, setCaseIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [solvedCases, setSolvedCases] = useState(0)
  const [cluesUsed, setCluesUsed] = useState(0)
  const [mistakes, setMistakes] = useState(0)
  const [wrongOptions, setWrongOptions] = useState<string[]>([])
  const [message, setMessage] = useState('Choose the model that best matches the graph.')

  const currentCase = useMemo(() => getCaseByIndex(caseIndex), [caseIndex])
  const visibleClues = useMemo(() => currentCase.clues.slice(0, cluesUsed), [currentCase, cluesUsed])
  const possibleScore = useMemo(() => scoreForCase(cluesUsed, mistakes), [cluesUsed, mistakes])
  const progress = `${solvedCases}/${CASES.length}`

  function resetCaseState(nextMessage: string) {
    setCluesUsed(0)
    setMistakes(0)
    setWrongOptions([])
    setMessage(nextMessage)
  }

  function startGame() {
    setGameState('playing')
    setCaseIndex(0)
    setScore(0)
    setSolvedCases(0)
    resetCaseState('First case is open. Read the graph and pick a model.')
  }

  function revealClue() {
    if (gameState !== 'playing') return
    if (cluesUsed >= currentCase.clues.length) {
      setMessage('All clues are already shown.')
      return
    }
    setCluesUsed((v) => v + 1)
    setMessage('New clue unlocked. Use it to eliminate models.')
  }

  function chooseOption(option: string) {
    if (gameState !== 'playing') return
    if (evaluateCaseAnswer(currentCase, option)) {
      const gained = scoreForCase(cluesUsed, mistakes)
      setScore((v) => v + gained)
      setSolvedCases((v) => v + 1)
      setMessage(`Correct. You earned ${gained} points.`)
      setGameState('solved')
      return
    }
    setMistakes((v) => v + 1)
    setWrongOptions((opts) => (opts.includes(option) ? opts : [...opts, option]))
    setMessage('Not this model. Check shape, intercepts, slope, and behavior.')
  }

  function nextCase() {
    const nextIndex = caseIndex + 1
    if (nextIndex >= CASES.length) {
      setGameState('finished')
      return
    }
    setCaseIndex(nextIndex)
    resetCaseState('New case. Start with shape: linear, quadratic, exponential, derivative, or periodic.')
    setGameState('playing')
  }

  function restartCurrentCase() {
    resetCaseState('Case reset. Try another strategy.')
    setGameState('playing')
  }

  return (
    <main className="min-h-[640px] rounded-jac-xl bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-4 text-white md:p-6">
      <div className="mx-auto w-full max-w-6xl">
        <header className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-sky-200">advanced math game</p>
            <h1 className="text-4xl font-black md:text-5xl">Function Detective</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-300">
              Investigate graphs, use mathematical clues, and choose the correct model.
            </p>
          </div>
          <div className="grid min-w-full grid-cols-3 gap-2 lg:min-w-[380px]">
            <Stat label="Score" value={score} />
            <Stat label="Cases" value={progress} />
            <Stat label="Possible" value={possibleScore} />
          </div>
        </header>

        {gameState === 'start' ? (
          <section className="grid gap-6 rounded-jac-lg border border-white/10 bg-black/25 p-6 md:grid-cols-[1fr_220px] md:items-center">
            <div>
              <h2 className="mb-3 text-3xl font-black">Detective mode for function modeling</h2>
              <p className="mb-5 text-slate-300">
                You get one graph and four candidate models. Use clues or solve directly from intercepts, slope, vertex, growth, derivative, or period.
              </p>
              <button onClick={startGame} className="rounded-jac-md bg-sky-500 px-6 py-3 font-bold text-sky-950 hover:bg-sky-400">
                Start investigation
              </button>
            </div>
            <div className="text-center text-8xl">🕵️</div>
          </section>
        ) : null}

        {gameState === 'playing' || gameState === 'solved' ? (
          <section className="grid gap-5 lg:grid-cols-[1.08fr_0.92fr]">
            <div className="rounded-jac-lg border border-white/10 bg-black/25 p-5">
              <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-200">{currentCase.topic}</p>
                  <h2 className="text-3xl font-black">{currentCase.title}</h2>
                  <p className="mt-2 text-slate-300">{currentCase.mission}</p>
                </div>
                <div className="rounded-jac-md border border-white/10 bg-white/10 px-4 py-3 text-center">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-300">Case</p>
                  <p className="text-2xl font-black">{caseIndex + 1}</p>
                </div>
              </div>
              <Graph caseData={currentCase} />
              <p className="mt-4 min-h-7 font-bold text-sky-200">{message}</p>
            </div>

            <aside className="rounded-jac-lg border border-white/10 bg-black/25 p-5">
              <div className="mb-5">
                <p className="mb-1 text-sm font-bold uppercase tracking-wide text-slate-400">Question</p>
                <h3 className="text-2xl font-black">{currentCase.question}</h3>
              </div>

              <div className="mb-5 grid gap-3">
                {currentCase.options.map((option) => {
                  const isWrong = wrongOptions.includes(option)
                  const isCorrectAfterSolve = gameState === 'solved' && option === currentCase.answer
                  return (
                    <button
                      key={option}
                      onClick={() => chooseOption(option)}
                      disabled={gameState !== 'playing' || isWrong}
                      className={`rounded-jac-md border p-4 text-left text-lg font-black ${
                        isCorrectAfterSolve
                          ? 'border-emerald-200 bg-emerald-400 text-emerald-950'
                          : isWrong
                            ? 'border-rose-300/30 bg-rose-500/25 text-rose-100 line-through opacity-70'
                            : 'border-white bg-white text-slate-950 hover:bg-sky-100'
                      }`}
                    >
                      {option}
                    </button>
                  )
                })}
              </div>

              <div className="mb-5 rounded-jac-md border border-white/10 bg-slate-950/70 p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold uppercase tracking-wide text-slate-400">Clues</p>
                    <p className="text-sm text-slate-300">Clues help, but reduce score.</p>
                  </div>
                  <button
                    onClick={revealClue}
                    disabled={gameState !== 'playing' || cluesUsed >= currentCase.clues.length}
                    className="rounded-jac-md bg-white/15 px-4 py-2 text-sm font-semibold disabled:opacity-50"
                  >
                    Show clue
                  </button>
                </div>
                {visibleClues.length === 0 ? (
                  <p className="font-medium text-slate-500">No clues used yet.</p>
                ) : (
                  <ol className="list-inside list-decimal space-y-2 text-slate-200">
                    {visibleClues.map((clue) => (
                      <li key={clue}>{clue}</li>
                    ))}
                  </ol>
                )}
              </div>

              {gameState === 'solved' ? (
                <div className="rounded-jac-md bg-emerald-400 p-5 text-emerald-950">
                  <h3 className="mb-2 text-2xl font-black">Case solved</h3>
                  <p className="mb-4 font-bold">{currentCase.explanation}</p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <button onClick={nextCase} className="rounded-jac-md bg-emerald-950 px-4 py-2 font-bold text-emerald-200">
                      {caseIndex + 1 >= CASES.length ? 'Show results' : 'Next case'}
                    </button>
                    <button onClick={restartCurrentCase} className="rounded-jac-md bg-white px-4 py-2 font-bold text-emerald-950">
                      Retry case
                    </button>
                  </div>
                </div>
              ) : null}
            </aside>
          </section>
        ) : null}

        {gameState === 'finished' ? (
          <section className="rounded-jac-lg border border-white/10 bg-black/25 p-10 text-center">
            <div className="mb-4 text-8xl">🎓</div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-slate-300">Investigation complete</p>
            <h2 className="my-3 text-7xl font-black">{score}</h2>
            <p className="mx-auto mb-7 max-w-2xl text-slate-300">
              {score >= 750
                ? 'Outstanding. You read graphs with high precision.'
                : score >= 520
                  ? 'Strong work. Solid control of functions and graph reasoning.'
                  : 'Nice run. Try again with fewer clues for a higher score.'}
            </p>
            <button onClick={startGame} className="rounded-jac-md bg-sky-500 px-8 py-3 text-lg font-bold text-sky-950 hover:bg-sky-400">
              Play again
            </button>
          </section>
        ) : null}
      </div>
    </main>
  )
}

function Graph({ caseData }: { caseData: CaseData }) {
  const width = 620
  const height = 390
  const padding = 42
  const [xMin, xMax] = caseData.xRange
  const [yMin, yMax] = caseData.yRange
  const toX = (x: number) => padding + ((x - xMin) / (xMax - xMin)) * (width - padding * 2)
  const toY = (y: number) => height - padding - ((y - yMin) / (yMax - yMin)) * (height - padding * 2)

  const samples = Array.from({ length: 260 }, (_, index) => {
    const x = xMin + (index / 259) * (xMax - xMin)
    const y = caseData.fn(x)
    return { x, y }
  }).filter((point) => Number.isFinite(point.y))

  const path = samples
    .map((point, index) => {
      const command = index === 0 ? 'M' : 'L'
      return `${command} ${toX(point.x).toFixed(2)} ${toY(clamp(point.y, yMin - 5, yMax + 5)).toFixed(2)}`
    })
    .join(' ')

  const xTicks = makeTicks(xMin, xMax, 7)
  const yTicks = makeTicks(yMin, yMax, 7)
  const axisX = yMin <= 0 && yMax >= 0 ? toY(0) : toY(yMin)
  const axisY = xMin <= 0 && xMax >= 0 ? toX(0) : toX(xMin)

  return (
    <div className="overflow-hidden rounded-jac-md border border-white/10 bg-slate-950 p-3">
      <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full" role="img" aria-label={`Graph for ${caseData.topic}`}>
        <rect x="0" y="0" width={width} height={height} rx="24" fill="rgba(15, 23, 42, 0.96)" />
        {xTicks.map((tick) => (
          <g key={`x-${tick}`}>
            <line x1={toX(tick)} y1={padding} x2={toX(tick)} y2={height - padding} stroke="rgba(255,255,255,0.08)" />
            <text x={toX(tick)} y={height - 14} textAnchor="middle" fill="rgba(226,232,240,0.62)" fontSize="11">
              {formatTick(tick)}
            </text>
          </g>
        ))}
        {yTicks.map((tick) => (
          <g key={`y-${tick}`}>
            <line x1={padding} y1={toY(tick)} x2={width - padding} y2={toY(tick)} stroke="rgba(255,255,255,0.08)" />
            <text x="18" y={toY(tick) + 4} fill="rgba(226,232,240,0.62)" fontSize="11">
              {formatTick(tick)}
            </text>
          </g>
        ))}
        <line x1={padding} y1={axisX} x2={width - padding} y2={axisX} stroke="rgba(255,255,255,0.38)" strokeWidth="2" />
        <line x1={axisY} y1={padding} x2={axisY} y2={height - padding} stroke="rgba(255,255,255,0.38)" strokeWidth="2" />
        <path d={path} fill="none" stroke="#7dd3fc" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        {caseData.points.map((point, index) => (
          <circle key={`${caseData.id}-point-${index}`} cx={toX(point.x)} cy={toY(point.y)} r="7" fill="#facc15" stroke="#422006" strokeWidth="2" />
        ))}
      </svg>
    </div>
  )
}

function makeTicks(min: number, max: number, count: number) {
  return Array.from({ length: count }, (_, index) => {
    const raw = min + (index / (count - 1)) * (max - min)
    return Math.abs(raw) < 0.0001 ? 0 : raw
  })
}

function formatTick(value: number) {
  if (Math.abs(value) >= 10) return value.toFixed(0)
  if (Number.isInteger(value)) return String(value)
  return value.toFixed(1)
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-jac-md border border-white/10 bg-white/10 px-3 py-3 text-center">
      <p className="text-[0.68rem] font-bold uppercase tracking-wide text-slate-300 md:text-xs">{label}</p>
      <p className="truncate text-lg font-black md:text-2xl">{value}</p>
    </div>
  )
}

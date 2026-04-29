'use client'

import { useMemo, useState } from 'react'

const GRAVITY = 9.82

const LEVELS = [
  {
    title: 'Rubber Duck in the Tub',
    emoji: '🦆',
    medium: 'Water',
    fluidDensity: 1,
    goal: 'float',
    goalLabel: 'Make it float',
    startMass: 1.2,
    startVolume: 1.8,
    lesson: 'An object floats when buoyancy is greater than weight.',
    tip: 'More volume gives more buoyancy. More mass gives more weight.',
  },
  {
    title: 'Make the Rock Sink',
    emoji: '🪨',
    medium: 'Water',
    fluidDensity: 1,
    goal: 'sink',
    goalLabel: 'Make it sink',
    startMass: 2.5,
    startVolume: 1.4,
    lesson: 'A rock sinks when weight is greater than buoyancy.',
    tip: 'To sink, mass must be large relative to volume.',
  },
  {
    title: 'Submarine Hover Mode',
    emoji: '🚢',
    medium: 'Water',
    fluidDensity: 1,
    goal: 'hover',
    goalLabel: 'Make it hover near center',
    startMass: 3,
    startVolume: 3,
    lesson: 'Neutral buoyancy happens when weight and buoyancy nearly balance.',
    tip: 'Try balancing mass and displaced fluid.',
  },
  {
    title: 'Hot Air Balloon',
    emoji: '🎈',
    medium: 'Air',
    fluidDensity: 0.12,
    goal: 'float',
    goalLabel: 'Make it rise',
    startMass: 0.8,
    startVolume: 5,
    lesson: 'The balloon rises when average density is lower than surrounding air.',
    tip: 'In air, high volume and low mass help it rise.',
  },
  {
    title: 'Iron Ship',
    emoji: '🚢',
    medium: 'Water',
    fluidDensity: 1,
    goal: 'float',
    goalLabel: 'Make the iron ship float',
    startMass: 5,
    startVolume: 6,
    lesson: 'Even iron can float if shape displaces enough water.',
    tip: 'Heavy material can float with large enough displaced volume.',
  },
] as const

type GameState = 'start' | 'playing' | 'won' | 'finished'
type Result = 'float' | 'sink' | 'hover'

function calculateForces({ mass, volume, fluidDensity }: { mass: number; volume: number; fluidDensity: number }) {
  const density = mass / volume
  const weight = mass * GRAVITY
  const buoyancy = fluidDensity * volume * GRAVITY
  const balanceRatio = buoyancy / weight

  let result: Result = 'hover'
  if (balanceRatio > 1.08) result = 'float'
  if (balanceRatio < 0.92) result = 'sink'

  return { density, weight, buoyancy, balanceRatio, result }
}

function isGoalMet(result: Result, goal: string) {
  return result === goal
}

function resultText(result: Result | string) {
  if (result === 'float') return 'Floats / rises'
  if (result === 'sink') return 'Sinks down'
  return 'Near neutral hover'
}

function getResultMessage(result: ReturnType<typeof calculateForces>) {
  if (result.result === 'float') return 'Buoyancy wins. Object moves upward.'
  if (result.result === 'sink') return 'Weight wins. Object moves downward.'
  return 'Forces are almost balanced. Object hovers near the middle.'
}

function calculateScore(result: ReturnType<typeof calculateForces>, goal: string, attempts: number) {
  const base = isGoalMet(result.result, goal) ? 100 : 0
  const attemptBonus = Math.max(0, 35 - attempts * 6)
  const balanceBonus = goal === 'hover' ? Math.max(0, Math.round(30 - Math.abs(1 - result.balanceRatio) * 100)) : 0
  return base + attemptBonus + balanceBonus
}

export function BuoyancyLabGame() {
  const [gameState, setGameState] = useState<GameState>('start')
  const [levelIndex, setLevelIndex] = useState(0)
  const [mass, setMass] = useState(LEVELS[0].startMass)
  const [volume, setVolume] = useState(LEVELS[0].startVolume)
  const [score, setScore] = useState(0)
  const [attempts, setAttempts] = useState(0)
  const [lastTest, setLastTest] = useState<ReturnType<typeof calculateForces> | null>(null)
  const [message, setMessage] = useState('Set mass and volume, then run a test.')

  const level = LEVELS[levelIndex]
  const forces = useMemo(() => calculateForces({ mass, volume, fluidDensity: level.fluidDensity }), [mass, volume, level.fluidDensity])
  const levelProgress = `${levelIndex + 1}/${LEVELS.length}`

  function loadLevel(index: number, nextMessage?: string) {
    const nextLevel = LEVELS[index]
    setMass(nextLevel.startMass)
    setVolume(nextLevel.startVolume)
    setAttempts(0)
    setLastTest(null)
    setMessage(nextMessage ?? nextLevel.tip)
  }

  function startGame() {
    setGameState('playing')
    setScore(0)
    setLevelIndex(0)
    loadLevel(0, 'First test: make the rubber duck float.')
  }

  function testObject() {
    if (gameState !== 'playing') return
    const current = calculateForces({ mass, volume, fluidDensity: level.fluidDensity })
    const nextAttempts = attempts + 1
    const success = isGoalMet(current.result, level.goal)
    setAttempts(nextAttempts)
    setLastTest(current)
    setMessage(getResultMessage(current))
    if (success) {
      const gained = calculateScore(current, level.goal, nextAttempts)
      setScore((v) => v + gained)
      setGameState('won')
    }
  }

  function retryLevel() {
    loadLevel(levelIndex, 'Same level. Try a different mass/volume combination.')
    setGameState('playing')
  }

  function nextLevel() {
    const nextIndex = levelIndex + 1
    if (nextIndex >= LEVELS.length) {
      setGameState('finished')
      return
    }
    setLevelIndex(nextIndex)
    loadLevel(nextIndex, 'New challenge: compare buoyancy and weight carefully.')
    setGameState('playing')
  }

  return (
    <main className="min-h-[620px] rounded-jac-xl border-4 border-[#1c1c1c] bg-[#fffaf0] p-4 text-[#1c1c1c] md:p-6">
      <div className="mx-auto w-full max-w-5xl">
        <header className="mb-5 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="inline-block rounded-full border-2 border-[#1c1c1c] bg-[#ffdd57] px-3 py-1 text-xs font-black uppercase tracking-[0.16em]">
              Weight vs buoyancy
            </p>
            <h1 className="mt-3 text-4xl font-black md:text-6xl">Float or Sink Lab</h1>
            <p className="mt-3 text-base md:text-lg">A density game: if weight wins, it sinks. If buoyancy wins, it floats or rises.</p>
          </div>
          <div className="grid min-w-full grid-cols-3 gap-2 md:min-w-[330px]">
            <Stat label="Score" value={score} />
            <Stat label="Mission" value={levelProgress} />
            <Stat label="Attempts" value={attempts} />
          </div>
        </header>

        {gameState === 'start' ? (
          <section className="grid items-center gap-5 rounded-[2rem] border-4 border-[#1c1c1c] bg-[#a7f3d0] p-6 md:grid-cols-[1fr_180px]">
            <div>
              <h2 className="mb-3 text-3xl font-black md:text-4xl">Can you balance the forces?</h2>
              <p className="mb-5 text-lg">Adjust mass and volume, then test whether the object floats, sinks, or hovers.</p>
              <button onClick={startGame} className="rounded-2xl border-2 border-[#1c1c1c] bg-[#1c1c1c] px-8 py-4 text-lg font-black text-white">
                Start
              </button>
            </div>
            <div className="text-center text-[7rem]">🛟</div>
          </section>
        ) : null}

        {gameState === 'playing' || gameState === 'won' ? (
          <section className="grid gap-5 lg:grid-cols-[1fr_360px]">
            <div className="rounded-[2rem] border-4 border-[#1c1c1c] bg-white p-5">
              <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="inline-block rounded-full border-2 border-[#1c1c1c] bg-[#93c5fd] px-3 py-1 text-xs font-black uppercase tracking-wide">{level.medium}</p>
                  <h2 className="mt-2 text-3xl font-black md:text-4xl">{level.title}</h2>
                  <p className="mt-1 text-lg">{level.goalLabel}</p>
                </div>
                <div className="rounded-2xl border-2 border-[#1c1c1c] bg-[#ffdd57] px-4 py-3 text-center">
                  <p className="text-xs font-black uppercase tracking-wide">Goal</p>
                  <p className="text-2xl font-black">{resultText(level.goal)}</p>
                </div>
              </div>

              <FluidTank level={level} test={lastTest} emoji={level.emoji} />
              <p className="mt-4 rounded-2xl border-2 border-[#1c1c1c] bg-[#fde68a] p-3 text-lg font-black">{message}</p>

              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <BigStat label="Weight" value={lastTest ? `${lastTest.weight.toFixed(1)}N` : '-'} />
                <BigStat label="Buoyancy" value={lastTest ? `${lastTest.buoyancy.toFixed(1)}N` : '-'} />
                <BigStat label="Density" value={`${forces.density.toFixed(2)} kg/L`} />
              </div>
            </div>

            <aside className="flex flex-col gap-4 rounded-[2rem] border-4 border-[#1c1c1c] bg-[#dbeafe] p-5">
              <div>
                <h3 className="mb-1 text-3xl font-black">Build the object</h3>
                <p className="font-semibold">Object moves only when you press TEST.</p>
              </div>

              <SliderControl label="Mass" value={mass} min={0.2} max={8} step={0.1} unit="kg" onChange={setMass} />
              <SliderControl label="Volume" value={volume} min={0.3} max={10} step={0.1} unit="L" onChange={setVolume} />

              <div className="rounded-2xl border-2 border-[#1c1c1c] bg-white p-4">
                <p className="mb-1 text-lg font-black">Force battle</p>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <MiniForce label="Weight" emoji="⬇️" value={forces.weight} />
                  <MiniForce label="Buoyancy" emoji="⬆️" value={forces.buoyancy} />
                </div>
                <p className="mt-3 text-sm font-semibold">
                  {forces.density > level.fluidDensity
                    ? 'Object is denser than the medium: likely to sink.'
                    : forces.density < level.fluidDensity
                      ? 'Object is less dense than the medium: likely to float/rise.'
                      : 'Object density is close to medium density.'}
                </p>
              </div>

              <div className="rounded-2xl border-2 border-[#1c1c1c] bg-[#fef3c7] p-4">
                <p className="mb-1 text-xs font-black uppercase tracking-wide">Tip</p>
                <p className="font-bold">{level.tip}</p>
              </div>

              <div className="mt-auto grid gap-2">
                <button onClick={testObject} disabled={gameState !== 'playing'} className="rounded-2xl border-2 border-[#1c1c1c] bg-[#2563eb] py-4 text-lg font-black text-white">
                  TEST OBJECT
                </button>
                <button onClick={retryLevel} className="rounded-2xl border-2 border-[#1c1c1c] bg-white py-3 font-black">
                  Reset
                </button>
              </div>

              {gameState === 'won' ? (
                <div className="rounded-2xl border-2 border-[#1c1c1c] bg-[#86efac] p-4">
                  <h3 className="mb-2 text-2xl font-black">Correct!</h3>
                  <p className="mb-4 font-bold">{level.lesson}</p>
                  <button onClick={nextLevel} className="w-full rounded-2xl border-2 border-[#1c1c1c] bg-[#1c1c1c] py-3 font-black text-white">
                    {levelIndex + 1 >= LEVELS.length ? 'Show result' : 'Next'}
                  </button>
                </div>
              ) : null}
            </aside>
          </section>
        ) : null}

        {gameState === 'finished' ? (
          <section className="rounded-[2rem] border-4 border-[#1c1c1c] bg-[#c4b5fd] p-8 text-center md:p-12">
            <div className="mb-4 text-8xl">🏆</div>
            <p className="text-sm font-black uppercase tracking-[0.2em]">Physics report complete</p>
            <h2 className="my-3 text-7xl font-black">{score}</h2>
            <p className="mx-auto mb-7 max-w-2xl text-lg font-bold">
              {score >= 620
                ? 'Excellent. Strong command of density, weight, and buoyancy.'
                : score >= 450
                  ? 'Great job. You can distinguish mass from displaced volume.'
                  : 'You completed the lab. Try again with fewer attempts for a higher score.'}
            </p>
            <button onClick={startGame} className="rounded-2xl border-2 border-[#1c1c1c] bg-[#1c1c1c] px-8 py-4 text-lg font-black text-white">
              Play again
            </button>
          </section>
        ) : null}
      </div>
    </main>
  )
}

function FluidTank({
  level,
  test,
  emoji,
}: {
  level: (typeof LEVELS)[number]
  test: ReturnType<typeof calculateForces> | null
  emoji: string
}) {
  const position = test ? getObjectPosition(test.result) : '50%'
  const label = test ? resultText(test.result) : 'Not tested'

  return (
    <div className="relative h-[320px] overflow-hidden rounded-[2rem] border-4 border-[#1c1c1c] bg-[#bfdbfe]">
      <div className="absolute inset-x-0 bottom-0 h-[78%] border-t-4 border-[#1c1c1c] bg-[#60a5fa]" />
      <div className="absolute left-4 top-4 rounded-2xl border-2 border-[#1c1c1c] bg-white px-4 py-2 font-black">Medium: {level.medium}</div>
      <div className="absolute right-4 top-4 rounded-2xl border-2 border-[#1c1c1c] bg-[#ffdd57] px-4 py-2 font-black">{label}</div>
      <div className="absolute left-5 bottom-5 rounded-2xl border-2 border-[#1c1c1c] bg-white px-3 py-2 font-black">Weight ⬇️</div>
      <div className="absolute right-5 bottom-5 rounded-2xl border-2 border-[#1c1c1c] bg-white px-3 py-2 font-black">Buoyancy ⬆️</div>
      <div className="absolute -translate-x-1/2 -translate-y-1/2 text-7xl md:text-8xl" style={{ left: '50%', top: position }}>
        {emoji}
      </div>
    </div>
  )
}

function getObjectPosition(result: Result) {
  if (result === 'float') return '28%'
  if (result === 'sink') return '82%'
  return '55%'
}

function SliderControl({
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
}: {
  label: string
  value: number
  min: number
  max: number
  step: number
  unit: string
  onChange: (value: number) => void
}) {
  return (
    <label className="block rounded-2xl border-2 border-[#1c1c1c] bg-white p-4">
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className="text-lg font-black">{label}</span>
        <span className="rounded-xl border-2 border-[#1c1c1c] bg-[#ffdd57] px-3 py-1 font-black">
          {value}
          {unit}
        </span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} className="w-full accent-[#2563eb]" />
    </label>
  )
}

function MiniForce({ label, emoji, value }: { label: string; emoji: string; value: number }) {
  return (
    <div className="rounded-xl border-2 border-[#1c1c1c] bg-[#f8fafc] p-3 text-center">
      <p className="text-2xl">{emoji}</p>
      <p className="text-xs font-black uppercase">{label}</p>
      <p className="font-black">{value.toFixed(1)}N</p>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border-2 border-[#1c1c1c] bg-white px-3 py-3 text-center">
      <p className="text-[0.68rem] font-black uppercase tracking-wide md:text-xs">{label}</p>
      <p className="truncate text-lg font-black md:text-2xl">{value}</p>
    </div>
  )
}

function BigStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border-2 border-[#1c1c1c] bg-[#f8fafc] p-4 text-center">
      <p className="text-xs font-black uppercase tracking-[0.2em]">{label}</p>
      <p className="text-xl font-black md:text-2xl">{value}</p>
    </div>
  )
}

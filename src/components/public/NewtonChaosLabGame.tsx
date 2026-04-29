'use client'

import { useMemo, useState } from 'react'

const LEVELS = [
  {
    title: 'The Stubborn Sofa',
    law: "Newton's 1st Law",
    emoji: '🛋️',
    mission: 'Push the sofa into the snack zone without launching it into the wall.',
    target: 2.5,
    tolerance: 0.55,
    mass: 8,
    friction: 35,
    scale: 0.72,
    lesson: 'An object stays at rest if net force is not enough to change its motion.',
    tip: 'If nothing moves, friction is beating your push.',
  },
  {
    title: 'Shopping Cart with Concrete Cat',
    law: "Newton's 2nd Law",
    emoji: '🛒',
    mission: 'Push the cart to checkout. The cat packed concrete. Nobody knows why.',
    target: 4.4,
    tolerance: 0.6,
    mass: 5,
    friction: 20,
    scale: 0.72,
    lesson: 'More mass needs more force for the same acceleration: F = m * a.',
    tip: 'Same force + larger mass = lower acceleration.',
  },
  {
    title: 'Space Cow in Vacuum',
    law: "Newton's 3rd Law",
    emoji: '🐄',
    mission: 'Move the cow to the moon by pushing mass in the opposite direction.',
    target: 6.2,
    tolerance: 0.65,
    mass: 3,
    friction: 0,
    scale: 0.68,
    lesson: 'Push gas backward, cow moves forward. Action and reaction.',
    tip: 'To move forward, force must be sent backward.',
  },
  {
    title: 'Elephant on a Skateboard',
    law: "Newton's 2nd Law",
    emoji: '🐘',
    mission: 'The elephant is late for a birthday party. Give enough force to move it.',
    target: 3.3,
    tolerance: 0.5,
    mass: 12,
    friction: 18,
    scale: 0.75,
    lesson: 'Large mass means less acceleration for the same force.',
    tip: 'An elephant needs way more force than a cart.',
  },
  {
    title: 'Soapbox Car from Chaos',
    law: "Newton's 1st and 2nd Laws",
    emoji: '🏎️',
    mission: 'Low friction makes it slide forever. Hit the zone without overshooting.',
    target: 7.1,
    tolerance: 0.5,
    mass: 2,
    friction: 8,
    scale: 0.74,
    lesson: 'Low friction makes motion continue more easily.',
    tip: 'Low friction + too much force = instant overshoot.',
  },
] as const

const MODIFIERS = [
  { id: 'none', label: 'No chaos', emoji: '✅', forceBonus: 0, massBonus: 0, frictionDelta: 0, text: 'Normal physics.' },
  { id: 'banana', label: 'Banana peel', emoji: '🍌', forceBonus: 0, massBonus: 0, frictionDelta: -14, text: 'Lower friction. More sliding.' },
  { id: 'anvil', label: 'Pocket anvil', emoji: '⚓', forceBonus: 0, massBonus: 4, frictionDelta: 0, text: 'Higher mass. Lower acceleration.' },
  { id: 'rocket', label: 'Bad rocket', emoji: '🚀', forceBonus: 18, massBonus: 0, frictionDelta: 0, text: 'More force. Easier to overdo.' },
  { id: 'glue', label: 'Mystery glue', emoji: '🧴', forceBonus: 0, massBonus: 0, frictionDelta: 18, text: 'Higher friction. Everything feels slower.' },
] as const

type GameState = 'start' | 'playing' | 'won' | 'finished'
type Direction = 'left' | 'right'
type ModifierId = (typeof MODIFIERS)[number]['id']

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function getModifier(id: ModifierId) {
  return MODIFIERS.find((m) => m.id === id) ?? MODIFIERS[0]
}

function calculateMotion({
  force,
  direction,
  level,
  modifierId,
}: {
  force: number
  direction: Direction
  level: (typeof LEVELS)[number]
  modifierId: ModifierId
}) {
  const modifier = getModifier(modifierId)
  const effectiveMass = Math.max(1, level.mass + modifier.massBonus)
  const effectiveForce = Math.max(0, force + modifier.forceBonus)
  const effectiveFriction = clamp(level.friction + modifier.frictionDelta, 0, 80)
  const sign = direction === 'right' ? 1 : -1
  const resistance = (effectiveFriction / 100) * effectiveMass * 5
  const movingForce = Math.max(0, effectiveForce - resistance)
  const acceleration = sign * (movingForce / effectiveMass)
  const distance = clamp(acceleration * level.scale, -2, 10)
  return {
    modifier,
    effectiveMass,
    effectiveFriction,
    acceleration,
    distance,
    isStuck: movingForce === 0,
  }
}

function isHit(distance: number, level: (typeof LEVELS)[number]) {
  return Math.abs(distance - level.target) <= level.tolerance
}

function getAccuracy(distance: number, level: (typeof LEVELS)[number]) {
  const error = Math.abs(distance - level.target)
  return Math.max(0, Math.round(100 - error * 18))
}

function calculateScore(distance: number, level: (typeof LEVELS)[number], attempts: number, chaosUsed: boolean) {
  const accuracy = getAccuracy(distance, level)
  const attemptBonus = Math.max(0, 45 - attempts * 7)
  const chaosBonus = chaosUsed ? 12 : 0
  return accuracy + attemptBonus + chaosBonus
}

function getResultMessage(
  result: ReturnType<typeof calculateMotion>,
  level: (typeof LEVELS)[number],
) {
  const difference = result.distance - level.target
  if (result.isStuck) return 'Nothing moved. Friction won this round.'
  if (result.distance < 0) return 'You sent it backward. Technically valid physics.'
  if (isHit(result.distance, level)) return 'Perfect hit. Target zone reached.'
  if (difference < 0) return 'Too short. Try more force, less mass, or less friction.'
  return 'Too far. Try less force or more friction.'
}

export function NewtonChaosLabGame() {
  const [gameState, setGameState] = useState<GameState>('start')
  const [levelIndex, setLevelIndex] = useState(0)
  const [force, setForce] = useState(42)
  const [direction, setDirection] = useState<Direction>('right')
  const [modifierId, setModifierId] = useState<ModifierId>('none')
  const [score, setScore] = useState(0)
  const [attempts, setAttempts] = useState(0)
  const [lastRun, setLastRun] = useState<ReturnType<typeof calculateMotion> | null>(null)
  const [message, setMessage] = useState('Choose force, choose chaos, and test your physics intuition.')

  const level = LEVELS[levelIndex]
  const preview = useMemo(
    () => calculateMotion({ force, direction, level, modifierId }),
    [force, direction, level, modifierId],
  )
  const levelProgress = `${levelIndex + 1}/${LEVELS.length}`
  const chaosUsed = modifierId !== 'none'

  function resetLevel(index = levelIndex, nextMessage = 'Level reset. Try another strategy.') {
    setForce(index === 2 ? 30 : 42)
    setDirection('right')
    setModifierId('none')
    setAttempts(0)
    setLastRun(null)
    setMessage(nextMessage)
  }

  function startGame() {
    setGameState('playing')
    setLevelIndex(0)
    setScore(0)
    resetLevel(0, 'First mission: move the sofa into the zone.')
  }

  function launchExperiment() {
    if (gameState !== 'playing') return
    const result = calculateMotion({ force, direction, level, modifierId })
    const nextAttempts = attempts + 1
    const hit = isHit(result.distance, level)
    setAttempts(nextAttempts)
    setLastRun(result)
    setMessage(getResultMessage(result, level))
    if (hit) {
      const gained = calculateScore(result.distance, level, nextAttempts, chaosUsed)
      setScore((v) => v + gained)
      setGameState('won')
    }
  }

  function nextLevel() {
    const nextIndex = levelIndex + 1
    if (nextIndex >= LEVELS.length) {
      setGameState('finished')
      return
    }
    setLevelIndex(nextIndex)
    resetLevel(nextIndex, 'New mission. New object. Same Newton.')
    setGameState('playing')
  }

  function retryLevel() {
    resetLevel(levelIndex)
    setGameState('playing')
  }

  return (
    <main className="min-h-[640px] rounded-jac-xl border-4 border-[#1c1c1c] bg-[#fffaf0] p-4 text-[#1c1c1c] md:p-6">
      <div className="mx-auto w-full max-w-6xl">
        <header className="mb-6 grid gap-5 lg:grid-cols-[1fr_390px]">
          <div>
            <p className="inline-block rounded-full border-2 border-[#1c1c1c] bg-[#ffdd57] px-3 py-1 text-sm font-black uppercase tracking-[0.18em]">
              Newton laws, silly mode
            </p>
            <h1 className="mt-4 text-5xl font-black leading-[0.95] md:text-6xl">Newton Chaos Lab</h1>
            <p className="mt-3 text-lg">Push absurd objects and learn Newton’s laws through trial and chaos.</p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Stat label="Score" value={score} />
            <Stat label="Mission" value={levelProgress} />
            <Stat label="Attempts" value={attempts} />
          </div>
        </header>

        {gameState === 'start' ? (
          <section className="grid items-center gap-6 rounded-[2rem] border-4 border-[#1c1c1c] bg-[#a7f3d0] p-6 md:grid-cols-[1fr_220px]">
            <div>
              <h2 className="mb-3 text-4xl font-black">Physics with ridiculous objects</h2>
              <p className="mb-5 text-lg">Set force, direction, and chaos modifier. Hit the target zone using Newtonian reasoning.</p>
              <button onClick={startGame} className="rounded-2xl border-2 border-[#1c1c1c] bg-[#1c1c1c] px-8 py-4 text-lg font-black text-white">
                Start chaos
              </button>
            </div>
            <div className="text-center text-8xl">🍎</div>
          </section>
        ) : null}

        {gameState === 'playing' || gameState === 'won' ? (
          <section className="grid gap-5 lg:grid-cols-[1.08fr_0.92fr]">
            <div className="rounded-[2rem] border-4 border-[#1c1c1c] bg-white p-5">
              <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="inline-block rounded-full border-2 border-[#1c1c1c] bg-[#93c5fd] px-3 py-1 text-sm font-black uppercase tracking-wide">
                    {level.law}
                  </p>
                  <h2 className="mt-3 text-4xl font-black">{level.title}</h2>
                  <p className="mt-2 text-lg">{level.mission}</p>
                </div>
                <div className="rounded-2xl border-2 border-[#1c1c1c] bg-[#ffdd57] px-4 py-3 text-center">
                  <p className="text-xs font-black uppercase tracking-wide">Target</p>
                  <p className="text-2xl font-black">{level.target.toFixed(1)}m</p>
                </div>
              </div>

              <LabTrack level={level} run={lastRun} preview={preview} emoji={level.emoji} />
              <p className="mt-5 rounded-2xl border-2 border-[#1c1c1c] bg-[#fde68a] p-4 text-lg font-black">{message}</p>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <BigStat label="Distance" value={lastRun ? `${lastRun.distance.toFixed(2)}m` : 'Not launched'} />
                <BigStat label="Acceleration" value={lastRun ? `${lastRun.acceleration.toFixed(2)}m/s²` : '-'} />
                <BigStat label="Mass" value={`${preview.effectiveMass}kg`} />
              </div>
            </div>

            <aside className="flex flex-col gap-5 rounded-[2rem] border-4 border-[#1c1c1c] bg-[#dbeafe] p-5">
              <div>
                <h3 className="text-3xl font-black">Control Panel</h3>
                <p className="font-semibold">Tune variables, launch, observe, and iterate.</p>
              </div>

              <SliderControl
                label="Push force"
                value={force}
                min={0}
                max={100}
                step={1}
                unit="N"
                onChange={setForce}
                note="More force gives higher acceleration at equal mass."
              />

              <div className="rounded-2xl border-2 border-[#1c1c1c] bg-white p-4">
                <p className="mb-3 text-lg font-black">Direction</p>
                <div className="grid grid-cols-2 gap-2">
                  <ChoiceButton active={direction === 'right'} onClick={() => setDirection('right')}>
                    ➡️ Forward
                  </ChoiceButton>
                  <ChoiceButton active={direction === 'left'} onClick={() => setDirection('left')}>
                    ⬅️ Backward
                  </ChoiceButton>
                </div>
              </div>

              <div className="rounded-2xl border-2 border-[#1c1c1c] bg-white p-4">
                <p className="mb-3 text-lg font-black">Chaos modifier</p>
                <div className="grid grid-cols-2 gap-2">
                  {MODIFIERS.map((modifier) => (
                    <ChoiceButton key={modifier.id} active={modifierId === modifier.id} onClick={() => setModifierId(modifier.id)}>
                      {modifier.emoji} {modifier.label}
                    </ChoiceButton>
                  ))}
                </div>
                <p className="mt-3 text-sm font-semibold">{getModifier(modifierId).text}</p>
              </div>

              <div className="rounded-2xl border-2 border-[#1c1c1c] bg-[#fef3c7] p-4">
                <p className="text-xs font-black uppercase tracking-wide">Newton note</p>
                <p className="font-bold">{level.tip}</p>
              </div>

              <div className="mt-auto grid gap-2">
                <button onClick={launchExperiment} disabled={gameState !== 'playing'} className="rounded-2xl border-2 border-[#1c1c1c] bg-[#ef4444] py-4 text-lg font-black text-white">
                  LAUNCH
                </button>
                <button onClick={retryLevel} className="rounded-2xl border-2 border-[#1c1c1c] bg-white py-3 font-black">
                  Reset mission
                </button>
              </div>

              {gameState === 'won' ? (
                <div className="rounded-2xl border-2 border-[#1c1c1c] bg-[#86efac] p-5">
                  <h3 className="mb-2 text-2xl font-black">Mission cleared</h3>
                  <p className="mb-4 font-bold">{level.lesson}</p>
                  <button onClick={nextLevel} className="w-full rounded-2xl border-2 border-[#1c1c1c] bg-[#1c1c1c] py-3 font-black text-white">
                    {levelIndex + 1 >= LEVELS.length ? 'Show results' : 'Next mission'}
                  </button>
                </div>
              ) : null}
            </aside>
          </section>
        ) : null}

        {gameState === 'finished' ? (
          <section className="rounded-[2rem] border-4 border-[#1c1c1c] bg-[#c4b5fd] p-10 text-center">
            <div className="mb-4 text-8xl">🏆</div>
            <p className="text-sm font-black uppercase tracking-[0.2em]">Chaos report complete</p>
            <h2 className="my-3 text-7xl font-black">{score}</h2>
            <p className="mx-auto mb-7 max-w-2xl text-lg font-bold">
              {score >= 690
                ? 'Elite performance. You balanced force, mass, and friction beautifully.'
                : score >= 500
                  ? 'Strong work. Solid grasp of Newtonian motion.'
                  : 'Good run. Try fewer attempts per mission for a higher score.'}
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

function LabTrack({
  level,
  run,
  preview,
  emoji,
}: {
  level: (typeof LEVELS)[number]
  run: ReturnType<typeof calculateMotion> | null
  preview: ReturnType<typeof calculateMotion>
  emoji: string
}) {
  const minDistance = -2
  const maxDistance = 10
  const visibleData = run ?? preview
  const currentDistance = run ? run.distance : 0
  const toLeft = (distance: number) => `${clamp(((distance - minDistance) / (maxDistance - minDistance)) * 100, 4, 96)}%`
  const targetWidth = `${Math.max(7, ((level.tolerance * 2) / (maxDistance - minDistance)) * 100)}%`

  return (
    <div className="relative h-[320px] overflow-hidden rounded-[2rem] border-4 border-[#1c1c1c] bg-[#e0f2fe]">
      <div className="absolute inset-x-0 bottom-0 h-24 border-t-4 border-[#1c1c1c] bg-[#bbf7d0]" />
      <div className="absolute left-4 top-4 rounded-2xl border-2 border-[#1c1c1c] bg-white px-4 py-2 font-black">Friction: {visibleData.effectiveFriction}%</div>
      <div
        className="absolute bottom-16 flex h-16 -translate-x-1/2 items-center justify-center rounded-2xl border-4 border-[#1c1c1c] bg-[#facc15] font-black"
        style={{ left: toLeft(level.target), width: targetWidth }}
      >
        TARGET
      </div>
      <div className="absolute -translate-x-1/2 text-7xl transition-all duration-500 md:text-8xl" style={{ left: toLeft(currentDistance), bottom: '84px' }}>
        {emoji}
      </div>
      <div className="absolute bottom-2 left-5 text-sm font-black">-2m</div>
      <div className="absolute bottom-2 left-[16.66%] -translate-x-1/2 text-sm font-black">0m</div>
      <div className="absolute bottom-2 right-5 text-sm font-black">10m</div>
    </div>
  )
}

function SliderControl({
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
  note,
}: {
  label: string
  value: number
  min: number
  max: number
  step: number
  unit: string
  onChange: (v: number) => void
  note: string
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
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full accent-[#ef4444]"
      />
      <p className="mt-2 text-sm font-semibold">{note}</p>
    </label>
  )
}

function ChoiceButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl border-2 border-[#1c1c1c] px-3 py-3 text-left font-black ${
        active ? 'translate-x-[2px] translate-y-[2px] bg-[#ffdd57]' : 'bg-[#fffaf0] hover:bg-[#fef3c7]'
      }`}
    >
      {children}
    </button>
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
      <p className="text-2xl font-black md:text-3xl">{value}</p>
    </div>
  )
}

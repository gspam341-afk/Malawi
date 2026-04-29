'use client'

import { useEffect, useMemo, useState } from 'react'

const OPERATORS = ['+', '-', 'x'] as const
const MONSTERS = ['zombie', 'alien', 'dragon', 'dino', 'ogre', 'robot', 'troll']
const START_TIME = 45
const START_LIVES = 3

type Operator = (typeof OPERATORS)[number]
type GameState = 'start' | 'playing' | 'gameover'

type Question = {
  text: string
  answer: number
  operator: Operator
  a: number
  b: number
}

type Feedback = { type: 'good' | 'bad'; text: string } | null

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function getLevel(score: number) {
  return Math.max(1, Math.floor(score / 50) + 1)
}

function calculatePoints(level: number, streak: number) {
  const streakBonus = streak >= 4 ? 10 : 0
  return 10 + level * 2 + streakBonus
}

function createQuestion(level: number, forcedOperator?: Operator): Question {
  const operator = forcedOperator ?? OPERATORS[randomInt(0, OPERATORS.length - 1)]
  let a = randomInt(1, 8 + level * 2)
  let b = randomInt(1, 8 + level * 2)

  if (operator === '-') {
    if (b > a) [a, b] = [b, a]
    return { text: `${a} - ${b}`, answer: a - b, operator, a, b }
  }

  if (operator === 'x') {
    a = randomInt(2, Math.min(12, 4 + level))
    b = randomInt(2, Math.min(12, 4 + level))
    return { text: `${a} x ${b}`, answer: a * b, operator, a, b }
  }

  return { text: `${a} + ${b}`, answer: a + b, operator, a, b }
}

const monsterEmoji: Record<string, string> = {
  zombie: '🧟',
  alien: '👾',
  dragon: '🐉',
  dino: '🦖',
  ogre: '👹',
  robot: '🤖',
  troll: '🧌',
}

export function MathMonsterGame() {
  const [gameState, setGameState] = useState<GameState>('start')
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [lives, setLives] = useState(START_LIVES)
  const [time, setTime] = useState(START_TIME)
  const [answer, setAnswer] = useState('')
  const [feedback, setFeedback] = useState<Feedback>(null)
  const [monsterIndex, setMonsterIndex] = useState(0)
  const [question, setQuestion] = useState<Question>(() => createQuestion(1))

  const level = useMemo(() => getLevel(score), [score])
  const monster = monsterEmoji[MONSTERS[monsterIndex % MONSTERS.length]]

  useEffect(() => {
    if (gameState !== 'playing') return
    if (time <= 0 || lives <= 0) {
      setGameState('gameover')
      return
    }
    const timer = window.setInterval(() => {
      setTime((prev) => Math.max(0, prev - 1))
    }, 1000)
    return () => window.clearInterval(timer)
  }, [gameState, lives, time])

  function startGame() {
    setScore(0)
    setStreak(0)
    setLives(START_LIVES)
    setTime(START_TIME)
    setAnswer('')
    setFeedback(null)
    setMonsterIndex(randomInt(0, MONSTERS.length - 1))
    setQuestion(createQuestion(1))
    setGameState('playing')
  }

  function nextQuestion(newScore = score) {
    setQuestion(createQuestion(getLevel(newScore)))
    setAnswer('')
    setMonsterIndex((prev) => prev + 1)
  }

  function submitAnswer(event: React.FormEvent) {
    event.preventDefault()
    if (gameState !== 'playing') return
    const numericAnswer = Number(answer)
    if (Number.isNaN(numericAnswer) || answer.trim() === '') return

    if (numericAnswer === question.answer) {
      const points = calculatePoints(level, streak)
      const newScore = score + points
      setScore(newScore)
      setStreak((prev) => prev + 1)
      setFeedback({ type: 'good', text: `Nice! +${points} points` })
      nextQuestion(newScore)
    } else {
      const newLives = lives - 1
      setLives(newLives)
      setStreak(0)
      setFeedback({ type: 'bad', text: `Oops. Correct answer: ${question.answer}` })
      if (newLives <= 0) window.setTimeout(() => setGameState('gameover'), 350)
      else nextQuestion()
    }

    window.setTimeout(() => setFeedback(null), 900)
  }

  return (
    <main className="min-h-[560px] rounded-jac-xl bg-gradient-to-br from-slate-950 via-violet-950 to-slate-900 p-4 text-white md:p-6">
      <div className="mx-auto w-full max-w-3xl">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-violet-200">Quick minigame</p>
          <h1 className="text-3xl font-black md:text-5xl">{gameState === 'gameover' ? 'Monster wins...' : 'Math Monster'}</h1>
          <p className="mt-2 text-sm text-slate-300">Answer correctly to smash monsters. Build streaks and climb your score.</p>
        </div>

        {gameState === 'start' ? (
          <section className="grid gap-4 md:grid-cols-[1fr_180px] md:items-center">
            <div className="rounded-jac-lg border border-white/12 bg-black/25 p-5">
              <h2 className="mb-2 text-xl font-bold">Rules</h2>
              <p className="mb-4 text-sm text-slate-300">
                You have {START_TIME} seconds and {START_LIVES} lives. Correct answers give points. Streaks give bonus points.
              </p>
              <button onClick={startGame} className="rounded-jac-md bg-violet-500 px-5 py-3 font-bold hover:bg-violet-400">
                Start game
              </button>
            </div>
            <div className="text-center text-7xl">👾</div>
          </section>
        ) : null}

        {gameState === 'playing' ? (
          <section>
            <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
              <Stat icon="🏆" label="Score" value={score} />
              <Stat icon="⚡" label="Streak" value={streak} />
              <Stat icon="⏱️" label="Time" value={`${time}s`} />
              <Stat icon="❤️" label="Lives" value={lives} />
            </div>

            <div className="grid gap-6 md:grid-cols-[180px_1fr] md:items-center">
              <div className="relative text-center">
                <div className="text-8xl md:text-9xl">{monster}</div>
                {feedback ? (
                  <div
                    className={`absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-sm font-bold ${
                      feedback.type === 'good' ? 'bg-emerald-400 text-emerald-950' : 'bg-rose-400 text-rose-950'
                    }`}
                  >
                    {feedback.text}
                  </div>
                ) : null}
              </div>
              <div className="rounded-jac-lg border border-white/12 bg-black/25 p-5 md:p-7">
                <p className="text-xs font-bold uppercase tracking-widest text-violet-200">Level {level}</p>
                <h2 className="my-4 text-5xl font-black md:text-6xl">{question.text}</h2>
                <form onSubmit={submitAnswer} className="flex gap-2">
                  <input
                    autoFocus
                    value={answer}
                    onChange={(event) => setAnswer(event.target.value)}
                    inputMode="numeric"
                    placeholder="Answer"
                    className="h-12 w-full rounded-jac-md border-0 bg-white px-4 text-lg text-slate-950"
                  />
                  <button type="submit" className="h-12 rounded-jac-md bg-violet-500 px-5 font-bold hover:bg-violet-400">
                    Hit
                  </button>
                </form>
              </div>
            </div>
          </section>
        ) : null}

        {gameState === 'gameover' ? (
          <section className="py-8 text-center">
            <div className="mb-4 text-7xl">🏆</div>
            <p className="text-slate-300">Your score</p>
            <h2 className="mb-6 text-6xl font-black">{score}</h2>
            <button onClick={startGame} className="rounded-jac-md bg-violet-500 px-6 py-3 font-bold hover:bg-violet-400">
              Play again
            </button>
          </section>
        ) : null}
      </div>
    </main>
  )
}

function Stat({ icon, label, value }: { icon: string; label: string; value: string | number }) {
  return (
    <div className="rounded-jac-md border border-white/12 bg-white/10 p-3">
      <div className="mb-1 flex items-center gap-2 text-xs font-medium text-violet-200">
        <span>{icon}</span>
        <span>{label}</span>
      </div>
      <div className="text-2xl font-black">{value}</div>
    </div>
  )
}

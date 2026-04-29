'use client'

import { useCallback, useEffect, useState } from 'react'
import { Brain, Play, RotateCcw, Star, Timer, Trophy } from 'lucide-react'

const GAME_TIME = 60

type GameState = 'start' | 'playing' | 'gameover'
type Feedback = 'correct' | 'wrong' | null

type Problem = {
  display: string
  answer: number
}

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function MathQuickfireGame() {
  const [gameState, setGameState] = useState<GameState>('start')
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(GAME_TIME)
  const [currentProblem, setCurrentProblem] = useState<Problem | null>(null)
  const [options, setOptions] = useState<number[]>([])
  const [streak, setStreak] = useState(0)
  const [feedback, setFeedback] = useState<Feedback>(null)
  const [level, setLevel] = useState(0)

  const generateProblem = useCallback((currentScore: number) => {
    let display = '1 + 1'
    let answer = 2

    const currentLevel = Math.floor(currentScore / 50)
    setLevel(currentLevel)

    let problemType: number
    if (currentLevel === 0) {
      problemType = randomInt(1, 3)
    } else if (currentLevel === 1) {
      problemType = randomInt(1, 5)
    } else if (currentLevel === 2) {
      problemType = randomInt(3, 7)
    } else {
      problemType = randomInt(5, 9)
    }

    switch (problemType) {
      case 1:
        if (Math.random() > 0.5) {
          const a = randomInt(10, 50 + currentLevel * 10)
          const b = randomInt(10, 50 + currentLevel * 10)
          display = `${a} + ${b}`
          answer = a + b
        } else {
          const a = randomInt(20, 100 + currentLevel * 10)
          const b = randomInt(5, a - 1)
          display = `${a} - ${b}`
          answer = a - b
        }
        break
      case 2: {
        const m1 = randomInt(3, 12)
        const m2 = randomInt(3, 12 + Math.floor(currentLevel / 2))
        display = `${m1} x ${m2}`
        answer = m1 * m2
        break
      }
      case 3: {
        const d2 = randomInt(3, 12)
        const ans = randomInt(3, 12)
        const d1 = d2 * ans
        display = `${d1} / ${d2}`
        answer = ans
        break
      }
      case 4: {
        const b1 = randomInt(2, 15)
        const b2 = randomInt(2, 10)
        const b3 = randomInt(2, 10)
        display = `${b1} + ${b2} x ${b3}`
        answer = b1 + b2 * b3
        break
      }
      case 5: {
        const percentages = [10, 20, 25, 50, 75]
        const p = percentages[randomInt(0, percentages.length - 1)]
        const value = randomInt(2, 20) * 10
        display = `${p}% of ${value}`
        answer = (p / 100) * value
        break
      }
      case 6: {
        const x = randomInt(2, 12)
        const coef = randomInt(2, 9)
        display = `${coef}x = ${coef * x}, x = ?`
        answer = x
        break
      }
      case 7: {
        const x2 = randomInt(2, 10)
        const c2 = randomInt(2, 6)
        const offset = randomInt(1, 20)
        display = `${c2}x + ${offset} = ${c2 * x2 + offset}, x = ?`
        answer = x2
        break
      }
      case 8: {
        const root = randomInt(4, 15)
        display = `sqrt(${root * root})`
        answer = root
        break
      }
      case 9: {
        const base = randomInt(2, 9)
        display = `${base}^2`
        answer = base * base
        break
      }
    }

    const wrongAnswers = new Set<number>()
    while (wrongAnswers.size < 3) {
      const errorMargin = randomInt(1, Math.max(10, Math.floor(answer * 0.3)))
      let wrong = Math.random() > 0.5 ? answer + errorMargin : answer - errorMargin
      if (answer >= 0 && wrong < 0) wrong = answer + errorMargin + 2
      if (wrong !== answer) wrongAnswers.add(Math.round(wrong))
    }

    const allOptions = [answer, ...Array.from(wrongAnswers)]
    for (let i = allOptions.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[allOptions[i], allOptions[j]] = [allOptions[j], allOptions[i]]
    }

    setCurrentProblem({ display, answer })
    setOptions(allOptions)
  }, [])

  function startGame() {
    setScore(0)
    setStreak(0)
    setLevel(0)
    setTimeLeft(GAME_TIME)
    setGameState('playing')
    setFeedback(null)
    generateProblem(0)
  }

  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | undefined
    if (gameState === 'playing' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    } else if (timeLeft === 0 && gameState === 'playing') {
      setGameState('gameover')
      if (score > highScore) setHighScore(score)
    }
    return () => {
      if (timer) clearInterval(timer)
    }
  }, [gameState, highScore, score, timeLeft])

  function handleAnswer(selectedOption: number) {
    if (!currentProblem) return

    if (selectedOption === currentProblem.answer) {
      const pointsEarned = 10 + streak * 2
      const newScore = score + pointsEarned
      setScore(newScore)
      setStreak((prev) => prev + 1)
      setFeedback('correct')

      if ((streak + 1) % 5 === 0) {
        setTimeLeft((prev) => Math.min(prev + 5, 99))
      }

      setTimeout(() => {
        setFeedback(null)
        generateProblem(newScore)
      }, 300)
    } else {
      setStreak(0)
      setFeedback('wrong')
      setTimeLeft((prev) => Math.max(prev - 3, 0))
      setTimeout(() => {
        setFeedback(null)
      }, 400)
    }
  }

  return (
    <div className="w-full rounded-jac-xl border border-jac-navy/14 bg-slate-900 text-slate-100 shadow-[0_10px_28px_-16px_rgba(15,23,42,0.7)]">
      <div className="border-b border-slate-700 p-6 text-center">
        <h3 className="inline-flex items-center justify-center gap-2 text-2xl font-extrabold text-cyan-300">
          <Brain className="h-7 w-7" />
          Math Quickfire
        </h3>
      </div>

      {gameState === 'start' && (
        <div className="space-y-5 p-6 text-center">
          <p className="text-slate-200">Test your speed. Problems get harder as your score goes up.</p>
          <div className="rounded-jac-md bg-slate-800/70 p-4 text-left text-sm text-slate-300">
            <p>You have {GAME_TIME} seconds.</p>
            <p>Build streaks for bonus points and extra time.</p>
            <p>Wrong answers cost 3 seconds.</p>
          </div>
          <button
            onClick={startGame}
            className="inline-flex w-full items-center justify-center gap-2 rounded-jac-md bg-gradient-to-r from-cyan-600 to-blue-600 px-5 py-3 text-lg font-bold text-white hover:from-cyan-500 hover:to-blue-500"
          >
            <Play className="h-5 w-5" /> Start game
          </button>
        </div>
      )}

      {gameState === 'playing' && currentProblem && (
        <div className="p-6">
          <div className="mb-6 flex items-center justify-between rounded-jac-md bg-slate-800/80 p-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400">Score</p>
              <p className="inline-flex items-center gap-2 text-xl font-bold text-cyan-300">
                <Trophy className="h-5 w-5" /> {score}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs uppercase tracking-wide text-slate-400">Level</p>
              <p className="text-lg font-bold">{level + 1}</p>
            </div>
            <div className="text-right">
              <p className="text-xs uppercase tracking-wide text-slate-400">Time</p>
              <p className={`inline-flex items-center gap-2 text-xl font-bold ${timeLeft <= 10 ? 'text-red-400' : 'text-blue-300'}`}>
                {timeLeft}s <Timer className="h-5 w-5" />
              </p>
            </div>
          </div>

          <div className="mb-4 h-6">
            {streak > 1 ? (
              <p className="inline-flex items-center gap-1 font-semibold text-yellow-300">
                <Star className="h-4 w-4" /> {streak} in a row
              </p>
            ) : null}
          </div>

          <div
            className={`mb-8 w-full text-center text-5xl font-black tracking-tight ${
              feedback === 'correct' ? 'text-green-400' : feedback === 'wrong' ? 'animate-shake text-red-400' : 'text-white'
            }`}
          >
            {currentProblem.display}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {options.map((option) => (
              <button
                key={option}
                onClick={() => handleAnswer(option)}
                disabled={feedback !== null}
                className="rounded-jac-md border border-slate-600 bg-slate-700 py-5 text-2xl font-bold hover:border-cyan-400 hover:bg-blue-600 disabled:opacity-70"
              >
                {option}
              </button>
            ))}
          </div>

          <div className="mt-6 h-2 w-full overflow-hidden rounded-full bg-slate-700">
            <div
              className={`${timeLeft <= 10 ? 'bg-red-500' : 'bg-gradient-to-r from-cyan-500 to-blue-500'} h-full transition-all duration-1000`}
              style={{ width: `${(timeLeft / GAME_TIME) * 100}%` }}
            />
          </div>
        </div>
      )}

      {gameState === 'gameover' && (
        <div className="space-y-6 p-6 text-center">
          <h4 className="text-3xl font-black">Time is up!</h4>
          <div className="rounded-jac-lg border border-slate-600 bg-slate-800/80 p-5">
            <p className="text-xs uppercase tracking-wider text-slate-400">Your score</p>
            <p className="text-6xl font-black text-cyan-300">{score}</p>
            <p className="mt-2 inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-3 py-1 font-semibold text-blue-300">
              <Trophy className="h-4 w-4" /> High score: {highScore}
            </p>
          </div>
          <button
            onClick={startGame}
            className="inline-flex w-full items-center justify-center gap-2 rounded-jac-md bg-white px-5 py-3 text-lg font-bold text-slate-900 hover:bg-cyan-50"
          >
            <RotateCcw className="h-5 w-5" /> Play again
          </button>
        </div>
      )}

      <style jsx>{`
        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-10px);
          }
          50% {
            transform: translateX(10px);
          }
          75% {
            transform: translateX(-10px);
          }
        }
        .animate-shake {
          animation: shake 0.3s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
        }
      `}</style>
    </div>
  )
}

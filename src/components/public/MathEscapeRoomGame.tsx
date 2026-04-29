'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  Box,
  Calculator,
  ChevronRight,
  Clock,
  Cpu,
  Crosshair,
  Database,
  DoorOpen,
  FileText,
  Key,
  Lightbulb,
  Lock,
  Monitor,
  ShieldAlert,
  Triangle,
  Unlock,
  Zap,
} from 'lucide-react'

type Theme = {
  primary: string
  bg: string
  border: string
  glow: string
  grid: string
  doorColor: string
}

type Puzzle = {
  id: string
  x: number
  y: number
  icon: typeof Monitor
  title: string
  description: string
  answer: string
  hint: string
  solved: boolean
}

type Room = {
  id: number
  title: string
  spawnPos: { x: number; y: number }
  doorPos: { x: number; y: number }
  doorUnlocked: boolean
  puzzles: Puzzle[]
}

const THEMES: Theme[] = [
  {
    primary: 'text-emerald-500',
    bg: 'bg-emerald-600',
    border: 'border-emerald-500',
    glow: 'shadow-[0_0_20px_rgba(16,185,129,0.5)]',
    grid: '#064e3b',
    doorColor: 'bg-neutral-700',
  },
  {
    primary: 'text-amber-500',
    bg: 'bg-amber-600',
    border: 'border-amber-500',
    glow: 'shadow-[0_0_20px_rgba(245,158,11,0.5)]',
    grid: '#78350f',
    doorColor: 'bg-neutral-700',
  },
  {
    primary: 'text-red-500',
    bg: 'bg-red-600',
    border: 'border-red-500',
    glow: 'shadow-[0_0_20px_rgba(239,68,68,0.5)]',
    grid: '#7f1d1d',
    doorColor: 'bg-neutral-700',
  },
  {
    primary: 'text-violet-400',
    bg: 'bg-violet-600',
    border: 'border-violet-500',
    glow: 'shadow-[0_0_20px_rgba(139,92,246,0.5)]',
    grid: '#4c1d95',
    doorColor: 'bg-yellow-600',
  },
]

const INITIAL_ROOMS: Room[] = [
  {
    id: 0,
    title: 'Room 1: Server Room',
    spawnPos: { x: 10, y: 50 },
    doorPos: { x: 90, y: 50 },
    doorUnlocked: false,
    puzzles: [
      {
        id: 'p1_1',
        x: 30,
        y: 20,
        icon: Monitor,
        title: 'Main Terminal',
        description:
          'The terminal flashes this sequence:\n2, 6, 18, 54, ...\n\nWhat is the next number?',
        answer: '162',
        hint: 'Look at how you go from 2 to 6 and 6 to 18. The same multiplication repeats.',
        solved: false,
      },
      {
        id: 'p1_2',
        x: 60,
        y: 80,
        icon: Cpu,
        title: 'Cooling System',
        description: 'Solve the equation to restart the fan:\n\n2x + 10 = 50\n\nWhat is x?',
        answer: '20',
        hint: 'Subtract 10 first, then divide by 2.',
        solved: false,
      },
      {
        id: 'p1_3',
        x: 70,
        y: 30,
        icon: Database,
        title: 'Data Compression',
        description:
          'The server has 400 TB total.\nHow many terabytes is 15% of the total space?',
        answer: '60',
        hint: 'Find 10% first (40), then 5%, then combine.',
        solved: false,
      },
    ],
  },
  {
    id: 1,
    title: 'Room 2: Office',
    spawnPos: { x: 10, y: 50 },
    doorPos: { x: 90, y: 50 },
    doorUnlocked: false,
    puzzles: [
      {
        id: 'p2_1',
        x: 30,
        y: 80,
        icon: FileText,
        title: 'Encrypted Sticky Note',
        description:
          'A sticky note says:\n"Solve for x."\n\n4(x + 3) - 2x = 22',
        answer: '5',
        hint: 'Expand first, then gather x terms on one side.',
        solved: false,
      },
      {
        id: 'p2_2',
        x: 50,
        y: 20,
        icon: Calculator,
        title: 'Auditor Calculator',
        description: 'One-third of a number is 15.\n\nWhat is the number?',
        answer: '45',
        hint: 'If 1/3 is 15, multiply by 3.',
        solved: false,
      },
      {
        id: 'p2_3',
        x: 80,
        y: 70,
        icon: Box,
        title: 'Desk Area',
        description:
          'A rectangle has perimeter 20 m. Length is 6 m.\n\nWhat is the area (m²)?',
        answer: '24',
        hint: 'Use perimeter: 2L + 2W = 20. Then area = L * W.',
        solved: false,
      },
    ],
  },
  {
    id: 2,
    title: 'Room 3: Laser Grid',
    spawnPos: { x: 10, y: 50 },
    doorPos: { x: 90, y: 50 },
    doorUnlocked: false,
    puzzles: [
      {
        id: 'p3_1',
        x: 50,
        y: 50,
        icon: Crosshair,
        title: 'Laser Control',
        description:
          'A right triangle has legs 3 m and 4 m.\n\nWhat is the hypotenuse?',
        answer: '5',
        hint: 'Use Pythagoras: a² + b² = c².',
        solved: false,
      },
      {
        id: 'p3_2',
        x: 30,
        y: 20,
        icon: Triangle,
        title: 'Prism Angle',
        description:
          'A triangle has angles 45° and 60°.\n\nWhat is the third angle?',
        answer: '75',
        hint: 'Triangle angles always sum to 180°.',
        solved: false,
      },
      {
        id: 'p3_3',
        x: 70,
        y: 80,
        icon: Zap,
        title: 'Energy Circuit',
        description: 'What is 5^3 minus 25?',
        answer: '100',
        hint: '5^3 = 5 * 5 * 5.',
        solved: false,
      },
    ],
  },
  {
    id: 3,
    title: 'Room 4: Vault Core',
    spawnPos: { x: 10, y: 50 },
    doorPos: { x: 90, y: 50 },
    doorUnlocked: false,
    puzzles: [
      {
        id: 'p4_1',
        x: 30,
        y: 40,
        icon: ShieldAlert,
        title: 'Combination Panel',
        description:
          '3-digit code clues:\n1) Smallest prime number\n2) Square root of 64\n3) 2^3\n\nWhat is the code?',
        answer: '288',
        hint: 'Remember: 1 is not a prime number.',
        solved: false,
      },
      {
        id: 'p4_2',
        x: 60,
        y: 20,
        icon: Box,
        title: 'Probability Lock',
        description:
          'You roll two standard 6-sided dice.\n\nHow many total outcomes are possible?',
        answer: '36',
        hint: 'For each result on die one, there are 6 results on die two.',
        solved: false,
      },
      {
        id: 'p4_3',
        x: 70,
        y: 70,
        icon: Key,
        title: 'Golden Key',
        description: 'What is 1/4 of 200 plus sqrt(100)?',
        answer: '60',
        hint: 'Find each part, then add.',
        solved: false,
      },
    ],
  },
]

type GameState = 'start' | 'playing' | 'escaped'
type ModalState = 'puzzle' | 'locked_door' | null

export function MathEscapeRoomGame() {
  const [gameState, setGameState] = useState<GameState>('start')
  const [rooms, setRooms] = useState<Room[]>(INITIAL_ROOMS)
  const [currentRoomIndex, setCurrentRoomIndex] = useState(0)
  const [playerPos, setPlayerPos] = useState({ x: 10, y: 50 })
  const [isMoving, setIsMoving] = useState(false)
  const [moveDuration, setMoveDuration] = useState(0)
  const [activeModal, setActiveModal] = useState<ModalState>(null)
  const [activePuzzleId, setActivePuzzleId] = useState<string | null>(null)
  const [inputValue, setInputValue] = useState('')
  const [errorShake, setErrorShake] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [hintsUsed, setHintsUsed] = useState(0)
  const [timerActive, setTimerActive] = useState(false)

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined
    if (timerActive) {
      interval = setInterval(() => {
        setTimeElapsed((seconds) => seconds + 1)
      }, 1000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [timerActive])

  const currentRoom = rooms[currentRoomIndex]
  const theme = THEMES[currentRoomIndex] ?? THEMES[0]
  const activePuzzleData = useMemo(
    () => currentRoom?.puzzles.find((p) => p.id === activePuzzleId),
    [activePuzzleId, currentRoom],
  )
  const PuzzleIcon = activePuzzleData?.icon ?? Lightbulb

  function formatTime(totalSeconds: number) {
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  function closeModal() {
    setActiveModal(null)
    setActivePuzzleId(null)
    setInputValue('')
    setErrorShake(false)
    setShowHint(false)
  }

  function startGame() {
    const resetRooms = INITIAL_ROOMS.map((room) => ({
      ...room,
      doorUnlocked: false,
      puzzles: room.puzzles.map((p) => ({ ...p, solved: false })),
    }))
    setRooms(resetRooms)
    setCurrentRoomIndex(0)
    setPlayerPos(INITIAL_ROOMS[0].spawnPos)
    setGameState('playing')
    setTimeElapsed(0)
    setHintsUsed(0)
    setTimerActive(true)
    closeModal()
  }

  function walkTo(targetX: number, targetY: number, callback?: () => void) {
    if (isMoving) return
    const dist = Math.hypot(targetX - playerPos.x, targetY - playerPos.y)
    const speed = 35
    const duration = dist / speed
    setMoveDuration(duration)
    setPlayerPos({ x: targetX, y: targetY })
    setIsMoving(true)
    setTimeout(() => {
      setIsMoving(false)
      callback?.()
    }, duration * 1000)
  }

  function handleMapClick(e: React.MouseEvent<HTMLDivElement>) {
    if (activeModal || isMoving) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    walkTo(x, y)
  }

  function handleInteractableClick(
    e: React.MouseEvent<HTMLDivElement>,
    targetX: number,
    targetY: number,
    actionType: 'puzzle' | 'door',
    targetId?: string,
  ) {
    e.stopPropagation()
    if (activeModal || isMoving) return
    const dx = targetX - playerPos.x
    const dy = targetY - playerPos.y
    const dist = Math.hypot(dx, dy)
    const stopDistance = 4
    let offsetX = targetX
    let offsetY = targetY
    if (dist > stopDistance) {
      offsetX = targetX - (dx / dist) * stopDistance
      offsetY = targetY - (dy / dist) * stopDistance
    } else {
      offsetX = playerPos.x
      offsetY = playerPos.y
    }

    walkTo(offsetX, offsetY, () => {
      if (actionType === 'puzzle' && targetId) {
        const puzzle = rooms[currentRoomIndex].puzzles.find((p) => p.id === targetId)
        if (puzzle && !puzzle.solved) {
          setActiveModal('puzzle')
          setActivePuzzleId(targetId)
          setInputValue('')
          setShowHint(false)
        }
      }

      if (actionType === 'door') {
        const room = rooms[currentRoomIndex]
        if (room.doorUnlocked) {
          if (currentRoomIndex === rooms.length - 1) {
            setTimerActive(false)
            setGameState('escaped')
          } else {
            const nextRoom = currentRoomIndex + 1
            setCurrentRoomIndex(nextRoom)
            setPlayerPos(rooms[nextRoom].spawnPos)
            setMoveDuration(0)
          }
        } else {
          setActiveModal('locked_door')
        }
      }
    })
  }

  function handlePuzzleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const room = rooms[currentRoomIndex]
    const puzzleIndex = room.puzzles.findIndex((p) => p.id === activePuzzleId)
    if (puzzleIndex < 0) return
    const puzzle = room.puzzles[puzzleIndex]
    const cleanInput = inputValue.trim().toLowerCase()
    const cleanAnswer = puzzle.answer.trim().toLowerCase()

    if (cleanInput === cleanAnswer) {
      const updatedRooms = [...rooms]
      updatedRooms[currentRoomIndex].puzzles[puzzleIndex].solved = true
      const allSolved = updatedRooms[currentRoomIndex].puzzles.every((p) => p.solved)
      if (allSolved) updatedRooms[currentRoomIndex].doorUnlocked = true
      setRooms(updatedRooms)
      closeModal()
    } else {
      setErrorShake(true)
      setTimeout(() => setErrorShake(false), 500)
    }
  }

  function useHint() {
    if (!showHint) {
      setShowHint(true)
      setHintsUsed((prev) => prev + 1)
    }
  }

  return (
    <div className="h-[72vh] min-h-[620px] w-full overflow-hidden rounded-jac-xl border border-neutral-800 bg-neutral-950 text-neutral-200">
      <div className={`h-1 w-full bg-gradient-to-r from-neutral-900 via-current to-neutral-900 ${theme.primary}`} />

      {gameState === 'start' ? (
        <div className="flex h-full flex-col items-center justify-center space-y-6 p-8 text-center">
          <Monitor className="h-16 w-16 text-emerald-500" />
          <h2 className="text-4xl font-black uppercase tracking-widest text-emerald-500">System Breach</h2>
          <p className="max-w-xl text-neutral-400">
            Click to move, investigate glowing clues, solve math security puzzles, and unlock every door to escape.
          </p>
          <button
            onClick={startGame}
            className="inline-flex items-center gap-2 rounded bg-emerald-600 px-6 py-3 font-bold uppercase text-neutral-950 hover:bg-emerald-500"
          >
            <Key className="h-4 w-4" /> Start mission
          </button>
        </div>
      ) : null}

      {gameState === 'playing' ? (
        <div className="relative flex h-full flex-col">
          <div className="relative z-10 flex items-center justify-between border-b border-neutral-800 bg-neutral-950 p-3">
            <div className="flex items-center gap-3">
              <span className={`text-sm font-bold uppercase tracking-widest ${theme.primary}`}>{currentRoom.title}</span>
              <div className="flex items-center gap-1">
                {rooms.map((_, i) => (
                  <div
                    key={i}
                    className={`h-2 w-2 rounded-full ${
                      i === currentRoomIndex ? `${theme.bg} shadow-[0_0_8px_currentColor]` : i < currentRoomIndex ? 'bg-neutral-600' : 'bg-neutral-800'
                    }`}
                  />
                ))}
              </div>
            </div>
            <div className={`inline-flex items-center gap-2 text-sm font-bold ${theme.primary}`}>
              <Clock className="h-4 w-4" /> {formatTime(timeElapsed)}
            </div>
          </div>

          <div className="relative flex-1 cursor-crosshair overflow-hidden bg-neutral-950" onClick={handleMapClick}>
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `linear-gradient(${theme.grid} 1px, transparent 1px), linear-gradient(90deg, ${theme.grid} 1px, transparent 1px)`,
                backgroundSize: '40px 40px',
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 to-transparent opacity-80" />

            <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none text-8xl font-black text-neutral-800/30">
              0{currentRoomIndex + 1}
            </div>

            {currentRoom.puzzles.map((puzzle) => {
              const Icon = puzzle.icon
              return (
                <div
                  key={puzzle.id}
                  className={`absolute z-20 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-lg border-2 transition-all ${
                    puzzle.solved
                      ? 'border-neutral-600 bg-neutral-800 text-neutral-500 opacity-50'
                      : `${theme.border} ${theme.glow} ${theme.primary} animate-pulse bg-neutral-900 hover:scale-110`
                  }`}
                  style={{ left: `${puzzle.x}%`, top: `${puzzle.y}%` }}
                  onClick={(e) => handleInteractableClick(e, puzzle.x, puzzle.y, 'puzzle', puzzle.id)}
                >
                  <Icon className="h-6 w-6" />
                </div>
              )
            })}

            <div
              className={`absolute z-20 flex h-24 w-16 -translate-x-1/2 -translate-y-1/2 cursor-pointer flex-col items-center justify-center transition-all ${
                currentRoom.doorUnlocked
                  ? 'border-2 border-emerald-500 bg-emerald-900 shadow-[0_0_30px_rgba(16,185,129,0.4)]'
                  : `${theme.doorColor} border-2 border-neutral-800 opacity-90`
              }`}
              style={{ left: `${currentRoom.doorPos.x}%`, top: `${currentRoom.doorPos.y}%` }}
              onClick={(e) => handleInteractableClick(e, currentRoom.doorPos.x, currentRoom.doorPos.y, 'door')}
            >
              {currentRoom.doorUnlocked ? <DoorOpen className="h-7 w-7 text-emerald-400" /> : <Lock className="h-6 w-6 text-neutral-300" />}
            </div>

            <div
              className={`pointer-events-none absolute z-30 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center transition-all ease-linear ${isMoving ? 'animate-walk-topdown' : ''}`}
              style={{
                left: `${playerPos.x}%`,
                top: `${playerPos.y}%`,
                transitionDuration: `${moveDuration}s`,
              }}
            >
              <svg width="40" height="40" viewBox="0 0 48 48" className="drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)]">
                <rect x="8" y="16" width="8" height="16" rx="2" fill="#27272a" />
                <rect x="14" y="10" width="18" height="28" rx="6" fill="#18181b" />
                <rect x="16" y="12" width="14" height="24" rx="4" fill="#3f3f46" />
                <circle cx="28" cy="24" r="10" fill="#09090b" />
                <circle cx="28" cy="24" r="8" fill="#10b981" />
              </svg>
            </div>
          </div>

          <div className="border-t border-neutral-800 bg-neutral-900 p-2 text-center text-xs text-neutral-500">
            Click the map to move. Inspect glowing objects and solve all puzzles to unlock the door.
          </div>

          {activeModal ? (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-neutral-950/80 p-4 backdrop-blur-sm">
              {activeModal === 'locked_door' ? (
                <div className="max-w-md rounded-xl border-2 border-red-900/50 bg-neutral-900 p-8 text-center shadow-2xl">
                  <Lock className="mx-auto mb-4 h-14 w-14 text-red-500" />
                  <h3 className="mb-2 text-2xl font-bold text-white">Access denied</h3>
                  <p className="mb-8 text-neutral-400">
                    The door is locked. Solve every puzzle in this room to continue.
                  </p>
                  <button onClick={closeModal} className="rounded bg-neutral-800 px-5 py-2 text-white hover:bg-neutral-700">
                    Understood
                  </button>
                </div>
              ) : null}

              {activeModal === 'puzzle' && activePuzzleData ? (
                <div className={`relative w-full max-w-2xl rounded-xl border-2 ${theme.border} bg-neutral-900 p-6 md:p-8`}>
                  <button
                    onClick={closeModal}
                    className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-neutral-800 text-neutral-400 hover:bg-neutral-700 hover:text-white"
                  >
                    X
                  </button>
                  <div className="mb-5 flex items-center gap-3">
                    <div className={`rounded-lg border border-opacity-50 bg-neutral-950 p-3 ${theme.border}`}>
                      <PuzzleIcon className={`h-6 w-6 ${theme.primary}`} />
                    </div>
                    <h3 className={`text-xl font-bold uppercase tracking-wider ${theme.primary}`}>{activePuzzleData.title}</h3>
                  </div>
                  <div className="mb-5 rounded-lg border border-neutral-800 bg-neutral-950 p-5">
                    <p className="whitespace-pre-wrap text-neutral-300">{activePuzzleData.description}</p>
                  </div>
                  {showHint ? (
                    <div className="mb-5 flex gap-2 rounded border border-amber-900/50 bg-amber-950/30 p-3 text-amber-200">
                      <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
                      <p>{activePuzzleData.hint}</p>
                    </div>
                  ) : null}
                  <form onSubmit={handlePuzzleSubmit} className="grid gap-4">
                    <div className="relative">
                      <ChevronRight className={`absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 ${theme.primary}`} />
                      <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Enter your answer..."
                        className={`w-full rounded border-2 bg-neutral-950 py-3 pl-10 pr-3 text-lg text-white placeholder-neutral-700 ${
                          errorShake ? 'animate-shake border-red-500 text-red-400' : 'border-neutral-700'
                        }`}
                        autoFocus
                        autoComplete="off"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        onClick={useHint}
                        disabled={showHint}
                        className={`inline-flex items-center gap-1 rounded px-3 py-2 text-sm ${
                          showHint ? 'cursor-not-allowed text-neutral-600' : 'text-amber-500 hover:bg-amber-500/10'
                        }`}
                      >
                        <Lightbulb className="h-4 w-4" /> Use hint
                      </button>
                      <button
                        type="submit"
                        disabled={!inputValue.trim()}
                        className={`rounded px-6 py-2 font-bold uppercase text-neutral-950 disabled:bg-neutral-800 disabled:text-neutral-500 ${theme.bg}`}
                      >
                        Submit
                      </button>
                    </div>
                  </form>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      ) : null}

      {gameState === 'escaped' ? (
        <div className="flex h-full flex-col items-center justify-center space-y-6 p-8 text-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.5)]">
            <Unlock className="h-12 w-12 text-emerald-500" />
          </div>
          <h2 className="text-4xl font-black uppercase tracking-widest text-emerald-500">Mission complete</h2>
          <p className="max-w-md text-neutral-300">
            You solved every room and escaped the vault.
          </p>
          <div className="grid w-full max-w-md grid-cols-2 gap-4 rounded-lg border border-neutral-800 bg-neutral-950 p-5">
            <div className="text-center">
              <p className="text-xs uppercase text-neutral-500">Time used</p>
              <p className="text-2xl font-bold text-emerald-400">{formatTime(timeElapsed)}</p>
            </div>
            <div className="text-center">
              <p className="text-xs uppercase text-neutral-500">Hints used</p>
              <p className="text-2xl font-bold text-amber-400">{hintsUsed}</p>
            </div>
          </div>
          <button
            onClick={startGame}
            className="rounded border-2 border-emerald-500 px-8 py-3 font-bold uppercase tracking-wide text-emerald-400 hover:bg-emerald-600 hover:text-neutral-950"
          >
            Play again
          </button>
        </div>
      ) : null}

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
        @keyframes walk-wiggle {
          0%,
          100% {
            transform: rotate(0deg) scale(1);
          }
          25% {
            transform: rotate(8deg) scale(1.05);
          }
          75% {
            transform: rotate(-8deg) scale(0.95);
          }
        }
        .animate-walk-topdown {
          animation: walk-wiggle 0.3s infinite ease-in-out;
        }
      `}</style>
    </div>
  )
}

"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import type { Difficulty } from "@/lib/code-generator"

// Dynamic imports for optimized bundle size
const EntrancePage = dynamic(() => import("@/components/entrance-page"), { ssr: false })
const ModeSelection = dynamic(() => import("@/components/mode-selection").then(mod => mod.ModeSelection), { ssr: false })
const DifficultySelector = dynamic(() => import("@/components/difficulty-selector").then(mod => mod.DifficultySelector), { ssr: false })
const GameScreen = dynamic(() => import("@/components/game-screen").then(mod => mod.GameScreen), { ssr: false })
const EventMode = dynamic(() => import("@/components/event-mode").then(mod => mod.EventMode), { ssr: false })

type GameState = "entrance" | "mode-select" | "difficulty-select" | "playing" | "event"

export default function Page() {
  const [gameState, setGameState] = useState<GameState>("entrance")
  const [difficulty, setDifficulty] = useState<Difficulty>("beginner")

 // Handlers for game state transitions
  const handleStartGame = () => setGameState("mode-select")

  const handleModeSelect = (mode: "classic" | "event") => {
    if (mode === "classic") {
      setGameState("difficulty-select")
    } else {
      setGameState("event")
    }
  }

  const handleDifficultySelect = (level: Difficulty) => {
    setDifficulty(level)
    setGameState("playing")
  }

  const handleBackToMenu = () => setGameState("mode-select")

  return (
    <main className="min-h-screen bg-black">
      {gameState === "entrance" && (
        <EntrancePage onStart={handleStartGame} />
      )}

      {gameState === "mode-select" && (
        <ModeSelection onSelectMode={handleModeSelect} />
      )}

      {gameState === "difficulty-select" && (
        <DifficultySelector onSelect={handleDifficultySelect} />
      )}

      {gameState === "playing" && (
        <GameScreen difficulty={difficulty} isEventMode={false} onBack={handleBackToMenu} />
      )}

      {gameState === "event" && (
         <EventMode onBack={handleBackToMenu} />
      )}
    </main>
  )
}
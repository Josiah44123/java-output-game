"use client"

import { useState } from "react"
import EntrancePage from "@/components/entrance-page"
import { ModeSelection } from "@/components/mode-selection"
import { DifficultySelector } from "@/components/difficulty-selector"
import { GameScreen } from "@/components/game-screen"
import { EventMode } from "@/components/event-mode"
import type { Difficulty } from "@/lib/code-generator"

type GameState = "entrance" | "mode-select" | "difficulty-select" | "playing" | "event"

export default function Page() {
  const [gameState, setGameState] = useState<GameState>("entrance")
  const [difficulty, setDifficulty] = useState<Difficulty>("beginner")

  // Navigation Handlers
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
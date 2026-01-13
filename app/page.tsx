"use client"

import { useState } from "react"
import type { Difficulty } from "@/lib/code-generator"
import { DifficultySelector } from "@/components/difficulty-selector"
import { GameScreen } from "@/components/game-screen"
import { EventMode } from "@/components/event-mode"

type Screen = "menu" | "difficulty" | "game" | "event"

export default function Home() {
  const [screen, setScreen] = useState<Screen>("menu")
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null)

  const handleSelectDifficulty = (difficulty: Difficulty) => {
    setSelectedDifficulty(difficulty)
    setScreen("game")
  }

  const handleStartEvent = () => {
    setScreen("event")
  }

  const handleBack = () => {
    setScreen("menu")
    setSelectedDifficulty(null)
  }

  if (screen === "game" && selectedDifficulty) {
    return <GameScreen difficulty={selectedDifficulty} isEventMode={false} onBack={handleBack} />
  }

  if (screen === "event") {
    return <EventMode onBack={handleBack} />
  }

  if (screen === "difficulty") {
    return <DifficultySelector onSelect={handleSelectDifficulty} />
  }

  // Main Menu
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-12">
          <div className="inline-block mb-4 px-3 py-1 rounded-full bg-primary/20 border border-primary text-primary text-sm font-semibold">
            Java Learning Game
          </div>
          <h1 className="text-5xl font-bold mb-4 text-foreground">Guess the Java Output</h1>
          <p className="text-xl text-muted-foreground">
            Test your knowledge of Java code execution and learn how different operators, loops, and conditionals work.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => setScreen("difficulty")}
            className="group p-8 rounded-lg bg-card border-2 border-border hover:border-primary hover:bg-muted transition-all"
          >
            <div className="text-center">
              <div className="text-4xl mb-3">🎮</div>
              <h2 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                Classic Mode
              </h2>
              <p className="text-muted-foreground text-sm">Learn at your own pace with difficulty levels</p>
            </div>
          </button>

          <button
            onClick={handleStartEvent}
            className="group p-8 rounded-lg bg-card border-2 border-border hover:border-accent hover:bg-muted transition-all"
          >
            <div className="text-center">
              <div className="text-4xl mb-3">⏱️</div>
              <h2 className="text-xl font-bold text-foreground mb-2 group-hover:text-accent transition-colors">
                Event Mode
              </h2>
              <p className="text-muted-foreground text-sm">10 questions in 5 minutes - Compete for high scores</p>
            </div>
          </button>
        </div>

        <div className="mt-12 p-6 rounded-lg bg-card border border-border">
          <h3 className="font-bold text-foreground mb-3">How to Play</h3>
          <ul className="space-y-2 text-muted-foreground text-sm">
            <li className="flex gap-2">
              <span className="text-primary">•</span>
              <span>Read the Java code carefully</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">•</span>
              <span>Predict what will be printed to the console</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">•</span>
              <span>Select your answer from the 4 options</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">•</span>
              <span>Learn from explanations and improve</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

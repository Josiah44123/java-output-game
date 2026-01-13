"use client"

import type { Difficulty } from "@/lib/code-generator"

interface DifficultySelectorProps {
  onSelect: (difficulty: Difficulty) => void
}

export function DifficultySelector({ onSelect }: DifficultySelectorProps) {
  const difficulties: { level: Difficulty; label: string; description: string; color: string }[] = [
    {
      level: "beginner",
      label: "Beginner",
      description: "Simple loops, conditionals, and operators",
      color: "#4ec9b0", // Teal/Green accent
    },
    {
      level: "intermediate",
      label: "Intermediate",
      description: "Nested logic, arrays, and modulo operations",
      color: "#dcdcaa", // Yellow
    },
    {
      level: "advanced",
      label: "Advanced",
      description: "Methods, complex logic, and edge cases",
      color: "#f48771", // Orange/Red
    },
  ]

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-2xl px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-2 text-foreground">Guess the Java Output</h1>
          <p className="text-muted-foreground text-lg">Test your Java knowledge</p>
        </div>

        <div className="space-y-4 mb-8">
          {difficulties.map((diff) => (
            <button
              key={diff.level}
              onClick={() => onSelect(diff.level)}
              className="w-full p-6 rounded-lg bg-card border-2 hover:bg-muted transition-all text-left group"
              style={{
                borderColor: diff.color,
                boxShadow: `0 0 12px ${diff.color}20`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = `0 0 20px ${diff.color}40`
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = `0 0 12px ${diff.color}20`
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2
                    className="text-xl font-bold transition-colors group-hover:translate-x-1"
                    style={{ color: diff.color }}
                  >
                    {diff.label}
                  </h2>
                  <p className="text-muted-foreground text-sm mt-1">{diff.description}</p>
                </div>
                <div className="text-2xl group-hover:translate-x-1 transition-transform" style={{ color: diff.color }}>
                  →
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

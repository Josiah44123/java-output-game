"use client"

import { useCallback, useEffect, useState } from "react"
import { generateSnippet, type Difficulty, type JavaSnippet } from "@/lib/code-generator"
import { evaluateJavaOutput, generateMultipleChoiceOptions, getExplanation } from "@/lib/code-evaluator"
import { CodeCard } from "./code-card"
import { AnswerOption } from "./answer-option"
import { RotateCcw } from "lucide-react"

interface GameScreenProps {
  difficulty: Difficulty
  isEventMode: boolean
  onBack: () => void
}

export function GameScreen({ difficulty, isEventMode, onBack }: GameScreenProps) {
  const [snippet, setSnippet] = useState<JavaSnippet | null>(null)
  const [options, setOptions] = useState<string[]>([])
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [answered, setAnswered] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)
  const [score, setScore] = useState(0)
  const [questionCount, setQuestionCount] = useState(0)
  const [isEventMode_, setIsEventMode] = useState(isEventMode)

  const loadNewQuestion = useCallback(() => {
    const newSnippet = generateSnippet(difficulty)
    setSnippet(newSnippet)
    setOptions(generateMultipleChoiceOptions(newSnippet.correctOutput))
    setSelectedAnswer(null)
    setAnswered(false)
    setShowExplanation(false)
  }, [difficulty])

  useEffect(() => {
    loadNewQuestion()
  }, [loadNewQuestion])

  const handleAnswerSelect = useCallback(
    (answer: string) => {
      if (answered) return

      setSelectedAnswer(answer)
      setAnswered(true)
      setQuestionCount((prev) => prev + 1)

      if (snippet && evaluateJavaOutput(answer, snippet.correctOutput)) {
        setScore((prev) => prev + 1)
      }

      setShowExplanation(true)
    },
    [answered, snippet],
  )

  const getLabel = (index: number) => String.fromCharCode(65 + index)

  if (!snippet) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  const isCorrect = selectedAnswer && snippet && evaluateJavaOutput(selectedAnswer, snippet.correctOutput)

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Guess the Java Output</h1>
            <p className="text-muted-foreground mt-1 capitalize">{difficulty} Level</p>
          </div>
          <button
            onClick={onBack}
            className="px-4 py-2 rounded-lg bg-card border border-border hover:bg-muted transition-colors text-foreground"
          >
            Change Difficulty
          </button>
        </div>

        {/* Score Display */}
        {isEventMode_ && (
          <div className="mb-8 p-4 rounded-lg bg-card border border-border">
            <div className="text-center">
              <div className="text-sm text-muted-foreground mb-2">Score</div>
              <div className="text-4xl font-bold text-primary">
                {score}/{questionCount}
              </div>
            </div>
          </div>
        )}

        {/* Code Card */}
        <div className="mb-8">
          <CodeCard code={snippet.code} />
        </div>

        {/* Question */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-4">What is the output?</h2>
          <div className="space-y-3">
            {options.map((option, index) => (
              <AnswerOption
                key={index}
                option={option}
                label={getLabel(index)}
                isSelected={selectedAnswer === option}
                isCorrect={answered && isCorrect && selectedAnswer === option}
                isWrong={answered && !isCorrect && selectedAnswer === option}
                onClick={() => handleAnswerSelect(option)}
                disabled={answered}
              />
            ))}
          </div>
        </div>

        {/* Feedback */}
        {answered && (
          <div
            className="mb-8 p-4 rounded-lg border-2"
            style={{
              backgroundColor: isCorrect ? "rgba(34, 197, 94, 0.1)" : "rgba(239, 68, 68, 0.1)",
              borderColor: isCorrect ? "#22c55e" : "#ef4444",
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center font-bold text-white"
                style={{
                  backgroundColor: isCorrect ? "#22c55e" : "#ef4444",
                }}
              >
                {isCorrect ? "✓" : "✗"}
              </div>
              <span
                className="font-semibold"
                style={{
                  color: isCorrect ? "#22c55e" : "#ef4444",
                }}
              >
                {isCorrect ? "Correct!" : "Incorrect"}
              </span>
            </div>
            {!isCorrect && (
              <p className="text-sm mb-2">
                <span className="text-muted-foreground">Correct answer: </span>
                <span className="font-mono" style={{ color: "#22c55e" }}>
                  {snippet.correctOutput}
                </span>
              </p>
            )}
            {showExplanation && (
              <p className="text-sm text-muted-foreground italic">
                {getExplanation(snippet.code, snippet.correctOutput)}
              </p>
            )}
          </div>
        )}

        {/* Next Button */}
        {answered && (
          <button
            onClick={loadNewQuestion}
            className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Next Code
          </button>
        )}
      </div>
    </div>
  )
}

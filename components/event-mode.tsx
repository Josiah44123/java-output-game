"use client"

import { useCallback, useEffect, useState } from "react"
import { generateSnippet, type Difficulty, type JavaSnippet } from "@/lib/code-generator"
import { evaluateJavaOutput, generateMultipleChoiceOptions, getExplanation } from "@/lib/code-evaluator"
import { CodeCard } from "./code-card"
import { AnswerOption } from "./answer-option"
import { RotateCcw } from "lucide-react"

interface EventModeProps {
  onBack: () => void
}

const TOTAL_QUESTIONS = 10
const TIME_LIMIT = 300 // 5 minutes in seconds

export function EventMode({ onBack }: EventModeProps) {
  const [difficulty, setDifficulty] = useState<Difficulty>("beginner")
  const [snippet, setSnippet] = useState<JavaSnippet | null>(null)
  const [options, setOptions] = useState<string[]>([])
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [answered, setAnswered] = useState(false)
  const [score, setScore] = useState(0)
  const [questionCount, setQuestionCount] = useState(0)
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT)
  const [gameOver, setGameOver] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)

  // Timer effect
  useEffect(() => {
    if (gameOver || questionCount >= TOTAL_QUESTIONS) return

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setGameOver(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [gameOver, questionCount])

  const loadNewQuestion = useCallback(() => {
    if (questionCount >= TOTAL_QUESTIONS) {
      setGameOver(true)
      return
    }

    const newSnippet = generateSnippet(difficulty)
    setSnippet(newSnippet)
    setOptions(generateMultipleChoiceOptions(newSnippet.correctOutput))
    setSelectedAnswer(null)
    setAnswered(false)
    setShowExplanation(false)
  }, [difficulty, questionCount])

  useEffect(() => {
    loadNewQuestion()
  }, [loadNewQuestion])

  const handleAnswerSelect = useCallback(
    (answer: string) => {
      if (answered) return

      setSelectedAnswer(answer)
      setAnswered(true)

      if (snippet && evaluateJavaOutput(answer, snippet.correctOutput)) {
        setScore((prev) => prev + 1)
      }

      setShowExplanation(true)
    },
    [answered, snippet],
  )

  const handleNextQuestion = useCallback(() => {
    setQuestionCount((prev) => prev + 1)
    loadNewQuestion()
  }, [loadNewQuestion])

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getLabel = (index: number) => String.fromCharCode(65 + index)

  if (gameOver || questionCount >= TOTAL_QUESTIONS) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="max-w-2xl w-full text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">Event Complete!</h1>
          <div className="bg-card border border-border rounded-lg p-8 mb-8">
            <div className="text-6xl font-bold text-primary mb-4">
              {score}/{TOTAL_QUESTIONS}
            </div>
            <div className="text-muted-foreground text-lg mb-8">
              You answered {score} out of {TOTAL_QUESTIONS} questions correctly
            </div>
            <div className="text-sm text-muted-foreground mb-8">
              Accuracy: {Math.round((score / TOTAL_QUESTIONS) * 100)}%
            </div>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => {
                setScore(0)
                setQuestionCount(0)
                setTimeLeft(TIME_LIMIT)
                setGameOver(false)
                loadNewQuestion()
              }}
              className="flex-1 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Try Again
            </button>
            <button
              onClick={onBack}
              className="flex-1 py-3 rounded-lg bg-card border border-border text-foreground font-semibold hover:bg-muted transition-colors"
            >
              Back to Menu
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!snippet) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  const isCorrect = selectedAnswer && evaluateJavaOutput(selectedAnswer, snippet.correctOutput)

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header with Timer */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">10-Question Challenge</h1>
          </div>
          <div
            className={`text-center px-4 py-2 rounded-lg border-2 ${timeLeft < 60 ? "border-destructive bg-destructive/10" : "border-border bg-card"}`}
          >
            <div className="text-xs text-muted-foreground mb-1">Time Left</div>
            <div className={`text-2xl font-bold font-mono ${timeLeft < 60 ? "text-destructive" : "text-foreground"}`}>
              {formatTime(timeLeft)}
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">
              Question {questionCount + 1} of {TOTAL_QUESTIONS}
            </span>
            <span className="text-sm font-semibold text-primary">{score} correct</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all"
              style={{ width: `${((questionCount + 1) / TOTAL_QUESTIONS) * 100}%` }}
            />
          </div>
        </div>

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
            onClick={handleNextQuestion}
            className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            {questionCount + 1 < TOTAL_QUESTIONS ? (
              <>
                <RotateCcw className="w-4 h-4" />
                Next Code
              </>
            ) : (
              "See Results"
            )}
          </button>
        )}
      </div>
    </div>
  )
}

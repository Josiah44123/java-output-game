"use client"

import { useCallback, useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { generateSnippet, type Difficulty, type JavaSnippet } from "@/lib/code-generator"
import { evaluateJavaOutput, generateMultipleChoiceOptions, getExplanation } from "@/lib/code-evaluator"
import { CodeCard } from "./code-card"
import { AnswerOption } from "./answer-option"
import { RotateCcw, ArrowLeft, Timer, Trophy, CheckCircle2, XCircle, Terminal } from "lucide-react"
import { cn } from "@/lib/utils"

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
      <div className="min-h-screen bg-[#050508] flex items-center justify-center px-4 overflow-hidden relative">
        <div className="absolute inset-0 z-0">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[120px]" />
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-xl w-full text-center relative z-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-white/5 border border-white/10 text-purple-400 font-mono text-sm">
            <Terminal size={16} /> <span>EVENT_SIMULATION_COMPLETE</span>
          </div>

          <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500 mb-8 tracking-tighter">
            SCORE_REPORT
          </h1>
          
          <div className="bg-black/40 border border-white/10 backdrop-blur-xl rounded-2xl p-10 mb-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
            
            <div className="text-8xl font-black text-white mb-2 tracking-tighter">
              {score}<span className="text-white/20 text-4xl">/{TOTAL_QUESTIONS}</span>
            </div>
            
            <div className="text-gray-400 font-mono uppercase tracking-[0.2em] text-sm mb-8">
              Accuracy: {Math.round((score / TOTAL_QUESTIONS) * 100)}%
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-left">
                  <p className="text-[10px] font-mono text-white/30 uppercase mb-1">Time Remaining</p>
                  <p className="text-xl font-bold text-white">{formatTime(timeLeft)}</p>
               </div>
               <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-left">
                  <p className="text-[10px] font-mono text-white/30 uppercase mb-1">Rank Status</p>
                  <p className="text-xl font-bold text-purple-400">{score >= 8 ? "SENIOR" : score >= 5 ? "MID-LEVEL" : "JUNIOR"}</p>
               </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => {
                setScore(0)
                setQuestionCount(0)
                setTimeLeft(TIME_LIMIT)
                setGameOver(false)
                loadNewQuestion()
              }}
              className="flex-1 py-4 rounded-xl bg-white text-black font-black hover:bg-gray-200 transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-sm"
            >
              <RotateCcw className="w-4 h-4" />
              Re-Initialize
            </button>
            <button
              onClick={onBack}
              className="flex-1 py-4 rounded-xl bg-black border border-white/10 text-white font-black hover:bg-white/5 transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-sm"
            >
              Exit Console
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  if (!snippet) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#050508] text-purple-500">
        <Terminal className="animate-pulse mr-2" /> Initializing Simulation...
      </div>
    )
  }

  const isCorrect = selectedAnswer && evaluateJavaOutput(selectedAnswer, snippet.correctOutput)

  return (
    <div className="relative min-h-screen bg-[#050508] text-white overflow-hidden font-sans">
      
      {/* Background Effects */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:40px_40px] opacity-10" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-8">
        
        {/* Header with Timer */}
        <header className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-purple-500/50 transition-all text-gray-400 hover:text-purple-400 group"
            >
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            </button>
            
            <div>
              <h1 className="text-2xl md:text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">
                10-QUESTION CHALLENGE
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs font-mono text-purple-400 border border-purple-500/30 bg-purple-500/10 px-2 py-0.5 rounded">
                   EVENT_MODE_ACTIVE
                </span>
              </div>
            </div>
          </div>

          <div className={cn(
            "flex items-center gap-4 px-6 py-3 rounded-2xl border backdrop-blur-md transition-all duration-500",
            timeLeft < 60 ? "bg-red-500/10 border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.2)]" : "bg-black/40 border-white/10"
          )}>
            <div className={cn(
              "p-2 rounded-lg",
              timeLeft < 60 ? "bg-red-500/20 text-red-400" : "bg-purple-500/20 text-purple-400"
            )}>
              <Timer size={20} className={timeLeft < 60 ? "animate-pulse" : ""} />
            </div>
            <div className="text-right">
              <p className="text-[10px] text-white/30 font-mono uppercase">Time Remaining</p>
              <p className={cn(
                "text-2xl font-black font-mono leading-none",
                timeLeft < 60 ? "text-red-400" : "text-white"
              )}>{formatTime(timeLeft)}</p>
            </div>
          </div>
        </header>

        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-3 px-1">
            <div className="flex items-center gap-2">
               <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Question</span>
               <span className="text-lg font-black">{questionCount + 1} <span className="text-white/20">/ {TOTAL_QUESTIONS}</span></span>
            </div>
            <div className="flex items-center gap-2">
               <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Score</span>
               <span className="text-lg font-black text-purple-400">{score}</span>
            </div>
          </div>
          <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden border border-white/5">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${((questionCount + 1) / TOTAL_QUESTIONS) * 100}%` }}
              className="bg-gradient-to-r from-purple-600 to-pink-500 h-full rounded-full"
            />
          </div>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          
          <div className="lg:col-span-3 space-y-6">
            <CodeCard code={snippet.code} />

            <AnimatePresence mode="wait">
              {answered && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={cn(
                    "relative overflow-hidden p-6 rounded-xl border backdrop-blur-md",
                    isCorrect ? "bg-green-500/5 border-green-500/30" : "bg-red-500/5 border-red-500/30"
                  )}
                >
                  <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,rgba(255,255,255,0.03)_50%,transparent_100%)] bg-[size:100%_4px] animate-scanline pointer-events-none" />
                  
                  <div className="flex items-start gap-6 relative z-10">
                    <div className={cn(
                      "p-4 rounded-xl",
                      isCorrect ? "bg-green-500 text-black" : "bg-red-500 text-white"
                    )}>
                      {isCorrect ? <CheckCircle2 size={24} /> : <XCircle size={24} />}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className={cn("text-xl font-black uppercase tracking-tight mb-2", isCorrect ? "text-green-400" : "text-red-400")}>
                        {isCorrect ? "SUCCESS" : "FAILURE"}
                      </h3>
                      {!isCorrect && (
                         <div className="text-sm font-mono text-red-400/70 mb-2">
                           EXPECTED: <span className="text-green-400">{snippet.correctOutput}</span>
                         </div>
                      )}
                      <p className="text-sm text-gray-400 font-mono leading-relaxed">
                        {getExplanation(snippet.code, snippet.correctOutput)}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="lg:col-span-2 flex flex-col">
            <h2 className="text-xs font-mono text-white/30 uppercase tracking-[0.2em] mb-4">Select Output:</h2>
            <div className="space-y-3 mb-8">
              {options.map((option, index) => (
                <AnswerOption
                  key={index}
                  option={option}
                  label={getLabel(index)}
                  isSelected={selectedAnswer === option}
                  isCorrect={answered && isCorrect && selectedAnswer === option ? true : undefined}
                  isWrong={answered && !isCorrect && selectedAnswer === option}
                  onClick={() => handleAnswerSelect(option)}
                  disabled={answered}
                />
              ))}
            </div>

            {answered && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={handleNextQuestion}
                className="w-full group relative overflow-hidden rounded-xl bg-purple-600 text-white font-black py-4 hover:bg-purple-500 transition-all shadow-[0_0_20px_rgba(147,51,234,0.3)]"
              >
                 <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-white/40" />
                 <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-white/40" />
                 
                 <div className="relative flex items-center justify-center gap-3 uppercase tracking-widest text-sm">
                   {questionCount + 1 < TOTAL_QUESTIONS ? "Next Sequence" : "Review Results"}
                 </div>
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

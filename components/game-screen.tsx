"use client"

import { useCallback, useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { generateSnippet, type Difficulty, type JavaSnippet } from "@/lib/code-generator"
import { evaluateJavaOutput, generateMultipleChoiceOptions, getExplanation } from "@/lib/code-evaluator"
import { CodeCard } from "./code-card"
import { AnswerOption } from "./answer-option"
import { RotateCcw, ArrowLeft, Trophy, Terminal, CheckCircle2, XCircle } from "lucide-react"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// Utility for merging classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

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

  // Initialize first question
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
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#050508] text-cyan-500">
        <Terminal className="animate-pulse mr-2" /> Initializing...
      </div>
    )
  }

  const isCorrect = selectedAnswer && snippet ? evaluateJavaOutput(selectedAnswer, snippet.correctOutput) : undefined

  return (
    <div className="relative min-h-screen bg-[#050508] text-white overflow-hidden font-sans">
      
      {/* --- Background Effects (Consistent with other pages) --- */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-8">
        
        {/* --- Header --- */}
        <header className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-cyan-500/50 transition-all text-gray-400 hover:text-cyan-400 group"
            >
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            </button>
            
            <div>
              <h1 className="text-2xl md:text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                GUESS THE OUTPUT
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <span className={cn(
                  "text-xs font-mono uppercase px-2 py-0.5 rounded border bg-opacity-10",
                  difficulty === 'beginner' ? "border-teal-500 text-teal-400 bg-teal-500" :
                  difficulty === 'intermediate' ? "border-yellow-500 text-yellow-400 bg-yellow-500" :
                  "border-red-500 text-red-400 bg-red-500"
                )}>
                  {difficulty} Level
                </span>
                {isEventMode && (
                   <span className="text-xs font-mono text-purple-400 border border-purple-500/30 bg-purple-500/10 px-2 py-0.5 rounded">
                     EVENT_MODE
                   </span>
                )}
              </div>
            </div>
          </div>

          {/* Score Badge */}
          {isEventMode && (
            <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-black/40 border border-white/10 backdrop-blur-md">
              <div className="p-2 rounded-lg bg-yellow-500/20 text-yellow-400">
                <Trophy size={20} />
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground font-mono uppercase">Score</p>
                <p className="text-xl font-bold leading-none">{score} <span className="text-gray-600 text-sm">/ {questionCount}</span></p>
              </div>
            </div>
          )}
        </header>

        <div className="grid lg:grid-cols-5 gap-8">
          
          {/* --- Left Column: Code Display --- */}
          <div className="lg:col-span-3 space-y-6">
            <div className="relative group">
               {/* Glow effect behind code card */}
               <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-2xl blur-lg opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
               
               <div className="relative overflow-hidden rounded-xl border border-white/10 bg-[#0e0e11] shadow-2xl">
                 {/* Window Controls Decoration */}
                 <div className="flex items-center gap-2 px-4 py-3 bg-white/5 border-b border-white/5">
                   <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                   <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                   <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                   <span className="ml-2 text-xs font-mono text-white/30">Main.java</span>
                 </div>
                 
                 {/* The Code Card Component */}
                 <div className="p-1">
                    <CodeCard code={snippet.code} />
                 </div>
               </div>
            </div>

            {/* --- Feedback Section (Animated) --- */}
            <AnimatePresence mode="wait">
              {answered && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={cn(
                    "relative overflow-hidden p-6 rounded-xl border backdrop-blur-md transition-colors duration-500",
                    isCorrect 
                      ? "bg-green-500/10 border-green-500/30" 
                      : "bg-red-500/10 border-red-500/30"
                  )}
                >
                  <div className="flex items-start gap-4">
                    <div className={cn(
                      "p-3 rounded-full shadow-lg",
                      isCorrect ? "bg-green-500 text-black" : "bg-red-500 text-white"
                    )}>
                      {isCorrect ? <CheckCircle2 size={24} /> : <XCircle size={24} />}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className={cn(
                        "text-xl font-bold mb-1",
                        isCorrect ? "text-green-400" : "text-red-400"
                      )}>
                        {isCorrect ? "Compilation Successful!" : "Runtime Error (Incorrect)"}
                      </h3>
                      
                      {!isCorrect && (
                        <div className="flex items-center gap-2 text-sm mt-2 mb-3 bg-black/30 p-2 rounded border border-red-500/20">
                          <span className="text-gray-400">Expected Output:</span>
                          <span className="font-mono text-green-400 font-bold">{snippet.correctOutput}</span>
                        </div>
                      )}

                      {showExplanation && (
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.2 }}
                          className="text-sm text-gray-300 leading-relaxed border-t border-white/5 pt-3 mt-2"
                        >
                          <span className="text-cyan-400 font-bold text-xs uppercase tracking-wider block mb-1">Debugger Analysis:</span>
                          {getExplanation(snippet.code, snippet.correctOutput)}
                        </motion.div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* --- Right Column: Options & Controls --- */}
          <div className="lg:col-span-2 flex flex-col h-full">
            <div className="mb-6">
              <h2 className="text-sm font-mono text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Terminal size={14} /> Console Output Options
              </h2>
              
              <div className="space-y-3">
                {options.map((option, index) => {
                  // Determine state for styling
                  const isSelected = selectedAnswer === option
                  const isWrongSelection = answered && !isCorrect && isSelected
                  const isCorrectSelection = answered && isCorrect && isSelected
                  const isMissedCorrect = answered && !isCorrect && option === snippet.correctOutput

                  // NOTE: Passing props to your existing AnswerOption. 
                  // If AnswerOption doesn't support className, it will just use default props.
                  // Ideally AnswerOption should accept standard HTML button props or className.
                  return (
                    <div key={index} className="relative">
                      {isMissedCorrect && (
                        <div className="absolute -right-2 top-1/2 -translate-y-1/2 text-green-400 animate-pulse">
                          <ArrowLeft size={20} />
                        </div>
                      )}
                      <AnswerOption
                        option={option}
                        label={getLabel(index)}
                        isSelected={isSelected}
                        isCorrect={isCorrectSelection || (answered && option === snippet.correctOutput)} 
                        isWrong={isWrongSelection}
                        onClick={() => handleAnswerSelect(option)}
                        disabled={answered}
                      />
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Next Question Button */}
            {answered && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-auto pt-6"
              >
                <button
                  onClick={loadNewQuestion}
                  className="w-full group relative overflow-hidden rounded-xl bg-white text-black font-bold py-4 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                   <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                   <div className="relative flex items-center justify-center gap-2 group-hover:text-white transition-colors">
                     <RotateCcw size={20} className="group-hover:rotate-180 transition-transform duration-500" />
                     <span>INITIALIZE NEXT SNIPPET</span>
                   </div>
                </button>
              </motion.div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}
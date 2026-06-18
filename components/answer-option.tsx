"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface AnswerOptionProps {
  option: string
  label: string
  isSelected: boolean
  isCorrect?: boolean
  isWrong?: boolean
  onClick: () => void
  disabled: boolean
}

export function AnswerOption({ 
  option, 
  label, 
  isSelected, 
  isCorrect, 
  isWrong, 
  onClick, 
  disabled 
}: AnswerOptionProps) {
  
  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.01, x: 4 } : {}}
      whileTap={!disabled ? { scale: 0.99 } : {}}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "group relative w-full p-4 rounded-xl border transition-all duration-300 text-left overflow-hidden",
        "bg-white/5 border-white/10 hover:border-white/20",
        isSelected && !isCorrect && !isWrong && "border-cyan-500/50 bg-cyan-500/10",
        isCorrect && "border-green-500 bg-green-500/10 text-green-400",
        isWrong && "border-red-500 bg-red-500/10 text-red-400",
        disabled && !isCorrect && !isWrong && !isSelected && "opacity-50 grayscale-[0.5]",
        !disabled && "cursor-pointer"
      )}
    >
      {/* Background Glow */}
      <div className={cn(
        "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none",
        isSelected ? "bg-gradient-to-r from-cyan-500/5 to-transparent" : "bg-gradient-to-r from-white/5 to-transparent",
        isCorrect && "from-green-500/10",
        isWrong && "from-red-500/10"
      )} />

      {/* Corner Decorations */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/20 group-hover:border-white/40 transition-colors" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/20 group-hover:border-white/40 transition-colors" />

      <div className="flex items-start gap-4 relative z-10">
        {/* Label Circle/Square */}
        <div
          className={cn(
            "w-8 h-8 rounded-lg border flex items-center justify-center flex-shrink-0 mt-0.5 font-mono text-sm transition-all duration-300",
            "bg-black/40 border-white/10 text-white/40",
            isSelected && "border-cyan-500 text-cyan-400 bg-cyan-500/20 shadow-[0_0_10px_rgba(6,182,212,0.3)]",
            isCorrect && "border-green-500 text-green-400 bg-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.3)]",
            isWrong && "border-red-500 text-red-400 bg-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.3)]"
          )}
        >
          {label}
        </div>

        <div className="break-words flex-1 pt-1">
          <div className={cn(
            "font-mono text-sm tracking-tight transition-colors",
            isCorrect ? "text-green-300" : isWrong ? "text-red-300" : isSelected ? "text-cyan-300" : "text-gray-300"
          )}>
            {option}
          </div>
        </div>
        
        {/* Interaction Indicator */}
        {!disabled && (
           <div className="w-1.5 h-1.5 rounded-full bg-white/10 group-hover:bg-cyan-500/50 mt-3 transition-colors" />
        )}
      </div>
    </motion.button>
  )
}

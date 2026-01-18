"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Code2, Cpu, Flame, ChevronRight, Terminal } from "lucide-react"
import type { Difficulty } from "@/lib/code-generator"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

interface DifficultySelectorProps {
  onSelect: (difficulty: Difficulty) => void
}

export function DifficultySelector({ onSelect }: DifficultySelectorProps) {
  const [hoveredLevel, setHoveredLevel] = useState<string | null>(null)

  const difficulties = [
    {
      level: "beginner" as Difficulty,
      label: "Beginner",
      description: "Simple loops, conditionals, and operators",
      icon: Code2,
      color: "from-teal-400 to-emerald-500",
    },
    {
      level: "intermediate" as Difficulty,
      label: "Intermediate",
      description: "Nested logic, arrays, and modulo operations",
      icon: Cpu,
      color: "from-yellow-400 to-orange-500",
    },
    {
      level: "advanced" as Difficulty,
      label: "Advanced",
      description: "Methods, complex logic, and edge cases",
      icon: Flame,
      color: "from-red-500 to-rose-600",
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  }

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-[#0a0a0a] overflow-hidden text-white">
      {/* Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute top-40 -left-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-2xl px-6 relative z-10">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-muted-foreground backdrop-blur-sm">
            <Terminal size={14} /> <span>JAVA_KNOWLEDGE_CHECK.EXE</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-4 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500">
            GUESS THE OUTPUT
          </h1>
          <p className="text-muted-foreground text-lg">Select your difficulty to initialize the simulation.</p>
        </motion.div>

        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid gap-6">
          {difficulties.map((diff) => {
            const Icon = diff.icon
            const isHovered = hoveredLevel === diff.level
            return (
              <motion.button
                key={diff.level}
                variants={itemVariants}
                whileHover={{ scale: 1.02, x: 10 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelect(diff.level)}
                onMouseEnter={() => setHoveredLevel(diff.level)}
                onMouseLeave={() => setHoveredLevel(null)}
                className={cn("group relative w-full p-1 rounded-xl transition-all duration-300 bg-gradient-to-r from-transparent via-white/5 to-transparent hover:bg-gradient-to-r", diff.color)}
              >
                <div className="relative flex items-center justify-between p-6 h-full bg-[#111] rounded-[10px] border border-white/10 overflow-hidden group-hover:border-transparent transition-colors">
                  <div className={cn("absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-gradient-to-r", diff.color)} />
                  <div className="flex items-center gap-6 relative z-10">
                    <div className={cn("w-14 h-14 rounded-lg flex items-center justify-center shadow-lg transition-all duration-300 bg-[#1a1a1a] border border-white/5", isHovered ? `bg-gradient-to-br ${diff.color} text-white scale-110 rotate-3` : "text-muted-foreground")}>
                      <Icon size={28} strokeWidth={isHovered ? 2.5 : 1.5} />
                    </div>
                    <div className="text-left">
                      <h2 className={cn("text-2xl font-bold mb-1 transition-colors duration-300", isHovered ? "text-white" : "text-white/80")}>{diff.label}</h2>
                      <p className="text-muted-foreground text-sm font-medium">{diff.description}</p>
                    </div>
                  </div>
                  <div className={cn("w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300", isHovered ? "bg-white/10 translate-x-0 opacity-100" : "-translate-x-4 opacity-0")}>
                    <ChevronRight className="text-white" />
                  </div>
                </div>
              </motion.button>
            )
          })}
        </motion.div>
      </div>
    </div>
  )
}
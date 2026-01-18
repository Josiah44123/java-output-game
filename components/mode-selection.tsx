"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Gamepad2, Timer, Terminal, ChevronRight, ScanLine, BrainCircuit } from "lucide-react"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

interface ModeSelectionProps {
  onSelectMode: (mode: "classic" | "event") => void
}

export function ModeSelection({ onSelectMode }: ModeSelectionProps) {
  const [hoveredMode, setHoveredMode] = useState<"classic" | "event" | null>(null)

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-[#050508] text-white overflow-hidden p-6">
      
      {/* Background Effects */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-5xl w-full">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-cyan-400 mb-4 backdrop-blur-md">
            <ScanLine size={14} /> SYSTEM_READY
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500">
            SELECT GAME MODE
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Choose your simulation parameters.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <ModeCard
            title="Classic Mode"
            description="Learn at your own pace with adaptive difficulty levels."
            icon={Gamepad2}
            color="cyan"
            delay={0.1}
            onClick={() => onSelectMode("classic")}
            isHovered={hoveredMode === "classic"}
            onHover={setHoveredMode}
            modeKey="classic"
            features={["Unlimited Time", "Difficulty Select", "Detailed Explanations"]}
          />

          <ModeCard
            title="Event Mode"
            description="High pressure challenge. 10 questions in 5 minutes."
            icon={Timer}
            color="purple"
            delay={0.2}
            onClick={() => onSelectMode("event")}
            isHovered={hoveredMode === "event"}
            onHover={setHoveredMode}
            modeKey="event"
            features={["Strict Timer", "Global Leaderboard", "Competitive Scoring"]}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="max-w-3xl mx-auto"
        >
          <div className="rounded-xl bg-black/40 border border-white/10 backdrop-blur-md overflow-hidden">
            <div className="flex items-center gap-2 px-6 py-3 border-b border-white/5 bg-white/5">
              <Terminal size={16} className="text-muted-foreground" />
              <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Execution_Protocol.txt</span>
            </div>
            
            <div className="p-6 md:p-8">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <BrainCircuit className="text-cyan-500" /> How to Play
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <Step number="01" text="Analyze the Java code snippet carefully." />
                <Step number="02" text="Predict the output printed to the console." />
                <Step number="03" text="Select the correct answer from the options." />
                <Step number="04" text="Review explanations to debug your knowledge." />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

function ModeCard({ title, description, icon: Icon, color, delay, onClick, isHovered, onHover, modeKey, features }: any) {
  const theme = color === "cyan" ? {
    border: "group-hover:border-cyan-500/50", glow: "bg-cyan-500", text: "group-hover:text-cyan-400", shadow: "shadow-cyan-500/20"
  } : {
    border: "group-hover:border-purple-500/50", glow: "bg-purple-500", text: "group-hover:text-purple-400", shadow: "shadow-purple-500/20"
  }

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.4 }}
      onClick={onClick}
      onMouseEnter={() => onHover(modeKey)}
      onMouseLeave={() => onHover(null)}
      className={cn("group relative text-left h-full flex flex-col rounded-2xl bg-[#0a0a0c] border border-white/10 transition-all duration-500", theme.border, isHovered ? `scale-[1.02] ${theme.shadow} shadow-2xl` : "")}
    >
      <div className={cn("absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-500", theme.glow)} />
      <div className="relative p-8 flex flex-col h-full z-10">
        <div className="flex justify-between items-start mb-6">
          <div className={cn("p-4 rounded-xl bg-white/5 transition-all duration-300", isHovered ? `${theme.glow} text-white` : "text-gray-400")}>
            <Icon size={32} />
          </div>
          <ChevronRight className={cn("transition-transform duration-300 text-white/20", isHovered ? "translate-x-1 text-white" : "")} />
        </div>
        <h3 className={cn("text-3xl font-bold text-white mb-2 transition-colors", theme.text)}>{title}</h3>
        <p className="text-gray-400 mb-8 leading-relaxed">{description}</p>
        <div className="mt-auto space-y-3">
          {features.map((feat: string, i: number) => (
            <div key={i} className="flex items-center gap-3 text-sm text-gray-500 group-hover:text-gray-300 transition-colors">
              <div className={cn("w-1.5 h-1.5 rounded-full", theme.glow)} />
              {feat}
            </div>
          ))}
        </div>
      </div>
    </motion.button>
  )
}

function Step({ number, text }: { number: string, text: string }) {
  return (
    <div className="flex items-start gap-4 p-4 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
      <span className="text-2xl font-black text-white/10 font-mono">{number}</span>
      <p className="text-gray-300 text-sm pt-1">{text}</p>
    </div>
  )
}
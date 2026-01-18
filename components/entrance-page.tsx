"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Play, Terminal, Coffee, Code } from "lucide-react"
import { clsx, type ClassValue } from "clsx" // Fixed the import typo here
import { twMerge } from "tailwind-merge"

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const codeParticles = [
  "public static void main", "System.out.println();", "ArrayList<String> list",
  "if (x != null) {", "try { } catch (e)", "int[] numbers = new int[5];",
]

interface EntrancePageProps {
  onStart: () => void
}

export default function EntrancePage({ onStart }: EntrancePageProps) {
  const [isHoveringStart, setIsHoveringStart] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-[#050508] overflow-hidden text-white font-sans">
      {/* Background Layers */}
      <div className="absolute inset-0 z-0 perspective-1000 opacity-30">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:40px_40px] [transform:rotateX(60deg)_translateY(-20%)]" />
      </div>
      
      {/* Moving Orbs */}
      <motion.div
        animate={{ x: mousePosition.x / 20, y: mousePosition.y / 20 }}
        className="absolute inset-0 z-0 pointer-events-none"
      >
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[120px]" />
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-white/5 border border-white/10 text-cyan-300 font-mono text-sm">
          <Terminal size={16} /> <span>Ready to compile your knowledge?</span>
        </div>

        <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-cyan-100 to-cyan-500 mb-6 drop-shadow-2xl">
          GUESS THE <br /> JAVA OUTPUT
        </h1>

        <button
          onClick={onStart}
          onMouseEnter={() => setIsHoveringStart(true)}
          onMouseLeave={() => setIsHoveringStart(false)}
          className="relative group mt-8"
        >
          <div className={`absolute -inset-1 rounded-2xl bg-gradient-to-r from-cyan-600 to-purple-600 blur-xl opacity-50 transition duration-500 ${isHoveringStart ? "opacity-100 inset-[-5px]" : ""}`} />
          <div className="relative flex items-center gap-4 px-12 py-6 bg-black rounded-2xl border-2 border-white/10 leading-none group-hover:border-cyan-500/50 transition-colors">
            <span className="text-3xl font-bold uppercase tracking-wide">Start Game</span>
            <Play size={28} fill="currentColor" className={isHoveringStart ? "text-cyan-400" : ""} />
          </div>
        </button>
      </div>
    </div>
  )
}
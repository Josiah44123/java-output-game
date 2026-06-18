"use client"

import { useCallback, useState } from "react"
import { Copy, Check, Terminal } from "lucide-react"
import { cn } from "@/lib/utils"

interface CodeCardProps {
  code: string
}

export function CodeCard({ code }: CodeCardProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [code])

  return (
    <div className="w-full rounded-xl border border-white/10 bg-[#0e0e11] shadow-2xl overflow-hidden group">
      {/* Header / Window Controls */}
      <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/5">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50 group-hover:bg-red-500/40 transition-colors" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50 group-hover:bg-yellow-500/40 transition-colors" />
            <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50 group-hover:bg-green-500/40 transition-colors" />
          </div>
          <div className="flex items-center gap-2 px-2 py-0.5 rounded bg-white/5 border border-white/5">
             <Terminal size={12} className="text-cyan-500/70" />
             <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Main.java</span>
          </div>
        </div>
        
        <button
          onClick={handleCopy}
          className={cn(
            "p-1.5 rounded-lg border transition-all duration-300 flex items-center gap-2",
            copied 
              ? "bg-green-500/10 border-green-500/50 text-green-400" 
              : "bg-white/5 border-white/10 text-white/40 hover:text-white/80 hover:bg-white/10"
          )}
          title={copied ? "Copied!" : "Copy code"}
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          <span className="text-[10px] font-bold uppercase tracking-tighter">
            {copied ? "Copied" : "Copy"}
          </span>
        </button>
      </div>

      {/* Code Content */}
      <div className="relative p-6 font-mono text-sm leading-relaxed overflow-x-auto min-h-[100px] animate-terminal-flicker">
        {/* Subtle Line Numbers Decoration */}
        <div className="absolute left-2 top-6 bottom-6 w-8 flex flex-col items-center text-[10px] text-white/10 select-none border-r border-white/5 pointer-events-none">
          {code.split('\n').map((_, i) => (
            <span key={i} className="leading-relaxed">{i + 1}</span>
          ))}
        </div>
        
        <pre className="pl-8 overflow-x-auto scrollbar-thin scrollbar-thumb-white/10">
          <code className="text-gray-200">
            {code.split('\n').map((line, i) => (
              <span key={i} className="block min-h-[1.5em]">{line}</span>
            ))}
          </code>
        </pre>
        
        {/* Background Subtle Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f0a_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f0a_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
      </div>
      
      {/* Footer Info */}
      <div className="px-4 py-2 bg-black/40 border-t border-white/5 flex items-center justify-between">
         <div className="flex items-center gap-3">
            <span className="text-[9px] font-mono text-white/20 uppercase tracking-wider">UTF-8</span>
            <span className="text-[9px] font-mono text-white/20 uppercase tracking-wider">Java 21</span>
         </div>
         <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[9px] font-mono text-white/40 uppercase tracking-wider">Compiler_Connected</span>
         </div>
      </div>
    </div>
  )
}

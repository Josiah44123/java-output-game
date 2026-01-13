"use client"

import { useCallback, useState } from "react"
import { Copy } from "lucide-react"

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
    <div className="w-full rounded-lg bg-card border border-border overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-muted border-b border-border">
        <span className="text-sm font-mono text-muted-foreground">Java Code</span>
        <button
          onClick={handleCopy}
          className="p-1 hover:bg-background rounded transition-colors"
          title={copied ? "Copied!" : "Copy code"}
        >
          <Copy className={`w-4 h-4 ${copied ? "text-accent" : "text-muted-foreground"}`} />
        </button>
      </div>
      <pre className="p-4 overflow-x-auto font-mono text-sm leading-relaxed">
        <code className="text-foreground">{code}</code>
      </pre>
    </div>
  )
}

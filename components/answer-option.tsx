"use client"

interface AnswerOptionProps {
  option: string
  label: string
  isSelected: boolean
  isCorrect?: boolean
  isWrong?: boolean
  onClick: () => void
  disabled: boolean
}

export function AnswerOption({ option, label, isSelected, isCorrect, isWrong, onClick, disabled }: AnswerOptionProps) {
  let bgColor = "bg-card hover:bg-muted"
  let borderColor = "border-border"
  let textColor = "text-foreground"

  if (isCorrect) {
    bgColor = "bg-green-900/30 hover:bg-green-900/40"
    borderColor = "border-green-500"
    textColor = "text-green-300"
  } else if (isWrong) {
    bgColor = "bg-destructive/20 hover:bg-destructive/25"
    borderColor = "border-destructive"
    textColor = "text-destructive"
  } else if (isSelected && !isCorrect && !isWrong) {
    bgColor = "bg-primary/20"
    borderColor = "border-primary"
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full p-4 rounded-lg border-2 text-left transition-all ${bgColor} ${borderColor} ${textColor} ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
            isSelected ? "border-primary bg-primary" : "border-border"
          }`}
        >
          {isSelected && <span className="text-primary-foreground text-sm font-bold">{label}</span>}
          {!isSelected && <span className="text-muted-foreground text-sm">{label}</span>}
        </div>
        <div className="break-words flex-1">
          <div className="font-mono text-sm">{option}</div>
        </div>
      </div>
    </button>
  )
}

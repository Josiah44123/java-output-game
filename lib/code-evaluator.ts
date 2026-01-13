export function evaluateJavaOutput(userAnswer: string, correctAnswer: string): boolean {
  // Normalize both strings: trim whitespace, handle multiple spaces
  const normalize = (str: string) => str.trim().replace(/\s+/g, " ").toLowerCase()

  return normalize(userAnswer) === normalize(correctAnswer)
}

export function generateMultipleChoiceOptions(correctOutput: string): string[] {
  const options = [correctOutput]

  // Generate plausible wrong answers
  const wrongAnswers = new Set<string>()

  // Try to parse as number for numeric variations
  const numValue = Number.parseInt(correctOutput, 10)
  if (!isNaN(numValue)) {
    wrongAnswers.add(String(numValue + 1))
    wrongAnswers.add(String(numValue - 1))
    wrongAnswers.add(String(numValue * 2))
    if (numValue > 0) wrongAnswers.add(String(numValue - 1))
  } else {
    // String-based wrong answers
    wrongAnswers.add(correctOutput === "yes" ? "no" : "yes")
    wrongAnswers.add(correctOutput.toUpperCase())
    wrongAnswers.add(correctOutput.toLowerCase() === "true" ? "false" : "true")
  }

  // Add generic wrong answers
  wrongAnswers.add("0")
  wrongAnswers.add("1")

  // Combine and shuffle
  const allAnswers = [correctOutput, ...Array.from(wrongAnswers).slice(0, 3)]

  // Fisher-Yates shuffle
  for (let i = allAnswers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[allAnswers[i], allAnswers[j]] = [allAnswers[j], allAnswers[i]]
  }

  return allAnswers
}

export function getExplanation(code: string, output: string): string {
  if (code.includes("++") && !code.includes("++i")) {
    return "Remember: the post-increment operator (n++) returns the value BEFORE incrementing, then increments the value."
  }
  if (code.includes("--i")) {
    return "The pre-decrement operator (--i) decrements the value first, then returns the new value."
  }
  if (code.includes("for") && code.includes("for")) {
    return "This is a nested loop. Count how many times the inner loop executes for each iteration of the outer loop."
  }
  if (code.includes("%")) {
    return "The modulo operator (%) returns the remainder after division. For example, 7 % 3 = 1 because 7 divided by 3 is 2 with remainder 1."
  }
  if (code.includes("if")) {
    return "This uses a conditional statement. Evaluate the condition to determine which branch executes."
  }
  return "Trace through the code step by step, keeping track of variable values as they change."
}

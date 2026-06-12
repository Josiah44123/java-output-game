export type Difficulty = "beginner" | "intermediate" | "advanced"

export interface JavaSnippet {
  code: string
  correctOutput: string
  difficulty: Difficulty
  pattern: string
}

let lastPatterns: string[] = []

function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function getRandomFromArray<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

type PatternGenerator = () => { code: string; correctOutput: string }

const generators: Record<Difficulty, Record<string, PatternGenerator>> = {
  beginner: {
    "simple-loop": () => {
      const start = getRandomNumber(1, 3)
      const end = getRandomNumber(4, 6)
      const sum = Array.from({ length: end - start + 1 }, (_, i) => start + i).reduce((a, b) => a + b, 0)
      return {
        code: `int sum = 0;\nfor (int i = ${start}; i <= ${end}; i++) {\n  sum += i;\n}\nSystem.out.println(sum);`,
        correctOutput: String(sum),
      }
    },
    "simple-if": () => {
      const num = getRandomNumber(5, 15)
      return {
        code: `int x = ${num};\nif (x > 10) {\n  System.out.println("yes");\n} else {\n  System.out.println("no");\n}`,
        correctOutput: num > 10 ? "yes" : "no",
      }
    },
    increment: () => {
      const start = getRandomNumber(1, 5)
      return {
        code: `int n = ${start};\nSystem.out.println(n++);\nSystem.out.println(n);`,
        correctOutput: `${start}\n${start + 1}`,
      }
    },
    decrement: () => {
      const start = getRandomNumber(5, 10)
      return {
        code: `int n = ${start};\nSystem.out.println(--n);\nSystem.out.println(n);`,
        correctOutput: `${start - 1}\n${start - 1}`,
      }
    },
  },
  intermediate: {
    "nested-loop": () => {
      const n = getRandomNumber(2, 4)
      return {
        code: `int result = 0;\nfor (int i = 1; i <= ${n}; i++) {\n  for (int j = 1; j <= ${n}; j++) {\n    result++;\n  }\n}\nSystem.out.println(result);`,
        correctOutput: String(n * n),
      }
    },
    "array-iteration": () => {
      const arr = [getRandomNumber(1, 5), getRandomNumber(5, 10), getRandomNumber(10, 15)]
      return {
        code: `int[] arr = {${arr.join(", ")}};\nint sum = 0;\nfor (int val : arr) {\n  sum += val;\n}\nSystem.out.println(sum);`,
        correctOutput: String(arr.reduce((a, b) => a + b, 0)),
      }
    },
    "conditional-increment": () => {
      const limit = getRandomNumber(5, 8)
      return {
        code: `int count = 0;\nfor (int i = 1; i <= ${limit}; i++) {\n  if (i % 2 == 0) {\n    count++;\n  }\n}\nSystem.out.println(count);`,
        correctOutput: String(Math.floor(limit / 2)),
      }
    },
    modulo: () => {
      const num = getRandomNumber(10, 20)
      const divisor = getRandomNumber(2, 6)
      return {
        code: `System.out.println(${num} % ${divisor});`,
        correctOutput: String(num % divisor),
      }
    },
  },
  advanced: {
    "nested-array": () => {
      const rows = getRandomNumber(2, 3)
      const cols = getRandomNumber(2, 3)
      return {
        code: `int[][] matrix = new int[${rows}][${cols}];\nfor (int i = 0; i < ${rows}; i++) {\n  for (int j = 0; j < ${cols}; j++) {\n    matrix[i][j] = i * j;\n  }\n}\nSystem.out.println(matrix[1][1]);`,
        correctOutput: String(1 * 1),
      }
    },
    "method-return": () => {
      const num = getRandomNumber(3, 10)
      return {
        code: `int result = getValue(${num});\nSystem.out.println(result);\n\nstatic int getValue(int x) {\n  if (x < 5) return x * 2;\n  return x + 10;\n}`,
        correctOutput: String(num < 5 ? num * 2 : num + 10),
      }
    },
    "edge-case": () => {
      const num = getRandomNumber(1, 5)
      const arr = Array.from({ length: num }, (_, i) => num - i)
      return {
        code: `int x = ${num};\nwhile (x > 0) {\n  System.out.print(x + " ");\n  x--;\n}`,
        correctOutput: arr.join(" ") + " ",
      }
    },
    "complex-logic": () => {
      const n = getRandomNumber(2, 5)
      let sum = 0
      for (let i = 0; i < n; i++) {
        sum += i * (i + 1)
      }
      return {
        code: `int sum = 0;\nfor (int i = 0; i < ${n}; i++) {\n  sum += i * (i + 1);\n}\nSystem.out.println(sum);`,
        correctOutput: String(sum),
      }
    },
  },
}
// Ensures we don't repeat the same pattern too frequently  
function generateUniquePattern(difficulty: Difficulty, patterns: string[]): string {
  const availablePatterns = Object.keys(generators[difficulty])
  const available = availablePatterns.filter((p) => !patterns.includes(p))
  return available.length > 0 ? getRandomFromArray(available) : getRandomFromArray(availablePatterns)
}

export function generateSnippet(difficulty: Difficulty): JavaSnippet {
  const pattern = generateUniquePattern(difficulty, lastPatterns)
  lastPatterns = [pattern, ...lastPatterns.slice(0, 3)]

  const { code, correctOutput } = generators[difficulty][pattern]()

  return { code, correctOutput, difficulty, pattern }
}

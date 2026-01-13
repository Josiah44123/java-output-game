export type Difficulty = "beginner" | "intermediate" | "advanced"

export interface JavaSnippet {
  code: string
  correctOutput: string
  difficulty: Difficulty
  pattern: string
}

// Store previously generated patterns to avoid repetition
let lastPatterns: string[] = []

function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function getRandomFromArray<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function generateUniquePattern(difficulty: Difficulty, patterns: string[]): string {
  const difficultyPatterns: Record<Difficulty, string[]> = {
    beginner: ["simple-loop", "simple-if", "increment", "decrement"],
    intermediate: ["nested-loop", "array-iteration", "conditional-increment", "modulo"],
    advanced: ["nested-array", "method-return", "edge-case", "complex-logic"],
  }

  const available = difficultyPatterns[difficulty].filter((p) => !patterns.includes(p))
  return available.length > 0 ? getRandomFromArray(available) : getRandomFromArray(difficultyPatterns[difficulty])
}

export function generateSnippet(difficulty: Difficulty): JavaSnippet {
  const pattern = generateUniquePattern(difficulty, lastPatterns)
  lastPatterns = [pattern, ...lastPatterns.slice(0, 3)]

  let code = ""
  let correctOutput = ""

  if (difficulty === "beginner") {
    if (pattern === "simple-loop") {
      const start = getRandomNumber(1, 3)
      const end = getRandomNumber(4, 6)
      code = `int sum = 0;
for (int i = ${start}; i <= ${end}; i++) {
  sum += i;
}
System.out.println(sum);`
      correctOutput = String(Array.from({ length: end - start + 1 }, (_, i) => start + i).reduce((a, b) => a + b, 0))
    } else if (pattern === "simple-if") {
      const num = getRandomNumber(5, 15)
      code = `int x = ${num};
if (x > 10) {
  System.out.println("yes");
} else {
  System.out.println("no");
}`
      correctOutput = num > 10 ? "yes" : "no"
    } else if (pattern === "increment") {
      const start = getRandomNumber(1, 5)
      code = `int n = ${start};
System.out.println(n++);
System.out.println(n);`
      correctOutput = `${start}\n${start + 1}`
    } else if (pattern === "decrement") {
      const start = getRandomNumber(5, 10)
      code = `int n = ${start};
System.out.println(--n);
System.out.println(n);`
      correctOutput = `${start - 1}\n${start - 1}`
    }
  } else if (difficulty === "intermediate") {
    if (pattern === "nested-loop") {
      const n = getRandomNumber(2, 4)
      code = `int result = 0;
for (int i = 1; i <= ${n}; i++) {
  for (int j = 1; j <= ${n}; j++) {
    result++;
  }
}
System.out.println(result);`
      correctOutput = String(n * n)
    } else if (pattern === "array-iteration") {
      const arr = [getRandomNumber(1, 5), getRandomNumber(5, 10), getRandomNumber(10, 15)]
      code = `int[] arr = {${arr.join(", ")}};
int sum = 0;
for (int val : arr) {
  sum += val;
}
System.out.println(sum);`
      correctOutput = String(arr.reduce((a, b) => a + b, 0))
    } else if (pattern === "conditional-increment") {
      const limit = getRandomNumber(5, 8)
      code = `int count = 0;
for (int i = 1; i <= ${limit}; i++) {
  if (i % 2 == 0) {
    count++;
  }
}
System.out.println(count);`
      correctOutput = String(Math.floor(limit / 2))
    } else if (pattern === "modulo") {
      const num = getRandomNumber(10, 20)
      const divisor = getRandomNumber(2, 6)
      code = `System.out.println(${num} % ${divisor});`
      correctOutput = String(num % divisor)
    }
  } else if (difficulty === "advanced") {
    if (pattern === "nested-array") {
      const rows = getRandomNumber(2, 3)
      const cols = getRandomNumber(2, 3)
      const val = getRandomNumber(1, 5)
      code = `int[][] matrix = new int[${rows}][${cols}];
for (int i = 0; i < ${rows}; i++) {
  for (int j = 0; j < ${cols}; j++) {
    matrix[i][j] = i * j;
  }
}
System.out.println(matrix[1][1]);`
      correctOutput = String(1 * 1)
    } else if (pattern === "method-return") {
      const num = getRandomNumber(3, 10)
      code = `int result = getValue(${num});
System.out.println(result);

static int getValue(int x) {
  if (x < 5) return x * 2;
  return x + 10;
}`
      correctOutput = String(num < 5 ? num * 2 : num + 10)
    } else if (pattern === "edge-case") {
      const num = getRandomNumber(1, 5)
      code = `int x = ${num};
while (x > 0) {
  System.out.print(x + " ");
  x--;
}`
      const arr = Array.from({ length: num }, (_, i) => num - i)
      correctOutput = arr.join(" ") + " "
    } else if (pattern === "complex-logic") {
      const n = getRandomNumber(2, 5)
      code = `int sum = 0;
for (int i = 0; i < ${n}; i++) {
  sum += i * (i + 1);
}
System.out.println(sum);`
      let sum = 0
      for (let i = 0; i < n; i++) {
        sum += i * (i + 1)
      }
      correctOutput = String(sum)
    }
  }

  return { code, correctOutput, difficulty, pattern }
}

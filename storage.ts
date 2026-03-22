import type { Question } from "./questions"

const STORAGE_KEYS = {
  QUESTIONS: "anxiety_test_questions",
  ANSWERS: "anxiety_test_answers",
  CURRENT_INDEX: "anxiety_test_current_index",
  PAID: "anxiety_test_paid",
  RESULT: "anxiety_test_result",
}

export interface TestState {
  questions: Question[]
  answers: Record<number, number>
  currentIndex: number
}

// 保存题目列表
export function saveQuestions(questions: Question[]): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(questions))
  }
}

// 获取题目列表
export function getQuestions(): Question[] | null {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem(STORAGE_KEYS.QUESTIONS)
    return data ? JSON.parse(data) : null
  }
  return null
}

// 保存答案
export function saveAnswer(questionId: number, score: number): void {
  if (typeof window !== "undefined") {
    const answers = getAnswers()
    answers[questionId] = score
    localStorage.setItem(STORAGE_KEYS.ANSWERS, JSON.stringify(answers))
  }
}

// 获取所有答案
export function getAnswers(): Record<number, number> {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem(STORAGE_KEYS.ANSWERS)
    return data ? JSON.parse(data) : {}
  }
  return {}
}

// 保存当前题目索引
export function saveCurrentIndex(index: number): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.CURRENT_INDEX, String(index))
  }
}

// 获取当前题目索引
export function getCurrentIndex(): number {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_INDEX)
    return data ? parseInt(data, 10) : 0
  }
  return 0
}

// 保存付费状态
export function savePaidStatus(paid: boolean): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.PAID, String(paid))
  }
}

// 获取付费状态
export function getPaidStatus(): boolean {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem(STORAGE_KEYS.PAID)
    return data === "true"
  }
  return false
}

// 保存测试结果
export function saveResult(score: number): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.RESULT, String(score))
  }
}

// 获取测试结果
export function getResult(): number | null {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem(STORAGE_KEYS.RESULT)
    return data ? parseInt(data, 10) : null
  }
  return null
}

// 清除所有测试数据（用于重新开始）
export function clearTestData(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEYS.QUESTIONS)
    localStorage.removeItem(STORAGE_KEYS.ANSWERS)
    localStorage.removeItem(STORAGE_KEYS.CURRENT_INDEX)
    localStorage.removeItem(STORAGE_KEYS.RESULT)
    // 注意：不清除付费状态
  }
}

// 检查是否有进行中的测试
export function hasOngoingTest(): boolean {
  if (typeof window !== "undefined") {
    const questions = getQuestions()
    const answers = getAnswers()
    return questions !== null && Object.keys(answers).length > 0
  }
  return false
}

// 计算总分
export function calculateScore(): number {
  const answers = getAnswers()
  return Object.values(answers).reduce((sum, score) => sum + score, 0)
}

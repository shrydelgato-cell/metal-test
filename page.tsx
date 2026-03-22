"use client"

import { useState, useEffect } from "react"
import { WelcomePage } from "@/components/welcome-page"
import { QuizPage } from "@/components/quiz-page"
import { ResultPage } from "@/components/result-page"
import { getRandomQuestions } from "@/lib/questions"
import {
  saveQuestions,
  getQuestions,
  getCurrentIndex,
  hasOngoingTest,
  clearTestData,
  saveResult,
  getResult,
} from "@/lib/storage"
import type { Question } from "@/lib/questions"

type Page = "welcome" | "quiz" | "result"

export default function AnxietyTestApp() {
  const [currentPage, setCurrentPage] = useState<Page>("welcome")
  const [questions, setQuestions] = useState<Question[]>([])
  const [startIndex, setStartIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [hasOngoing, setHasOngoing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // 检查是否有进行中的测试或已完成的结果
    const ongoing = hasOngoingTest()
    const savedResult = getResult()

    if (savedResult !== null) {
      // 有已保存的结果，直接显示结果页
      setScore(savedResult)
      setCurrentPage("result")
    }

    setHasOngoing(ongoing)
    setIsLoading(false)
  }, [])

  const handleStart = () => {
    // 清除之前的数据，开始新测试
    clearTestData()
    const newQuestions = getRandomQuestions(20)
    saveQuestions(newQuestions)
    setQuestions(newQuestions)
    setStartIndex(0)
    setCurrentPage("quiz")
  }

  const handleContinue = () => {
    // 继续上次的测试
    const savedQuestions = getQuestions()
    const savedIndex = getCurrentIndex()

    if (savedQuestions) {
      setQuestions(savedQuestions)
      setStartIndex(savedIndex)
      setCurrentPage("quiz")
    }
  }

  const handleComplete = (totalScore: number) => {
    setScore(totalScore)
    saveResult(totalScore)
    setCurrentPage("result")
  }

  const handleRestart = () => {
    clearTestData()
    setHasOngoing(false)
    setCurrentPage("welcome")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-amber-50 to-rose-50">
        <div className="text-primary text-lg">加载中...</div>
      </div>
    )
  }

  return (
    <main>
      {currentPage === "welcome" && (
        <WelcomePage
          onStart={handleStart}
          hasOngoingTest={hasOngoing}
          onContinue={handleContinue}
        />
      )}
      {currentPage === "quiz" && questions.length > 0 && (
        <QuizPage
          questions={questions}
          initialIndex={startIndex}
          onComplete={handleComplete}
        />
      )}
      {currentPage === "result" && (
        <ResultPage score={score} onRestart={handleRestart} />
      )}
    </main>
  )
}

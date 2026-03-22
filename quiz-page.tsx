"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { Question } from "@/lib/questions"
import { answerOptions } from "@/lib/questions"
import { saveAnswer, getAnswers, saveCurrentIndex } from "@/lib/storage"
import { cn } from "@/lib/utils"

interface QuizPageProps {
  questions: Question[]
  initialIndex: number
  onComplete: (score: number) => void
}

export function QuizPage({ questions, initialIndex, onComplete }: QuizPageProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [selectedOption, setSelectedOption] = useState<number | null>(null)

  const currentQuestion = questions[currentIndex]
  const totalQuestions = questions.length
  const progress = ((currentIndex + 1) / totalQuestions) * 100

  useEffect(() => {
    const savedAnswers = getAnswers()
    setAnswers(savedAnswers)
  }, [])

  useEffect(() => {
    // 加载当前题目的已选答案
    const savedAnswer = answers[currentQuestion?.id]
    setSelectedOption(savedAnswer !== undefined ? savedAnswer : null)
  }, [currentIndex, answers, currentQuestion?.id])

  const handleSelectOption = (score: number) => {
    setSelectedOption(score)
    if (currentQuestion) {
      saveAnswer(currentQuestion.id, score)
      setAnswers((prev) => ({ ...prev, [currentQuestion.id]: score }))
    }
  }

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      const newIndex = currentIndex + 1
      setCurrentIndex(newIndex)
      saveCurrentIndex(newIndex)
    } else {
      // 计算总分并完成测试
      const updatedAnswers = { ...answers }
      if (currentQuestion && selectedOption !== null) {
        updatedAnswers[currentQuestion.id] = selectedOption
      }
      const totalScore = Object.values(updatedAnswers).reduce((sum, score) => sum + score, 0)
      onComplete(totalScore)
    }
  }

  const handlePrev = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1
      setCurrentIndex(newIndex)
      saveCurrentIndex(newIndex)
    }
  }

  const isLastQuestion = currentIndex === totalQuestions - 1
  const canGoNext = selectedOption !== null

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-amber-50 to-rose-50 p-4">
      {/* 顶部进度 */}
      <div className="w-full max-w-md mx-auto mb-4">
        <div className="flex items-center justify-between mb-2 text-sm text-muted-foreground">
          <span>第 {currentIndex + 1} 题 / 共 {totalQuestions} 题</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2 rounded-full" />
      </div>

      {/* 题目卡片 */}
      <div className="flex-1 flex items-center justify-center">
        <Card className="w-full max-w-md rounded-3xl shadow-lg border-0 bg-card">
          <CardContent className="p-6">
            <h2 className="text-lg font-medium text-card-foreground mb-6 text-center leading-relaxed">
              {currentQuestion?.text}
            </h2>

            <div className="space-y-3">
              {answerOptions.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleSelectOption(option.score)}
                  className={cn(
                    "w-full p-4 rounded-xl text-left transition-all duration-200",
                    "border-2",
                    selectedOption === option.score
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-secondary/30 text-secondary-foreground hover:border-primary/50 hover:bg-secondary/50"
                  )}
                >
                  <span className="font-medium">{option.label}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 底部导航 */}
      <div className="w-full max-w-md mx-auto mt-4 flex gap-3">
        <Button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          variant="outline"
          className="flex-1 h-12 rounded-xl border-primary/30 text-primary hover:bg-primary/10 disabled:opacity-50"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          上一题
        </Button>
        <Button
          onClick={handleNext}
          disabled={!canGoNext}
          className="flex-1 h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50"
        >
          {isLastQuestion ? "查看结果" : "下一题"}
          {!isLastQuestion && <ChevronRight className="w-5 h-5 ml-1" />}
        </Button>
      </div>

      {/* 底部免责声明 */}
      <p className="mt-4 text-xs text-muted-foreground text-center max-w-sm mx-auto">
        ⚠️ 本测试仅供娱乐与自我探索，不能替代专业心理诊断
      </p>
    </div>
  )
}

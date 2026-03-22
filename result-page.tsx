"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Sparkles, RefreshCw, Lock, Unlock, Heart } from "lucide-react"
import { getPersonalityType } from "@/lib/personality-types"
import { getPaidStatus, savePaidStatus } from "@/lib/storage"

interface ResultPageProps {
  score: number
  onRestart: () => void
}

export function ResultPage({ score, onRestart }: ResultPageProps) {
  const [isPaid, setIsPaid] = useState(false)
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)

  const personalityType = getPersonalityType(score)

  useEffect(() => {
    setIsPaid(getPaidStatus())
  }, [])

  const handleUnlock = () => {
    setShowPaymentDialog(true)
  }

  const handleConfirmPayment = () => {
    // 模拟支付成功
    savePaidStatus(true)
    setIsPaid(true)
    setShowPaymentDialog(false)
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-b from-amber-50 to-rose-50 p-4 py-8">
      {/* 分数展示 */}
      <Card className="w-full max-w-md rounded-3xl shadow-lg border-0 bg-card mb-4">
        <CardHeader className="text-center pb-2">
          <div className="text-7xl mb-2">{personalityType.emoji}</div>
          <CardTitle className="text-2xl font-bold text-card-foreground">
            {personalityType.name}
          </CardTitle>
          <p className="text-3xl font-bold text-primary mt-2">
            {score} <span className="text-lg font-normal text-muted-foreground">/ 80 分</span>
          </p>
        </CardHeader>
        <CardContent>
          <div className="bg-secondary/50 rounded-2xl p-4 text-secondary-foreground leading-relaxed">
            {personalityType.freeDescription}
          </div>
        </CardContent>
      </Card>

      {/* 付费解锁区域 */}
      <Card className="w-full max-w-md rounded-3xl shadow-lg border-0 bg-card mb-4">
        <CardContent className="p-6">
          {!isPaid ? (
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2 text-primary">
                <Sparkles className="w-5 h-5" />
                <span className="font-medium">深度报告</span>
              </div>
              <p className="text-muted-foreground text-sm">
                想知道更多关于自己的解读和专属建议吗？
              </p>
              <div className="bg-secondary/30 rounded-2xl p-4 space-y-2 text-sm text-left text-muted-foreground">
                <p className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  深度性格解读（200-300字）
                </p>
                <p className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  专属行动建议（3-5条）
                </p>
                <p className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  暖心治愈小诗
                </p>
              </div>
              <Button
                onClick={handleUnlock}
                className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                解锁完整深度报告 ¥1.99
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* 深度解读 */}
              <div>
                <div className="flex items-center gap-2 text-primary mb-3">
                  <Unlock className="w-5 h-5" />
                  <span className="font-medium">深度解读</span>
                </div>
                <div className="bg-secondary/30 rounded-2xl p-4 text-secondary-foreground leading-relaxed text-sm">
                  {personalityType.paidDescription}
                </div>
              </div>

              {/* 行动建议 */}
              <div>
                <div className="flex items-center gap-2 text-primary mb-3">
                  <Sparkles className="w-5 h-5" />
                  <span className="font-medium">专属行动建议</span>
                </div>
                <div className="space-y-2">
                  {personalityType.actionTips.map((tip, index) => (
                    <div
                      key={index}
                      className="bg-secondary/30 rounded-xl p-3 text-sm text-secondary-foreground flex items-start gap-2"
                    >
                      <span className="text-primary font-medium">{index + 1}.</span>
                      <span>{tip}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 暖心小诗 */}
              <div>
                <div className="flex items-center gap-2 text-primary mb-3">
                  <Heart className="w-5 h-5" />
                  <span className="font-medium">暖心小诗</span>
                </div>
                <div className="bg-gradient-to-br from-primary/10 to-accent/30 rounded-2xl p-6 text-center">
                  <p className="text-secondary-foreground leading-loose whitespace-pre-line italic">
                    {personalityType.poem}
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 重新测试按钮 */}
      <Button
        onClick={onRestart}
        variant="outline"
        className="w-full max-w-md h-12 rounded-xl border-primary/30 text-primary hover:bg-primary/10"
      >
        <RefreshCw className="w-4 h-4 mr-2" />
        重新测试
      </Button>

      {/* 底部免责声明 */}
      <p className="mt-6 text-xs text-muted-foreground text-center max-w-sm px-4">
        ⚠️ 本测试仅供娱乐与自我探索，不能替代专业心理诊断
      </p>

      {/* 支付确认对话框 */}
      <AlertDialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <AlertDialogContent className="rounded-2xl max-w-sm mx-auto">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center">确认支付</AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              您即将解锁完整深度报告，金额为 ¥1.99
              <br />
              <span className="text-xs text-muted-foreground">
                （模拟支付，点击确认即可解锁）
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col gap-2 sm:flex-col">
            <AlertDialogAction
              onClick={handleConfirmPayment}
              className="w-full rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              确认支付 ¥1.99
            </AlertDialogAction>
            <AlertDialogCancel className="w-full rounded-xl border-primary/30 text-primary hover:bg-primary/10 m-0">
              取消
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

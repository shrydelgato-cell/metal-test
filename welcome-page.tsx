"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface WelcomePageProps {
  onStart: () => void
  hasOngoingTest: boolean
  onContinue: () => void
}

export function WelcomePage({ onStart, hasOngoingTest, onContinue }: WelcomePageProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-amber-50 to-rose-50">
      <Card className="w-full max-w-md rounded-3xl shadow-lg border-0 bg-card/95 backdrop-blur">
        <CardHeader className="text-center pb-2">
          <div className="text-6xl mb-4">🦔</div>
          <CardTitle className="text-2xl font-bold text-card-foreground">
            焦虑性格测试
          </CardTitle>
          <CardDescription className="text-base text-muted-foreground mt-2">
            找到你内心的动物人格
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-secondary/50 rounded-2xl p-4 text-sm text-secondary-foreground space-y-2">
            <p className="flex items-start gap-2">
              <span className="text-primary">📋</span>
              <span>基于 GAD-7 量表改编</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-primary">🎯</span>
              <span>60题随机抽取20题</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-primary">⏱️</span>
              <span>约3-5分钟完成</span>
            </p>
          </div>

          <div className="space-y-3">
            {hasOngoingTest ? (
              <>
                <Button
                  onClick={onContinue}
                  className="w-full h-12 text-base font-medium rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  继续上次测试
                </Button>
                <Button
                  onClick={onStart}
                  variant="outline"
                  className="w-full h-12 text-base font-medium rounded-xl border-primary/30 text-primary hover:bg-primary/10"
                >
                  重新开始
                </Button>
              </>
            ) : (
              <Button
                onClick={onStart}
                className="w-full h-12 text-base font-medium rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                开始测试
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <p className="mt-6 text-xs text-muted-foreground text-center max-w-sm px-4">
        ⚠️ 本测试仅供娱乐与自我探索，不能替代专业心理诊断
      </p>
    </div>
  )
}

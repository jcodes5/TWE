"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon?: React.ReactNode
  className?: string
}

export function StatCard({ title, value, subtitle, icon, className }: StatCardProps) {
  return (
    <Card className={cn("h-full", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{typeof value === 'number' ? value.toLocaleString() : value}</div>
        {subtitle ? (
          <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
        ) : null}
      </CardContent>
    </Card>
  )
}

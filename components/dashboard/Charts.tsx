"use client"

import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  LineChart as RLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart as RBarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts"

const COLORS = ["#10b981", "#34d399", "#6ee7b7", "#a7f3d0", "#d1fae5"]

export function LineChart({ data, xKey, yKey, label }: { data: any[]; xKey: string; yKey: string; label?: string }) {
  return (
    <ChartContainer
      config={{ [yKey]: { label: label || yKey, color: "hsl(var(--primary))" } }}
      className="min-h-[220px] w-full"
    >
      <RLineChart data={data} margin={{ left: 12, right: 12, top: 8, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xKey} tickLine={false} axisLine={false} />
        <YAxis tickLine={false} axisLine={false} />
        <ChartTooltip content={<ChartTooltipContent nameKey={yKey} />} />
        <Line type="monotone" dataKey={yKey} stroke="var(--color-amount, hsl(var(--primary)))" strokeWidth={2} dot={false} />
      </RLineChart>
    </ChartContainer>
  )
}

export function BarChart({ data, xKey, yKey, label }: { data: any[]; xKey: string; yKey: string; label?: string }) {
  return (
    <ChartContainer
      config={{ [yKey]: { label: label || yKey, color: "hsl(var(--chart-2))" } }}
      className="min-h-[220px] w-full"
    >
      <RBarChart data={data} margin={{ left: 12, right: 12, top: 8, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xKey} tickLine={false} axisLine={false} />
        <YAxis tickLine={false} axisLine={false} />
        <ChartTooltip content={<ChartTooltipContent nameKey={yKey} />} />
        <Bar dataKey={yKey} fill="hsl(var(--primary))" radius={4} />
      </RBarChart>
    </ChartContainer>
  )
}

export function DonutChart({ data, nameKey, valueKey }: { data: any[]; nameKey: string; valueKey: string }) {
  return (
    <div className="w-full min-h-[220px]">
      <ResponsiveContainer>
        <PieChart>
          <Pie data={data} dataKey={valueKey} nameKey={nameKey} innerRadius={60} outerRadius={80} paddingAngle={2}>
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <ChartLegend content={<ChartLegendContent />} />
          <ChartTooltip content={<ChartTooltipContent />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

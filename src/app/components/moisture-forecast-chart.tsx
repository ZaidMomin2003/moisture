"use client"

import { Area, AreaChart, Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"

export type DailyMoistureForecast = {
  day: string;
  high: number;
  low: number;
}

interface MoistureForecastChartProps {
  data: DailyMoistureForecast[];
}

const chartConfig = {
  high: {
    label: "High",
    color: "hsl(var(--primary))",
  },
  low: {
    label: "Low",
    color: "hsl(var(--primary) / 0.5)",
  }
} satisfies ChartConfig;


export function MoistureForecastChart({ data }: MoistureForecastChartProps) {
  return (
    <div className="h-[250px] w-full">
       <ChartContainer config={chartConfig} className="w-full h-full">
        <LineChart
          accessibilityLayer
          data={data}
          margin={{
            top: 5,
            right: 20,
            left: -10,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
          <XAxis dataKey="day" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} axisLine={{ stroke: 'hsl(var(--border))' }} tickLine={{ stroke: 'hsl(var(--border))' }} />
          <YAxis unit="%" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} axisLine={{ stroke: 'hsl(var(--border))' }} tickLine={{ stroke: 'hsl(var(--border))' }} domain={[10, 20]} />
          <Tooltip
            cursor={{ fill: 'hsl(var(--accent))' }}
            content={<ChartTooltipContent 
                formatter={(value, name) => (
                    <div className="flex items-center">
                        <div className={`h-2.5 w-2.5 rounded-full mr-2 bg-[var(--color-${name})]`}></div>
                        <span>{`${name.charAt(0).toUpperCase() + name.slice(1)}: ${value}%`}</span>
                    </div>
                )}
            />}
          />
          <Line 
            type="monotone" 
            dataKey="high" 
            stroke="var(--color-high)" 
            strokeWidth={2}
            dot={false}
            isAnimationActive={true}
            name="high"
          />
          <Line 
            type="monotone" 
            dataKey="low" 
            stroke="var(--color-low)" 
            strokeWidth={2}
            strokeDasharray="4 4"
            dot={false}
            isAnimationActive={true}
            name="low"
          />
        </LineChart>
      </ChartContainer>
    </div>
  )
}

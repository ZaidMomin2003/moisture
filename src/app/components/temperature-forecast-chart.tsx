"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"

export type DailyForecast = {
  day: string;
  high: number;
  low: number;
}

interface TemperatureForecastChartProps {
  data: DailyForecast[];
}

const chartConfig = {
  high: {
    label: "High",
    color: "#ef4444",
  },
  low: {
    label: "Low",
    color: "#3b82f6",
  },
} satisfies ChartConfig;


export function TemperatureForecastChart({ data }: TemperatureForecastChartProps) {
  return (
    <div className="h-[250px] w-full">
       <ChartContainer config={chartConfig} className="w-full h-full">
        <AreaChart
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
          <YAxis unit="°C" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} axisLine={{ stroke: 'hsl(var(--border))' }} tickLine={{ stroke: 'hsl(var(--border))' }} />
          <Tooltip
            cursor={{ fill: 'hsl(var(--accent))' }}
            content={<ChartTooltipContent 
                formatter={(value, name) => (
                    <div className="flex items-center">
                        <div className={`h-2.5 w-2.5 rounded-full mr-2 ${name === 'High' ? 'bg-red-500' : 'bg-blue-500'}`}></div>
                        <span>{`${name}: ${value}°C`}</span>
                    </div>
                )}
            />}
          />
          <defs>
            <linearGradient id="colorHigh" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-high)" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="var(--color-high)" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorLow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-low)" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="var(--color-low)" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <Area type="monotone" dataKey="high" name="High" stroke="var(--color-high)" fillOpacity={1} fill="url(#colorHigh)" />
          <Area type="monotone" dataKey="low" name="Low" stroke="var(--color-low)" fillOpacity={1} fill="url(#colorLow)" />
        </AreaChart>
      </ChartContainer>
    </div>
  )
}

"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartTooltipContent } from "@/components/ui/chart"

export type DailyForecast = {
  day: string;
  high: number;
  low: number;
}

interface TemperatureForecastChartProps {
  data: DailyForecast[];
}

export function TemperatureForecastChart({ data }: TemperatureForecastChartProps) {
  return (
    <div className="h-[250px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
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
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorLow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <Area type="monotone" dataKey="high" name="High" stroke="#ef4444" fillOpacity={1} fill="url(#colorHigh)" />
          <Area type="monotone" dataKey="low" name="Low" stroke="#3b82f6" fillOpacity={1} fill="url(#colorLow)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

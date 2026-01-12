
"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts"
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
    color: "hsl(var(--destructive))",
  },
  low: {
    label: "Low",
    color: "hsl(var(--primary))",
  }
} satisfies ChartConfig;


export function MoistureForecastChart({ data }: MoistureForecastChartProps) {
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
          <YAxis unit="%" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} axisLine={{ stroke: 'hsl(var(--border))' }} tickLine={{ stroke: 'hsl(var(--border))' }} domain={[10, 20]} />
          <Tooltip
            cursor={{ fill: 'hsl(var(--accent))' }}
            content={<ChartTooltipContent 
                formatter={(value, name) => (
                    <div className="flex items-center">
                        <div className={`h-2.5 w-2.5 rounded-full mr-2`} style={{ backgroundColor: `var(--color-${name})` }}></div>
                        <span>{`${name.charAt(0).toUpperCase() + name.slice(1)}: ${value}%`}</span>
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
              <stop offset="5%" stopColor="var(--color-low)" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="var(--color-low)" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <Area 
            type="monotone" 
            dataKey="high" 
            stroke="var(--color-high)" 
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorHigh)"
            isAnimationActive={true}
            name="High"
          />
          <Area
            type="monotone"
            dataKey="low"
            stroke="var(--color-low)"
            strokeWidth={1}
            strokeDasharray="4 4"
            fillOpacity={1}
            fill="url(#colorLow)"
            isAnimationActive={true}
            name="Low"
          />
        </AreaChart>
      </ChartContainer>
    </div>
  )
}

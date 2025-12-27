"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"

export type MoistureReading = {
  time: number;
  moisture: number;
}

interface RealTimeMoistureChartProps {
  data: MoistureReading[];
}

const chartConfig = {
  moisture: {
    label: "Moisture",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;


export function RealTimeMoistureChart({ data }: RealTimeMoistureChartProps) {
  const latestMoisture = data[data.length - 1]?.moisture;
  const domainMargin = latestMoisture ? Math.max(1, latestMoisture * 0.1) : 1;
  const yDomain: [number, number] = latestMoisture 
    ? [Math.floor(latestMoisture - domainMargin), Math.ceil(latestMoisture + domainMargin)]
    : [10, 20];
  
  if (yDomain[0] < 0) {
    yDomain[0] = 0;
  }

  return (
     <ChartContainer config={chartConfig} className="w-full h-full">
      <AreaChart
        accessibilityLayer
        data={data}
        margin={{
          top: 10,
          right: 10,
          left: -20,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" vertical={false} />
        <XAxis dataKey="time" type="number" domain={['dataMin', 'dataMax']} hide />
        <YAxis 
            domain={yDomain} 
            unit="%"
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} 
            axisLine={{ stroke: 'hsl(var(--border))' }} 
            tickLine={{ stroke: 'hsl(var(--border))' }} 
        />
        <Tooltip
          cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 1, strokeDasharray: '3 3' }}
          content={<ChartTooltipContent 
            indicator="dot"
            formatter={(value) => [`${value}%`, "Moisture"]}
            labelFormatter={(label) => `Time: ${label}s`}
          />}
        />
        <defs>
          <linearGradient id="fillMoisture" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-moisture)" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="var(--color-moisture)" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <Area 
            type="monotone" 
            dataKey="moisture" 
            stroke="var(--color-moisture)" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#fillMoisture)" 
            isAnimationActive={false}
        />
      </AreaChart>
    </ChartContainer>
  )
}

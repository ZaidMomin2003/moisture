"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"

export type DailyMoistureForecast = {
  day: string;
  predicted: number;
  confidence: [number, number];
}

interface MoistureForecastChartProps {
  data: DailyMoistureForecast[];
}

const chartConfig = {
  predicted: {
    label: "Predicted Moisture",
    color: "hsl(var(--primary))",
  },
  confidence: {
    label: "Confidence Interval",
    color: "hsl(var(--primary) / 0.1)",
    stroke: 'hsl(var(--primary) / 0.3)',
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
                formatter={(value, name, props) => {
                    if (name === 'predicted') {
                        const confidence = props.payload?.confidence || [0,0];
                        return (
                            <div>
                                <div className="flex items-center">
                                    <div className={`h-2.5 w-2.5 rounded-full mr-2 bg-[var(--color-predicted)]`}></div>
                                    <span>{`Predicted: ${value}%`}</span>
                                </div>
                                 <p className="text-xs text-muted-foreground/80 pl-4">{`Confidence: ${confidence[0]}% - ${confidence[1]}%`}</p>
                             </div>
                        );
                    }
                    return null;
                }}
            />}
          />
           <defs>
            <linearGradient id="fillPredicted" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-predicted)" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="var(--color-predicted)" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <Area
            dataKey="confidence"
            type="monotone"
            stroke="var(--color-confidence-stroke)"
            strokeWidth={1.5}
            strokeDasharray="4 4"
            fill="var(--color-confidence)"
            isAnimationActive={false}
            name="Confidence"
           />
          <Area 
            type="monotone" 
            dataKey="predicted" 
            stroke="var(--color-predicted)" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#fillPredicted)" 
            isAnimationActive={true}
            name="Predicted"
          />
        </AreaChart>
      </ChartContainer>
    </div>
  )
}

import { addDays, format } from 'date-fns';

export type DailyMoistureForecast = {
  day: string;
  predicted: number;
  confidence: [number, number]; // [min, max]
};

// Simulates a 7-day moisture forecast for grain
export function generateMoistureForecast(): DailyMoistureForecast[] {
  const forecast: DailyMoistureForecast[] = [];
  const today = new Date();
  
  // Starting point for moisture, e.g., 16%
  let currentMoisture = 16 + (Math.random() - 0.5) * 4;

  for (let i = 0; i < 7; i++) {
    const date = addDays(today, i);
    const dayName = format(date, 'E');

    // Simulate daily changes: general drying trend with some random fluctuation
    const dailyChange = -0.3 + (Math.random() - 0.4) * 1.5;
    currentMoisture += dailyChange;

    // Ensure moisture stays within a realistic range (e.g., 12% to 22%)
    if (currentMoisture < 12) currentMoisture = 12 + Math.random();
    if (currentMoisture > 22) currentMoisture = 22 - Math.random();

    // Confidence interval becomes wider for days further in the future
    const confidenceMargin = 0.5 + (i * 0.2);
    const predicted = parseFloat(currentMoisture.toFixed(1));

    forecast.push({
      day: dayName,
      predicted: predicted,
      confidence: [
        parseFloat(Math.max(12, predicted - confidenceMargin).toFixed(1)),
        parseFloat(Math.min(22, predicted + confidenceMargin).toFixed(1))
      ],
    });
  }

  return forecast;
}

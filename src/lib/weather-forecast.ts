import { addDays, format } from 'date-fns';

export type DailyForecast = {
  day: string;
  high: number;
  low: number;
};

export function generateTemperatureForecast(): DailyForecast[] {
  const forecast: DailyForecast[] = [];
  const today = new Date();
  
  let currentHigh = 20 + (Math.random() - 0.5) * 8;
  let currentLow = 10 + (Math.random() - 0.5) * 6;

  for (let i = 0; i < 7; i++) {
    const date = addDays(today, i);
    const dayName = format(date, 'E');

    currentHigh += (Math.random() - 0.5) * 3;
    currentLow += (Math.random() - 0.5) * 3;

    if (currentLow >= currentHigh - 3) {
      currentLow = currentHigh - 4 - Math.random() * 2;
    }

    forecast.push({
      day: dayName,
      high: parseFloat(currentHigh.toFixed(0)),
      low: parseFloat(currentLow.toFixed(0)),
    });
  }

  return forecast;
}

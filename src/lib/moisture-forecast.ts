import { addDays, format } from 'date-fns';

export type DailyMoistureForecast = {
  day: string;
  high: number;
  low: number;
};

export function generateMoistureForecast(): DailyMoistureForecast[] {
  const forecast: DailyMoistureForecast[] = [];
  const today = new Date();
  
  let currentHigh = 18 + (Math.random() - 0.5) * 4;
  let currentLow = 15 + (Math.random() - 0.5) * 4;


  for (let i = 0; i < 7; i++) {
    const date = addDays(today, i);
    const dayName = format(date, 'E');

    currentHigh += -0.3 + (Math.random() - 0.5) * 1.5;
    currentLow += -0.3 + (Math.random() - 0.4) * 1.5;

    if (currentHigh < 12) currentHigh = 12 + Math.random();
    if (currentHigh > 22) currentHigh = 22 - Math.random();
    if (currentLow < 11) currentLow = 11 + Math.random();
    if (currentLow > currentHigh - 1) {
      currentLow = currentHigh - 1 - Math.random();
    }


    forecast.push({
      day: dayName,
      high: parseFloat(currentHigh.toFixed(1)),
      low: parseFloat(currentLow.toFixed(1)),
    });
  }

  return forecast;
}

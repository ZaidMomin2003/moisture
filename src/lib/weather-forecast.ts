import { addDays, format } from 'date-fns';

export type DailyForecast = {
  day: string;
  high: number;
  low: number;
};

// Generates a pseudo-random 7-day temperature forecast.
export function generateTemperatureForecast(): DailyForecast[] {
  const forecast: DailyForecast[] = [];
  const today = new Date();
  
  // Base temperatures for a generic temperate climate
  let currentHigh = 20 + (Math.random() - 0.5) * 8; // Start high temp somewhere between 16-24°C
  let currentLow = 10 + (Math.random() - 0.5) * 6; // Start low temp somewhere between 7-13°C

  for (let i = 0; i < 7; i++) {
    const date = addDays(today, i);
    const dayName = format(date, 'E'); // "Mon", "Tue", etc.

    // Add some random daily variation
    currentHigh += (Math.random() - 0.5) * 3;
    currentLow += (Math.random() - 0.5) * 3;

    // Ensure high is always higher than low
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

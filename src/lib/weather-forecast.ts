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

export type WeatherData = {
  temperature: number;
  humidity: number;
  windSpeed: number;
  isRaining: boolean;
  rainProbability: number;
  locationName?: string;
};

export async function fetchWeatherData(lat: number, lng: number): Promise<WeatherData> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation&hourly=precipitation_probability&forecast_days=1`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch weather data');
  }

  const data = await response.json();

  // Fetch location name using reverse geocoding (Nominatim - free)
  let locationName = "Unknown Location";
  try {
    const geoUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;
    const geoResponse = await fetch(geoUrl, {
      headers: { 'User-Agent': 'GrainMoistureApp/1.0' }
    });
    if (geoResponse.ok) {
      const geoData = await geoResponse.json();
      locationName = geoData.address.city || geoData.address.town || geoData.address.village || geoData.address.suburb || geoData.display_name.split(',')[0];
    }
  } catch (e) {
    console.error("Reverse geocoding error:", e);
  }

  return {
    temperature: Math.round(data.current.temperature_2m),
    humidity: Math.round(data.current.relative_humidity_2m),
    windSpeed: Math.round(data.current.wind_speed_10m),
    isRaining: data.current.precipitation > 0,
    rainProbability: data.hourly.precipitation_probability[0],
    locationName,
  };
}

'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { WheatIcon, RiceIcon, MaizeIcon, LoadingSpinner } from '@/components/icons';
import { cn } from '@/lib/utils';
import { CheckCircle2, Info, XCircle, Cloud, Droplets, Thermometer, TrendingDown, Wind, MapPin } from 'lucide-react';
import { RealTimeMoistureChart, type MoistureReading } from './real-time-moisture-chart';
import { getHarvestAdvice } from '@/ai/flows/harvest-advisor-flow';
import type { HarvestAdvice } from '@/ai/flows/harvest-advisor-shared';
import { useToast } from '@/hooks/use-toast';
import { fetchWeatherData, type WeatherData } from '@/lib/weather-forecast';

export type GrainType = 'Rice' | 'Wheat' | 'Maize';
export type MeasurementState = 'idle' | 'measuring' | 'done';
export type DeviceStatus = 'disconnected' | 'connecting' | 'connected';

type Measurement = {
  grain: GrainType;
  moisture: number;
  timestamp: Date;
};

const grains = [
  { name: 'Rice', icon: RiceIcon },
  { name: 'Wheat', icon: WheatIcon },
  { name: 'Maize', icon: MaizeIcon },
] as const;

export function GrainAnalyzerDashboard({ deviceStatus, measurementState }: { deviceStatus: DeviceStatus, measurementState: MeasurementState }) {
  const [selectedGrain, setSelectedGrain] = useState<GrainType>('Wheat');
  const [moisture, setMoisture] = useState<number | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [pastMeasurements, setPastMeasurements] = useState<Measurement[]>([]);
  const [liveLogs, setLiveLogs] = useState<Measurement[]>([]);
  const [advisorStatus, setAdvisorStatus] = useState<'idle' | 'loading' | 'done'>('idle');
  const [advice, setAdvice] = useState<HarvestAdvice>({ status: 'caution', title: 'Awaiting results', suggestion: 'Complete a measurement to get advice.' });
  const [liveMoistureData, setLiveMoistureData] = useState<MoistureReading[]>([]);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);


    if (navigator.geolocation) {
      setWeatherLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const data = await fetchWeatherData(position.coords.latitude, position.coords.longitude);
            setWeather(data);
          } catch (error) {
            console.error('Weather fetch error:', error);
          } finally {
            setWeatherLoading(false);
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
          setWeatherLoading(false);
        }
      );
    }
  }, []);

  useEffect(() => {
    const fetchAdvice = async () => {
      if (measurementState === 'done' && moisture !== null) {
        setAdvisorStatus('loading');
        try {
          const result = await getHarvestAdvice({ grainType: selectedGrain, moisture });
          setAdvice(result);
        } catch (error) {
          console.error("Error fetching harvest advice:", error);
          toast({
            variant: "destructive",
            title: "AI Advisor Error",
            description: "There was an issue connecting to the harvest advisor service.",
          });
          setAdvice({
            status: 'bad',
            title: 'Error',
            suggestion: 'Could not retrieve AI-powered harvest advice.'
          });
        } finally {
          setAdvisorStatus('done');
        }
      }
    };
    fetchAdvice();
  }, [measurementState, moisture, selectedGrain, toast]);


  useEffect(() => {
    if (measurementState === 'measuring') {
      setMoisture(null);
      setLiveMoistureData([]);
      setLiveLogs([]);
      setAdvisorStatus('idle');
      setAdvice({ status: 'caution', title: 'Awaiting results', suggestion: 'Complete a measurement to get advice.' });

      // LOCAL API MODE - Poll the internal /api/sensor endpoint
      let time = 0;
      let sum = 0;

      const interval = setInterval(async () => {
        try {
          const res = await fetch('/api/sensor');
          const data = await res.json();

          if (data && typeof data.rawValue === 'number') {
            // Only process if the reading is recent (within last 30 seconds) 
            // to avoid using stale data if the device is off
            const isRecent = (Date.now() - data.timestamp) < 30000;

            if (isRecent) {
              time++;
              const moistureValue = mapRawToMoisture(data.rawValue);
              const reading = { time, moisture: moistureValue };
              sum += moistureValue;

              setLiveMoistureData(prev => [...prev.slice(-29), reading]);
              setMoisture(reading.moisture);

              if (time >= 6) {
                clearInterval(interval);
                const averageMoisture = parseFloat((sum / 6).toFixed(1));
                setMoisture(averageMoisture);
                const finalMeasurement = { grain: selectedGrain, moisture: averageMoisture, timestamp: new Date() };
                setPastMeasurements(prev => [finalMeasurement, ...prev]);
              }
            }
          }
        } catch (err) {
          console.error("Failed to fetch local sensor data:", err);
        }
      }, 1000); // Poll every second

      return () => clearInterval(interval);
    }
  }, [measurementState, selectedGrain]);

  // Helper function to map raw values (duplicated here to remove dependency on firebase.ts)
  const mapRawToMoisture = (raw: number) => {
    const dry = 3200;
    const wet = 1500;
    let moisture = ((dry - raw) / (dry - wet)) * 100;
    return Math.min(Math.max(parseFloat(moisture.toFixed(1)), 0), 100);
  };


  const handleSelectGrain = (grain: GrainType) => {
    setSelectedGrain(grain);
    setMoisture(null);
    setLiveMoistureData([]);
    setLiveLogs([]);
    setAdvisorStatus('idle');
    setAdvice({ status: 'caution', title: 'Awaiting results', suggestion: 'Complete a measurement to get advice.' });
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Grain Selection</CardTitle>
            <CardDescription>Choose the type of grain you are analyzing.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              {grains.map((grain) => (
                <button
                  key={grain.name}
                  onClick={() => handleSelectGrain(grain.name)}
                  className={cn(
                    'flex flex-col items-center justify-center gap-2 p-4 border-2 rounded-lg transition-all',
                    selectedGrain === grain.name
                      ? 'border-primary bg-primary/10 shadow-md'
                      : 'border-transparent bg-accent hover:bg-accent/80'
                  )}
                  disabled={measurementState === 'measuring'}
                >
                  <grain.icon className="h-10 w-10 text-primary" />
                  <span className="font-semibold text-lg text-foreground">{grain.name}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-none shadow-xl bg-gradient-to-br from-primary/10 via-background to-accent/20">
          <CardHeader className="relative z-10">
            <CardTitle className="text-2xl font-bold flex flex-col sm:flex-row sm:items-center gap-2">
              <div className="flex items-center gap-2">
                <Cloud className="text-primary" />
                Quick Field Insights
              </div>
              {weather?.locationName && (
                <div className="flex items-center gap-1 text-sm font-normal text-muted-foreground bg-background/50 px-2 py-0.5 rounded-full border border-primary/10">
                  <MapPin className="h-3 w-3 text-primary" />
                  {weather.locationName}
                </div>
              )}
            </CardTitle>
            <CardDescription>Real-time environmental conditions for your {selectedGrain} crops.</CardDescription>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Temperature', value: weather ? `${weather.temperature}°C` : (weatherLoading ? '...' : '--'), icon: Thermometer, color: 'text-orange-500' },
                { label: 'Humidity', value: weather ? `${weather.humidity}%` : (weatherLoading ? '...' : '--'), icon: Droplets, color: 'text-blue-500' },
                { label: 'Wind Speed', value: weather ? `${weather.windSpeed}km/h` : (weatherLoading ? '...' : '--'), icon: Wind, color: 'text-green-500' },
                { label: 'Grain Health', value: 'Optimal', icon: TrendingDown, color: 'text-primary' },
              ].map((stat) => (
                <div key={stat.label} className="flex flex-col items-center justify-center p-4 bg-background/60 backdrop-blur-sm rounded-xl border border-primary/10">
                  <stat.icon className={cn("h-6 w-6 mb-2", stat.color)} />
                  <span className="text-xs text-muted-foreground uppercase font-semibold">{stat.label}</span>
                  <span className="text-lg font-bold">{stat.value}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 p-6 rounded-2xl bg-primary/5 border border-primary/20 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg">Next Rain Predicted</h3>
                <p className="text-sm text-muted-foreground">
                  {weather ? (weather.rainProbability > 20 ? `High chance within 24h (${weather.rainProbability}%)` : `Low chance (${weather.rainProbability}%)`) : "Calculating probability..."}
                </p>
              </div>
              <div className="text-right">
                <span className="text-3xl font-bold text-primary">{weather ? `${weather.rainProbability}%` : '--'}</span>
                <p className="text-[10px] text-muted-foreground uppercase">Confidence</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-6">
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Live Reading</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow flex flex-col items-center justify-center p-6 min-h-[250px]">
            {measurementState === 'idle' && (
              <div className="text-muted-foreground text-center">
                <p className="font-medium">Ready to measure</p>
                <p className='text-sm'>Connect device and press "Measure".</p>
              </div>
            )}
            {(measurementState === 'measuring' || (measurementState === 'done' && liveMoistureData.length > 0)) && (
              <div className="w-full h-[150px] -ml-4">
                <RealTimeMoistureChart data={liveMoistureData} />
              </div>
            )}
            {moisture !== null && (
              <div className="text-center mt-4">
                <p className="text-sm text-muted-foreground">Moisture Content</p>

                <p className="text-5xl font-bold text-foreground leading-tight">
                  {moisture.toFixed(1)}
                  <span className="text-3xl text-muted-foreground/50">%</span>
                </p>
                <p className="font-semibold text-lg text-muted-foreground">{selectedGrain}</p>
              </div>
            )}
            {measurementState === 'measuring' && moisture === null && (
              <div className="flex flex-col items-center justify-center text-muted-foreground">
                <LoadingSpinner className="h-8 w-8" />
                <p className="mt-2 text-sm">Preparing measurement...</p>
              </div>
            )}
          </CardContent>
        </Card>

        <HarvestAdvisorCard status={advisorStatus === 'loading' ? 'loading' : advice.status} title={advice.title} suggestion={advice.suggestion} />

      </div>
    </div>
  );
}


const HarvestAdvisorCard = ({ status, title, suggestion }: { status: 'good' | 'caution' | 'bad' | 'loading', title: string, suggestion: string }) => {
  const renderIcon = () => {
    if (status === 'loading') {
      return <LoadingSpinner className='h-10 w-10 text-primary' />;
    }
    switch (status) {
      case 'good':
        return <CheckCircle2 className="h-10 w-10 text-green-500" />;
      case 'caution':
        return <Info className="h-10 w-10 text-yellow-500" />;
      case 'bad':
        return <XCircle className="h-10 w-10 text-red-500" />;
    }
  };

  return (
    <Card className="bg-background">
      <CardHeader>
        <CardTitle>AI Moisture advisor</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-start gap-4">
          {renderIcon()}
          <div className="text-left flex-1">
            <p className="text-lg font-bold text-foreground">{status === 'loading' ? 'Analyzing...' : title}</p>
            <p className="text-sm text-muted-foreground">
              {status === 'loading' ? 'Generating harvest advice...' : suggestion}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
};

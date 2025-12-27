'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { WheatIcon, RiceIcon, MaizeIcon, LoadingSpinner } from '@/components/icons';
import { cn } from '@/lib/utils';
import { CheckCircle2, Info, XCircle, Clock } from 'lucide-react';
import { TemperatureForecastChart, type DailyForecast } from './temperature-forecast-chart';
import { generateTemperatureForecast } from '@/lib/weather-forecast';
import { RealTimeMoistureChart, type MoistureReading } from './real-time-moisture-chart';

export type GrainType = 'Rice' | 'Wheat' | 'Maize';
export type MeasurementState = 'idle' | 'measuring' | 'done';
export type DeviceStatus = 'disconnected' | 'connecting' | 'connected';

type Measurement = {
  grain: GrainType;
  moisture: number;
  timestamp: Date;
};
type Advice = {
  status: 'good' | 'caution' | 'bad';
  title: string;
  suggestion: string;
};

const grains = [
  { name: 'Rice', icon: RiceIcon },
  { name: 'Wheat', icon: WheatIcon },
  { name: 'Maize', icon: MaizeIcon },
] as const;

const getHardcodedHarvestAdvice = (grainType: GrainType, moisture: number): Advice => {
  const idealMoisture = { Wheat: 13.5, Rice: 14, Maize: 15.5 };
  const acceptableMoisture = { Wheat: 15.5, Rice: 16, Maize: 18 };

  if (moisture <= idealMoisture[grainType]) {
    return {
      status: 'good',
      title: 'Good to Harvest',
      suggestion: `Moisture is at an ideal level for ${grainType}. Excellent conditions for harvesting and storage.`,
    };
  } else if (moisture <= acceptableMoisture[grainType]) {
    return {
      status: 'caution',
      title: 'Harvest with Caution',
      suggestion: `The grain may require drying after harvest to prevent spoilage.`,
    };
  } else {
    return {
      status: 'bad',
      title: 'Not Recommended',
      suggestion: `High moisture content detected. Harvesting now poses a high risk of spoilage. Wait for drier conditions.`,
    };
  }
};


export function GrainAnalyzerDashboard({ deviceStatus, measurementState, handleMeasure }: { deviceStatus: DeviceStatus, measurementState: MeasurementState, handleMeasure: () => void }) {
  const [selectedGrain, setSelectedGrain] = useState<GrainType>('Wheat');
  const [moisture, setMoisture] = useState<number | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [pastMeasurements, setPastMeasurements] = useState<Measurement[]>([]);
  const [liveLogs, setLiveLogs] = useState<Measurement[]>([]);
  const [forecast, setForecast] = useState<DailyForecast[]>([]);
  const [advisorStatus, setAdvisorStatus] = useState<'idle' | 'loading' | 'done'>('idle');
  const [advice, setAdvice] = useState<Advice>({ status: 'caution', title: 'Awaiting results', suggestion: 'Complete a measurement to get advice.' });
  const [liveMoistureData, setLiveMoistureData] = useState<MoistureReading[]>([]);
  
  useEffect(() => {
    setIsClient(true);
    setForecast(generateTemperatureForecast());
  }, []);

  useEffect(() => {
    if (measurementState === 'done' && moisture !== null) {
      setAdvisorStatus('loading');
      setTimeout(() => {
        const result = getHardcodedHarvestAdvice(selectedGrain, moisture);
        setAdvice(result);
        setAdvisorStatus('done');
      }, 500);
    }
  }, [measurementState, moisture, selectedGrain]);

  useEffect(() => {
     if (measurementState === 'measuring') {
        setMoisture(null);
        setLiveMoistureData([]);
        setLiveLogs([]);
        setAdvisorStatus('idle');
        setAdvice({ status: 'caution', title: 'Awaiting results', suggestion: 'Complete a measurement to get advice.' });

        let time = 0;
        const baseMoisture = selectedGrain === 'Rice' ? 12 : selectedGrain === 'Wheat' ? 14 : 18;
        
        const interval = setInterval(() => {
          time++;
          const randomFluctuation = (Math.random() - 0.5) * 0.4;
          const trend = Math.sin(time / 3) * 0.5; // slow sine wave for a trend
          const newMoisture = baseMoisture + trend + randomFluctuation;
          const reading = { time, moisture: parseFloat(newMoisture.toFixed(1)) };
          
          setLiveMoistureData(prev => [...prev.slice(-29), reading]); // keep last 30 points
          setMoisture(reading.moisture);

          const newLog = { grain: selectedGrain, moisture: reading.moisture, timestamp: new Date() };
          setLiveLogs(prev => [newLog, ...prev]);

          if (time >= 10) { // Stop after 10 seconds
            clearInterval(interval);
            setPastMeasurements(prev => [newLog, ...prev]);
            // This relies on parent component to set measurementState to 'done'
          }
        }, 1000);

        return () => clearInterval(interval);
     }
     if(measurementState === 'idle' || measurementState === 'done') {
        setLiveLogs([]);
     }
  }, [measurementState, selectedGrain]);

  
  const handleSelectGrain = (grain: GrainType) => {
    setSelectedGrain(grain);
    setMoisture(null);
    setLiveMoistureData([]);
    setLiveLogs([]);
    setAdvisorStatus('idle');
    setAdvice({ status: 'caution', title: 'Awaiting results', suggestion: 'Complete a measurement to get advice.' });
  }

  const measurementHistory = measurementState === 'measuring' ? liveLogs : pastMeasurements;

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
        
        <Card>
           <CardHeader>
              <CardTitle>7-Day Temperature Forecast</CardTitle>
              <CardDescription>Predicted temperature trends for harvest planning.</CardDescription>
            </CardHeader>
            <CardContent>
                {isClient ? <TemperatureForecastChart data={forecast} /> : <div className="h-[250px] w-full flex items-center justify-center text-muted-foreground">Loading chart...</div>}
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

        <Card>
          <CardHeader>
            <CardTitle>Measurement History</CardTitle>
            <CardDescription>
              {measurementState === 'measuring' ? 'Live measurement logs...' : 'Recent readings from your device.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="max-h-64 overflow-y-auto text-sm">
            {measurementHistory.length > 0 ? (
              <ul className='space-y-3'>
                {measurementHistory.map((m, i) => (
                  <li key={i} className='flex justify-between items-center'>
                    <div className='flex items-center gap-3'>
                      {m.grain === 'Wheat' && <WheatIcon className='h-5 w-5 text-muted-foreground'/>}
                      {m.grain === 'Rice' && <RiceIcon className='h-5 w-5 text-muted-foreground'/>}
                      {m.grain === 'Maize' && <MaizeIcon className='h-5 w-5 text-muted-foreground'/>}
                      <div>
                        <span className='font-semibold'>{m.grain} - {m.moisture.toFixed(1)}%</span>
                        <p className='text-muted-foreground text-xs'>
                          {m.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                     <span className='text-muted-foreground text-xs'>
                      {measurementState === 'measuring' ? `+${10 - m.timestamp.getSeconds() % 10 -1}s ago` : m.timestamp.toLocaleDateString()}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                <Clock className="h-8 w-8 mx-auto text-gray-300" />
                <p className="mt-2">No measurements recorded yet.</p>
              </div>
            )}
          </CardContent>
        </Card>
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
            <CardTitle>Harvest Advisor</CardTitle>
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

    
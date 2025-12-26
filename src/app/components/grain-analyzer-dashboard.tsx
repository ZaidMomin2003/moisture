'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { WheatIcon, RiceIcon, MaizeIcon, LoadingSpinner } from '@/components/icons';
import { cn } from '@/lib/utils';
import { CheckCircle2, Info, XCircle, Wifi, Cpu, Thermometer, Clock } from 'lucide-react';
import { TemperatureForecastChart, type DailyForecast } from './temperature-forecast-chart';
import { generateTemperatureForecast } from '@/lib/weather-forecast';
import { getHarvestAdvice } from '@/ai/flows/get-harvest-advice';
import { useToast } from '@/hooks/use-toast';

type GrainType = 'Rice' | 'Wheat' | 'Maize';
type MeasurementState = 'idle' | 'measuring' | 'done';
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

export function GrainAnalyzerDashboard() {
  const [selectedGrain, setSelectedGrain] = useState<GrainType>('Wheat');
  const [measurementState, setMeasurementState] = useState<MeasurementState>('idle');
  const [moisture, setMoisture] = useState<number | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [measurementLogs, setMeasurementLogs] = useState<string[]>([]);
  const [measurementHistory, setMeasurementHistory] = useState<Measurement[]>([]);
  const [forecast, setForecast] = useState<DailyForecast[]>([]);
  const [advisorStatus, setAdvisorStatus] = useState<'idle' | 'loading' | 'done'>('idle');
  const [advice, setAdvice] = useState<{ status: 'good' | 'caution' | 'bad'; title: string; suggestion: string; }>({ status: 'caution', title: 'Awaiting results', suggestion: 'Complete a measurement to get advice.' });
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
    setForecast(generateTemperatureForecast());
  }, []);

  useEffect(() => {
    if (measurementState === 'done' && moisture !== null) {
      const fetchAdvice = async () => {
        setAdvisorStatus('loading');
        try {
          const result = await getHarvestAdvice({
            grainType: selectedGrain,
            moistureContent: moisture,
            temperatureForecast: forecast,
          });
          setAdvice(result);
        } catch (error) {
          console.error("Error fetching harvest advice:", error);
          setAdvice({
            status: 'bad',
            title: 'Error',
            suggestion: 'Could not retrieve AI-powered harvest advice.'
          });
          toast({
            variant: "destructive",
            title: "AI Advisor Error",
            description: "There was an issue connecting to the harvest advisor service.",
          });
        } finally {
          setAdvisorStatus('done');
        }
      };
      fetchAdvice();
    }
  }, [measurementState, moisture, selectedGrain, forecast, toast]);


  const handleMeasure = () => {
    if (!isClient) return;

    setMeasurementState('measuring');
    setMoisture(null);
    setMeasurementLogs(['[0s] Starting measurement cycle...']);
    setAdvisorStatus('idle');


    const interval = setInterval(() => {
      setMeasurementLogs(prev => [...prev, `[${prev.length}s] Analyzing grain sample...`]);
    }, 1000);

    setTimeout(() => {
      clearInterval(interval);
      const baseMoisture = selectedGrain === 'Rice' ? 12 : selectedGrain === 'Wheat' ? 14 : 18;
      const randomMoisture = baseMoisture + (Math.random() - 0.5) * 4;
      const finalMoisture = parseFloat(randomMoisture.toFixed(1));
      
      setMoisture(finalMoisture);
      setMeasurementState('done');
      const newMeasurement = { grain: selectedGrain, moisture: finalMoisture, timestamp: new Date() };
      setMeasurementHistory(prev => [newMeasurement, ...prev]);
      setMeasurementLogs(prev => [...prev, `[${prev.length}s] Measurement complete. Result: ${finalMoisture}%`]);
    }, 5000);
  };
  
  const handleSelectGrain = (grain: GrainType) => {
    setSelectedGrain(grain);
    setMeasurementState('idle');
    setMoisture(null);
    setMeasurementLogs([]);
    setAdvisorStatus('idle');
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column */}
      <div className="lg:col-span-2 flex flex-col gap-6">
        <Card>
           <CardHeader>
            <CardTitle>Moisture Analyzer</CardTitle>
            <CardDescription>Select a grain type and start the measurement.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
             <div>
                <h3 className="mb-4 text-sm font-medium text-muted-foreground">1. Select Grain</h3>
                <div className="grid grid-cols-3 gap-3">
                    {grains.map((grain) => (
                      <button
                        key={grain.name}
                        onClick={() => handleSelectGrain(grain.name)}
                        className={cn(
                          'flex flex-col items-center justify-center gap-2 p-3 border-2 rounded-lg transition-all',
                          selectedGrain === grain.name
                            ? 'border-primary bg-primary/10 shadow-md'
                            : 'border-transparent bg-accent hover:bg-accent/80'
                        )}
                      >
                        <grain.icon className="h-8 w-8 text-primary" />
                        <span className="font-semibold text-md text-foreground">{grain.name}</span>
                      </button>
                    ))}
                  </div>
             </div>
             <div className="flex flex-col items-center justify-center">
                <h3 className="mb-4 text-sm font-medium text-muted-foreground">2. Start Measurement</h3>
                <Button
                    onClick={handleMeasure}
                    disabled={measurementState === 'measuring' || !isClient}
                    className="text-base font-bold py-6 px-8 rounded-full shadow-lg transform hover:scale-105 transition-transform"
                    size="lg"
                  >
                    <Cpu className="mr-2 h-5 w-5" />
                    {measurementState === 'measuring' ? 'Measuring...' : 'Measure Moisture'}
                  </Button>
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

      {/* Right Column */}
      <div className="flex flex-col gap-6">
         <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Live Reading</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow flex flex-col items-center justify-center text-center p-6 min-h-[240px]">
            {measurementState === 'idle' && (
              <div className="text-muted-foreground">
                <p className="font-medium">Ready to measure</p>
                <p className='text-sm'>Select grain and press "Measure" to begin.</p>
              </div>
            )}
            {measurementState === 'measuring' && (
              <div className="flex flex-col items-center justify-center text-muted-foreground">
                <LoadingSpinner className="h-12 w-12 text-primary" />
                <p className="mt-3 text-lg font-medium">Analyzing...</p>
              </div>
            )}
            {measurementState === 'done' && moisture !== null && (
              <>
                <p className="text-sm text-muted-foreground">Moisture Content</p>
                <p className="text-7xl font-bold text-foreground leading-tight">
                  {moisture}
                  <span className="text-5xl text-muted-foreground/50">%</span>
                </p>
                <p className="font-semibold text-xl text-muted-foreground">{selectedGrain}</p>
              </>
            )}
          </CardContent>
        </Card>
        
        <HarvestAdvisorCard status={advisorStatus === 'loading' ? 'loading' : advice.status} title={advice.title} suggestion={advice.suggestion} />

        <Card>
          <CardHeader>
            <CardTitle>Measurement History</CardTitle>
            <CardDescription>Recent readings and live logs.</CardDescription>
          </CardHeader>
          <CardContent className="max-h-64 overflow-y-auto text-sm">
            {measurementState === 'measuring' ? (
                <div className='font-mono text-xs'>
                  {measurementLogs.map((log, i) => <p key={i}>{log}</p>)}
                </div>
            ) : measurementHistory.length > 0 ? (
              <ul className='space-y-3'>
                {measurementHistory.map((m, i) => (
                  <li key={i} className='flex justify-between items-center'>
                    <div className='flex items-center gap-3'>
                      {m.grain === 'Wheat' && <WheatIcon className='h-5 w-5 text-muted-foreground'/>}
                      {m.grain === 'Rice' && <RiceIcon className='h-5 w-5 text-muted-foreground'/>}
                      {m.grain === 'Maize' && <MaizeIcon className='h-5 w-5 text-muted-foreground'/>}
                      <div>
                        <span className='font-semibold'>{m.grain} - {m.moisture}%</span>
                        <p className='text-muted-foreground text-xs'>
                          {m.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                     <span className='text-muted-foreground text-xs'>{m.timestamp.toLocaleDateString()}</span>
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
                    {status === 'loading' ? 'Generating AI-powered harvest advice...' : suggestion}
                  </p>
                </div>
            </div>
        </CardContent>
    </Card>
  )
}

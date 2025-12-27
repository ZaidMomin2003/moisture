'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { WheatIcon, RiceIcon, MaizeIcon, LoadingSpinner } from '@/components/icons';
import { cn } from '@/lib/utils';
import { CheckCircle2, Info, XCircle, Cpu, Clock, Wifi, WifiOff, Check } from 'lucide-react';
import { TemperatureForecastChart, type DailyForecast } from './temperature-forecast-chart';
import { generateTemperatureForecast } from '@/lib/weather-forecast';

type GrainType = 'Rice' | 'Wheat' | 'Maize';
type MeasurementState = 'idle' | 'measuring' | 'done';
type DeviceStatus = 'disconnected' | 'connecting' | 'connected';
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


export function GrainAnalyzerDashboard() {
  const [selectedGrain, setSelectedGrain] = useState<GrainType>('Wheat');
  const [measurementState, setMeasurementState] = useState<MeasurementState>('idle');
  const [moisture, setMoisture] = useState<number | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [measurementLogs, setMeasurementLogs] = useState<string[]>([]);
  const [measurementHistory, setMeasurementHistory] = useState<Measurement[]>([]);
  const [forecast, setForecast] = useState<DailyForecast[]>([]);
  const [advisorStatus, setAdvisorStatus] = useState<'idle' | 'loading' | 'done'>('idle');
  const [advice, setAdvice] = useState<Advice>({ status: 'caution', title: 'Awaiting results', suggestion: 'Complete a measurement to get advice.' });
  const [deviceStatus, setDeviceStatus] = useState<DeviceStatus>('disconnected');
  
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


  const handleMeasure = () => {
    if (!isClient) return;

    setMeasurementState('measuring');
    setMoisture(null);
    setMeasurementLogs(['[0s] Starting measurement cycle...']);
    setAdvisorStatus('idle');
    setAdvice({ status: 'caution', title: 'Awaiting results', suggestion: 'Complete a measurement to get advice.' });

    const interval = setInterval(() => {
      setMeasurementLogs(prev => [...prev, `[${prev.length}s] Reading sensor value from device...`]);
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
    setAdvice({ status: 'caution', title: 'Awaiting results', suggestion: 'Complete a measurement to get advice.' });
  }

  const handleConnectDevice = () => {
    setDeviceStatus('connecting');
    setTimeout(() => {
      setDeviceStatus('connected');
    }, 3000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                    disabled={measurementState === 'measuring' || !isClient || deviceStatus !== 'connected'}
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

      <div className="flex flex-col gap-6">
         <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Live Reading</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow flex flex-col items-center justify-center text-center p-6 min-h-[190px]">
            {measurementState === 'idle' && (
              <div className="text-muted-foreground">
                <p className="font-medium">Ready to measure</p>
                <p className='text-sm'>Connect to device and press "Measure".</p>
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

        <DeviceConnectionCard status={deviceStatus} onConnect={handleConnectDevice} />
        
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
                    {status === 'loading' ? 'Generating harvest advice...' : suggestion}
                  </p>
                </div>
            </div>
        </CardContent>
    </Card>
  )
}

const DeviceConnectionCard = ({ status, onConnect }: { status: DeviceStatus, onConnect: () => void }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Device Connection</CardTitle>
        <CardDescription>Connect to the GrainScan hardware.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center gap-4">
        {status === 'disconnected' && (
          <>
            <WifiOff className="h-12 w-12 text-muted-foreground" />
            <p className="text-muted-foreground text-center">Not connected to GrainScan device.</p>
            <Button onClick={onConnect}>
              <Wifi className="mr-2 h-4 w-4" /> Connect
            </Button>
          </>
        )}
        {status === 'connecting' && (
          <>
            <LoadingSpinner className="h-12 w-12 text-primary" />
            <p className="text-muted-foreground">Searching for device...</p>
          </>
        )}
        {status === 'connected' && (
          <>
            <CheckCircle2 className="h-12 w-12 text-green-500" />
            <p className="font-semibold text-center text-green-600">Connected to GrainScan-A4B2</p>
            <p className="text-xs text-muted-foreground">Ready to receive sensor data.</p>
          </>
        )}
      </CardContent>
    </Card>
  )
}

    
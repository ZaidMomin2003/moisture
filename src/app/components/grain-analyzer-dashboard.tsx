'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { WheatIcon, RiceIcon, MaizeIcon, LoadingSpinner } from '@/components/icons';
import { cn } from '@/lib/utils';
import { CheckCircle2, Info, XCircle, Wifi, Cpu, AreaChart } from 'lucide-react';

type GrainType = 'Rice' | 'Wheat' | 'Maize';
type MeasurementState = 'idle' | 'measuring' | 'done';

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
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleMeasure = () => {
    if (!isClient) return;

    setMeasurementState('measuring');
    setMoisture(null);
    setTimeout(() => {
      const baseMoisture = selectedGrain === 'Rice' ? 12 : selectedGrain === 'Wheat' ? 14 : 18;
      const randomMoisture = baseMoisture + (Math.random() - 0.5) * 4;
      setMoisture(parseFloat(randomMoisture.toFixed(1)));
      setMeasurementState('done');
    }, 2000);
  };
  
  const handleSelectGrain = (grain: GrainType) => {
    setSelectedGrain(grain);
    setMeasurementState('idle');
    setMoisture(null);
  }
  
  const { status, title, suggestion } = useMemo(() => getAdvice(moisture, selectedGrain), [moisture, selectedGrain]);

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
        
        <Card className="min-h-[280px]">
           <CardHeader>
              <CardTitle>Measurement History</CardTitle>
              <CardDescription>Visualizing recent moisture readings.</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center text-muted-foreground">
                <div className='text-center'>
                    <AreaChart className='h-16 w-16 mx-auto text-gray-300'/>
                    <p className='mt-4 text-sm'>Chart data will be displayed here.</p>
                </div>
            </CardContent>
        </Card>
      </div>

      {/* Right Column */}
      <div className="flex flex-col gap-6">
         <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Live Reading</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow flex flex-col items-center justify-center text-center p-6">
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
        
        {measurementState === 'done' && (
            <HarvestAdvisorCard status={status} title={title} suggestion={suggestion} />
        )}

        <Card>
            <CardHeader className='pb-2'>
                <CardTitle>Device Status</CardTitle>
            </CardHeader>
            <CardContent>
                <div className='flex items-center text-green-600 font-semibold'>
                    <Wifi className="h-5 w-5 mr-2" />
                    <span>Hardware Connected</span>
                </div>
                <p className='text-xs text-muted-foreground mt-1'>Receiving data from GrainScan-A1 unit.</p>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}


const HarvestAdvisorCard = ({ status, title, suggestion }: ReturnType<typeof getAdvice>) => {
    const renderIcon = () => {
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
                  <p className="text-lg font-bold text-foreground">{title}</p>
                  <p className="text-sm text-muted-foreground">
                    {suggestion}
                  </p>
                </div>
            </div>
        </CardContent>
    </Card>
  )
}

function getAdvice(moistureLevel: number | null, grainType: GrainType) {
    let status: 'good' | 'caution' | 'bad' = 'caution';
    let title = '';
    let suggestion = '';

    if (moistureLevel === null) {
        return {status: 'caution', title: 'Awaiting results', suggestion: 'Measurement has not been completed yet.'}
    }

    if (grainType === 'Wheat') {
      if (moistureLevel < 13.5) {
        status = 'good';
        title = 'Good to Harvest';
        suggestion = 'Moisture level is ideal. Proceed with harvesting to ensure optimal quality and storage life.';
      } else if (moistureLevel <= 15.5) {
        status = 'caution';
        title = 'Harvest with Caution';
        suggestion = 'Moisture is slightly high. Consider drying the grain after harvest to prevent spoilage.';
      } else {
        status = 'bad';
        title = 'Not Ready for Harvest';
        suggestion = 'Moisture level is too high. Delay harvesting and allow the grain to dry further in the field.';
      }
    }
     if (grainType === 'Rice') {
      if (moistureLevel < 14) {
        status = 'good';
        title = 'Optimal for Harvest';
        suggestion = 'Excellent moisture level. Harvesting now will yield high-quality grains ready for storage.';
      } else if (moistureLevel <= 16) {
        status = 'caution';
        title = 'Monitor Closely';
        suggestion = 'Moisture is adequate, but drying may be needed post-harvest to avoid mold.';
      } else {
        status = 'bad';
        title = 'Delay Harvest';
        suggestion = 'Moisture is too high for rice. Wait for more drying in the field to prevent spoilage.';
      }
    }
     if (grainType === 'Maize') {
      if (moistureLevel < 15.5) {
        status = 'good';
        title = 'Ready to Harvest';
        suggestion = 'Ideal moisture content for maize. Proceed with harvesting for best results.';
      } else if (moistureLevel <= 18) {
        status = 'caution';
        title = 'Caution Advised';
        suggestion = 'Slightly high moisture. Be prepared for post-harvest drying to ensure long-term storage.';
      } else {
        status = 'bad';
        title = 'Harvest Not Recommended';
        suggestion = 'High moisture content poses a risk of spoilage. Let the maize dry longer in the field.';
      }
    }

    return { status, title, suggestion };
  };

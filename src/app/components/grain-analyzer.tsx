'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { WheatIcon, RiceIcon, MaizeIcon, LoadingSpinner } from '@/components/icons';
import { cn } from '@/lib/utils';
import { CheckCircle2, Info, XCircle } from 'lucide-react';

type GrainType = 'Rice' | 'Wheat' | 'Maize';
type MeasurementState = 'idle' | 'measuring' | 'done';

const grains = [
  { name: 'Rice', icon: RiceIcon },
  { name: 'Wheat', icon: WheatIcon },
  { name: 'Maize', icon: MaizeIcon },
] as const;

export function GrainAnalyzer() {
  const [selectedGrain, setSelectedGrain] = useState<GrainType>('Rice');
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
    }, 2500);
  };
  
  const handleSelectGrain = (grain: GrainType) => {
    setSelectedGrain(grain);
    setMeasurementState('idle');
    setMoisture(null);
  }

  const renderDisplayContent = () => {
    switch (measurementState) {
      case 'measuring':
        return (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <LoadingSpinner className="h-16 w-16 text-primary" />
            <p className="mt-4 text-xl font-medium">Measuring...</p>
            <p className="text-base">Analyzing {selectedGrain} sample</p>
          </div>
        );
      case 'done':
         return <HarvestAdvisor moistureLevel={moisture} grainType={selectedGrain} />;
      case 'idle':
      default:
        return (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-8 text-center">
            <p className="mt-2 text-xl font-medium">Ready to Analyze</p>
            <p className="text-base max-w-sm">
              Press the "Measure Moisture" button to begin the analysis for the selected grain.
            </p>
          </div>
        );
    }
  };

  return (
    <Card className="w-full shadow-2xl rounded-2xl">
      <CardContent className="p-4 sm:p-6 md:p-8">
        <div className="text-center mb-8">
          <h2 className="text-lg font-semibold text-muted-foreground">1. Select Grain Type</h2>
          <div className="grid grid-cols-3 gap-4 mt-4 max-w-md mx-auto">
            {grains.map((grain) => (
              <button
                key={grain.name}
                onClick={() => handleSelectGrain(grain.name)}
                className={cn(
                  'flex flex-col items-center justify-center gap-3 p-4 border-2 rounded-xl transition-all duration-300',
                  selectedGrain === grain.name
                    ? 'border-primary bg-primary/10 shadow-lg scale-105'
                    : 'border-transparent bg-accent hover:bg-accent/80'
                )}
              >
                <grain.icon className="h-10 w-10 text-primary" />
                <span className="font-bold text-lg text-foreground">{grain.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="text-center my-8">
           <h2 className="text-lg font-semibold text-muted-foreground">2. Start Measurement</h2>
        </div>
        
        <div className="relative mb-8">
           <div className="absolute inset-0 flex items-center" aria-hidden="true">
             <div className="w-full border-t border-dashed border-gray-300" />
           </div>
           <div className="relative flex justify-center">
             <Button
                onClick={handleMeasure}
                disabled={measurementState === 'measuring' || !isClient}
                className="text-lg font-bold py-8 px-10 rounded-full shadow-lg transform hover:scale-105 transition-transform"
                size="lg"
              >
                {measurementState === 'measuring' ? 'Analyzing...' : 'Measure Moisture'}
              </Button>
           </div>
        </div>

        <div className="bg-muted/60 rounded-xl min-h-[250px] flex items-center justify-center p-4">
          {renderDisplayContent()}
        </div>
      </CardContent>
    </Card>
  );
}


function HarvestAdvisor({ moistureLevel, grainType }: {moistureLevel: number | null, grainType: GrainType}) {
  const getAdvice = () => {
    let status: 'good' | 'caution' | 'bad' = 'caution';
    let title = '';
    let suggestion = '';

    if (!moistureLevel) {
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

  const { status, title, suggestion } = getAdvice();

  const renderIcon = () => {
    switch (status) {
      case 'good':
        return <CheckCircle2 className="h-12 w-12 text-green-500" />;
      case 'caution':
        return <Info className="h-12 w-12 text-yellow-500" />;
      case 'bad':
        return <XCircle className="h-12 w-12 text-red-500" />;
    }
  };

  return (
     <div className="flex flex-col items-center justify-center h-full text-center p-4">
        <p className="text-sm text-muted-foreground">Moisture Content</p>
        <p className="text-7xl font-bold text-foreground">
          {moistureLevel}
          <span className="text-5xl text-muted-foreground">%</span>
        </p>
        <p className="font-semibold text-xl mb-4">{grainType}</p>
        
        <div className="flex items-center gap-4 mt-4">
            {renderIcon()}
            <div className="text-left">
              <p className="text-xl font-bold text-foreground">{title}</p>
              <p className="text-sm text-muted-foreground max-w-xs">
                {suggestion}
              </p>
            </div>
        </div>
      </div>
  );
}


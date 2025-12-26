'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WheatIcon, RiceIcon, MaizeIcon, LoadingSpinner } from '@/components/icons';
import { Separator } from '@/components/ui/separator';

type GrainType = 'Rice' | 'Wheat' | 'Maize';
type MeasurementState = 'idle' | 'measuring' | 'done';

export function GrainAnalyzer() {
  const [grainType, setGrainType] = useState<GrainType>('Rice');
  const [measurementState, setMeasurementState] = useState<MeasurementState>('idle');
  const [moisture, setMoisture] = useState<number | null>(null);
  
  // Avoid hydration mismatch for Math.random()
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleMeasure = () => {
    if (!isClient) return;

    setMeasurementState('measuring');
    setMoisture(null);
    setTimeout(() => {
      // Simulate measurement variation based on grain type
      const baseMoisture = grainType === 'Rice' ? 12 : grainType === 'Wheat' ? 14 : 18;
      const randomMoisture = baseMoisture + (Math.random() - 0.5) * 4;
      setMoisture(parseFloat(randomMoisture.toFixed(1)));
      setMeasurementState('done');
    }, 2500);
  };

  const getGrainIcon = (grain: GrainType) => {
    switch (grain) {
      case 'Rice':
        return <RiceIcon className="h-5 w-5" />;
      case 'Wheat':
        return <WheatIcon className="h-5 w-5" />;
      case 'Maize':
        return <MaizeIcon className="h-5 w-5" />;
    }
  };

  const renderDisplayContent = () => {
    switch (measurementState) {
      case 'measuring':
        return (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <LoadingSpinner className="h-12 w-12 text-primary" />
            <p className="mt-4 text-lg font-medium">Measuring...</p>
            <p className="text-sm">Analyzing {grainType} sample</p>
          </div>
        );
      case 'done':
        return (
          <div className="flex flex-col items-center justify-center h-full">
            <p className="text-sm text-muted-foreground">Moisture Content</p>
            <p className="text-7xl font-bold text-primary-foreground">
              {moisture}
              <span className="text-5xl text-muted-foreground">%</span>
            </p>
            <p className="font-medium text-lg">{grainType}</p>
          </div>
        );
      case 'idle':
      default:
        return (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            {getGrainIcon(grainType)}
            <p className="mt-2 font-medium">Ready to measure</p>
            <p className="text-sm text-center">Select grain and press "Measure" to begin.</p>
          </div>
        );
    }
  };

  return (
    <Card className="h-full flex flex-col shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline">Moisture Analyzer</CardTitle>
        <CardDescription>Select grain type and start measurement.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col gap-6">
        <Tabs
          defaultValue="Rice"
          className="w-full"
          onValueChange={(value) => {
            setGrainType(value as GrainType);
            setMeasurementState('idle');
          }}
        >
          <TabsList className="grid w-full grid-cols-3 bg-muted/60">
            <TabsTrigger value="Rice">
              <RiceIcon className="mr-2 h-4 w-4" /> Rice
            </TabsTrigger>
            <TabsTrigger value="Wheat">
              <WheatIcon className="mr-2 h-4 w-4" /> Wheat
            </TabsTrigger>
            <TabsTrigger value="Maize">
              <MaizeIcon className="mr-2 h-4 w-4" /> Maize
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex-grow h-48 bg-muted/40 dark:bg-muted/20 rounded-lg flex items-center justify-center p-4">
          {renderDisplayContent()}
        </div>
      </CardContent>
      <Separator />
      <CardFooter className="pt-6">
        <Button
          onClick={handleMeasure}
          disabled={measurementState === 'measuring' || !isClient}
          className="w-full text-lg py-6"
          size="lg"
        >
          {measurementState === 'measuring' ? 'Please Wait' : 'Measure Moisture'}
        </Button>
      </CardFooter>
    </Card>
  );
}

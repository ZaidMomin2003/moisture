'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Cpu, Zap } from 'lucide-react';

type SensorType = 'capacitive' | 'resistive';

export function SensorControlPanel() {
  const [sensorType, setSensorType] = useState<SensorType>('capacitive');
  const [rawValue, setRawValue] = useState(0);
  const [unit, setUnit] = useState('pF');

  // Avoid hydration mismatch for Math.random()
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const interval = setInterval(() => {
      if (sensorType === 'capacitive') {
        // Simulate pico-Farads
        setRawValue(parseFloat((100 + Math.random() * 50).toFixed(2)));
        setUnit('pF');
      } else {
        // Simulate Kilo-Ohms
        setRawValue(parseFloat((500 + Math.random() * 200).toFixed(2)));
        setUnit('kΩ');
      }
    }, 1500);

    return () => clearInterval(interval);
  }, [sensorType, isClient]);

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline">Sensor Control Panel</CardTitle>
        <CardDescription>Simulate readings from different sensor types.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label className="font-medium">Sensor Type</Label>
          <RadioGroup
            defaultValue="capacitive"
            className="mt-2"
            onValueChange={(value: SensorType) => setSensorType(value)}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="capacitive" id="capacitive" />
              <Label htmlFor="capacitive" className="flex items-center gap-2">
                <Cpu className="h-4 w-4" /> Capacitive
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="resistive" id="resistive" />
              <Label htmlFor="resistive" className="flex items-center gap-2">
                <Zap className="h-4 w-4" /> Resistive
              </Label>
            </div>
          </RadioGroup>
        </div>
        <Separator />
        <div>
          <Label className="text-sm text-muted-foreground">Live Sensor Reading</Label>
          <div className="mt-1 flex items-baseline gap-2">
            <p className="text-4xl font-bold text-primary-foreground">{isClient ? rawValue : '...'}</p>
            <span className="text-xl font-medium text-muted-foreground">{unit}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            This is the raw, unprocessed value from the selected sensor.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

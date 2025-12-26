'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Info, XCircle } from 'lucide-react';

export function HarvestAdvisor() {
  // This is hardcoded for now. We can connect this to the actual moisture reading later.
  const moistureLevel = 15.5; 
  const grainType = 'Wheat';

  const getAdvice = () => {
    let status: 'good' | 'caution' | 'bad' = 'caution';
    let title = '';
    let suggestion = '';

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
    // Add logic for other grains here...

    return { status, title, suggestion };
  };

  const { status, title, suggestion } = getAdvice();

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
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline">Harvest Advisor</CardTitle>
        <CardDescription>AI-powered suggestions for your grain.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center text-center space-y-4">
        {renderIcon()}
        <div className="space-y-1">
          <p className="text-xl font-bold text-primary-foreground">{title}</p>
          <p className="text-sm text-muted-foreground px-4">
            {suggestion}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

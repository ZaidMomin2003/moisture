'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wifi, WifiOff } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

type ConnectionStatus = 'disconnected' | 'connecting' | 'connected';

export function DeviceConnection() {
  const [status, setStatus] = useState<ConnectionStatus>('disconnected');
  const [progress, setProgress] = useState(0);

  const handleConnect = () => {
    setStatus('connecting');
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setStatus('connected');
          return 100;
        }
        return prev + 20;
      });
    }, 400);
  };

  const handleDisconnect = () => {
    setStatus('disconnected');
    setProgress(0);
  };

  const renderContent = () => {
    switch (status) {
      case 'connected':
        return (
          <div className="flex flex-col items-center text-center space-y-3">
            <Wifi className="h-10 w-10 text-green-500" />
            <div className="space-y-1">
              <p className="font-semibold text-primary-foreground">Connected to GrainScan-A1</p>
              <p className="text-xs text-muted-foreground">Ready to receive sensor data.</p>
            </div>
            <Button variant="destructive" size="sm" onClick={handleDisconnect} className="w-full">
              Disconnect
            </Button>
          </div>
        );
      case 'connecting':
        return (
          <div className="flex flex-col items-center text-center space-y-3">
            <p className="font-medium text-muted-foreground">Pairing with device...</p>
            <Progress value={progress} className="w-full" />
            <p className="text-xs text-muted-foreground">Ensure device is powered on.</p>
          </div>
        );
      case 'disconnected':
      default:
        return (
          <div className="flex flex-col items-center text-center space-y-3">
            <WifiOff className="h-10 w-10 text-muted-foreground" />
            <p className="font-semibold text-primary-foreground">Device Disconnected</p>
            <Button onClick={handleConnect} className="w-full">
              Connect to Analyzer
            </Button>
          </div>
        );
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline">Device Connection</CardTitle>
        <CardDescription>Pair with your GrainScan hardware.</CardDescription>
      </CardHeader>
      <CardContent>{renderContent()}</CardContent>
    </Card>
  );
}

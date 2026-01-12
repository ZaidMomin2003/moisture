'use client';

import { useState, useEffect } from 'react';
import { GrainAnalyzerDashboard, type DeviceStatus, type MeasurementState } from './components/grain-analyzer-dashboard';
import { AppLogo, LoadingSpinner } from '@/components/icons';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Cpu, CheckCircle2, WifiOff, Settings, TestTube2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useRouter } from 'next/navigation';


export default function Home() {
  const [deviceStatus, setDeviceStatus] = useState<DeviceStatus>('disconnected');
  const [measurementState, setMeasurementState] = useState<MeasurementState>('idle');
  const [isSimulated, setIsSimulated] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleConnectDevice = (simulated: boolean) => {
    setIsSimulated(simulated);
    if (simulated) {
      setDeviceStatus('connecting');
      setTimeout(() => {
        setDeviceStatus('connected');
      }, 1500);
    } else {
      router.push('/connect');
    }
  };

  const handleMeasure = () => {
    if (measurementState === 'measuring' || deviceStatus !== 'connected') return;

    setMeasurementState('measuring');
    setTimeout(() => {
      setMeasurementState('done');
    }, 10000);
  };

  const ConnectButton = () => {
    switch (deviceStatus) {
      case 'connected':
        return (
          <Button disabled className="bg-green-600 hover:bg-green-700 text-white font-semibold">
            <CheckCircle2 /> Connected
          </Button>
        );
      case 'connecting':
        return (
          <Button disabled>
            <LoadingSpinner /> Connecting...
          </Button>
        );
      case 'disconnected':
      default:
        return (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="bg-red-600 hover:bg-red-700 text-white font-semibold">
                <WifiOff /> Connect Device
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Choose Connection Method</AlertDialogTitle>
                <AlertDialogDescription>
                  You can connect to a physical GrainScan sensor or use simulated data for demonstration purposes.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <AlertDialogAction onClick={() => handleConnectDevice(false)} className='h-20 flex flex-col'>
                  <Settings className='h-6 w-6 mb-2' />
                  <span className='font-bold text-md'>Connect to Real Sensor</span>
                  <span className='font-normal text-xs text-primary-foreground/80'>Listen for data from a physical device.</span>
                </AlertDialogAction>
                <AlertDialogAction onClick={() => handleConnectDevice(true)} className='h-20 flex flex-col'>
                  <TestTube2 className='h-6 w-6 mb-2' />
                  <span className='font-bold text-md'>Use Simulated Data</span>
                  <span className='font-normal text-xs text-primary-foreground/80'>Generate random measurements for demo.</span>
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        );
    }
  };


  return (
    <div className="flex flex-col min-h-screen bg-muted/30 text-foreground">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <AppLogo className="h-8 w-8 text-primary" />
            <span className="font-bold text-xl font-headline text-foreground">
              Digital Grain Moisture Analyzer
            </span>
          </div>
          <div className='flex items-center gap-4'>
            {/* Minimal header as buttons are now in the Hero section */}
          </div>
        </div>
      </header>

      <section className="relative w-full py-12 md:py-20 overflow-hidden bg-slate-950">
        <div className="absolute inset-0 opacity-40">
          {/* In a real environment, you'd use the generated image here. For now, we use a beautiful gradient pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/30 via-slate-900 to-slate-950"></div>
          <div className="absolute inset-0 bg-[grid-line:rgba(255,255,255,0.05)_1px_transparent_0] [background-size:40px_40px]"></div>
        </div>

        <div className="container relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary mb-6 animate-pulse">
              <Cpu className="mr-2 h-3 w-3" />
              Powered by Gemma 3:1B & ESP32
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6">
              The Future of <span className="text-primary italic">Smart Harvesting</span>
            </h1>
            <p className="text-xl text-slate-400 max-w-xl mb-10 leading-relaxed">
              Precision moisture analysis meets advanced AI. Get laboratory-grade insights directly from your field with our integrated sensor-to-cloud ecosystem.
            </p>
            <div className='flex flex-wrap gap-4'>
              {isClient && <ConnectButton />}
              <Button
                onClick={handleMeasure}
                size="lg"
                disabled={measurementState === 'measuring' || !isClient || deviceStatus !== 'connected'}
                className="font-bold text-lg px-8 h-14 shadow-lg shadow-primary/20"
              >
                {measurementState === 'measuring' ? <><LoadingSpinner /> Analyzing...</> : <><Cpu className="scale-125" /> Take Measurement</>}
              </Button>
            </div>
          </div>
        </div>

        <div className="absolute right-[-10%] top-1/2 -translate-y-1/2 hidden lg:block opacity-20 hover:opacity-100 transition-opacity duration-1000">
          <AppLogo className="h-[600px] w-[600px] text-primary rotate-12 blur-3xl" />
        </div>
      </section>

      <main className="flex-1 -mt-8 relative z-20">
        <div className="container py-6 md:py-8">
          <GrainAnalyzerDashboard
            deviceStatus={deviceStatus}
            measurementState={measurementState}
            isSimulated={isSimulated}
          />
        </div>
      </main>

      <footer className="py-6 mt-auto border-t bg-background">
        <div className="container flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Digital Grain Moisture Analyzer. Built for a better harvest.
          </p>
          <nav className="flex items-center gap-4">
            <Link href="/" className="text-sm font-medium text-muted-foreground hover:underline">Dashboard</Link>
            <Link href="/hardware" className="text-sm font-medium text-muted-foreground hover:underline">Hardware</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}

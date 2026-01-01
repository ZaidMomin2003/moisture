
'use client';

import { AppLogo, LoadingSpinner } from '@/components/icons';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Cloud, Wifi, CheckCircle2, AlertTriangle, RadioTower } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

type ConnectionStatus = 'waiting' | 'listening' | 'connected' | 'error';

export default function ConnectPage() {
    const [status, setStatus] = useState<ConnectionStatus>('waiting');
    const router = useRouter();

    useEffect(() => {
        if (status === 'listening') {
            const timer = setTimeout(() => {
                setStatus('error');
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [status]);
    
    const handleStartListening = () => {
        setStatus('listening');
    };

    const handleReturnToDashboard = () => {
        router.push('/');
    };

    const StatusIndicator = () => {
        switch (status) {
            case 'listening':
                return (
                    <div className="flex flex-col items-center gap-4 text-center">
                        <LoadingSpinner className="h-16 w-16 text-primary" />
                        <h2 className="text-2xl font-bold">Listening for Sensor Data...</h2>
                        <p className="text-muted-foreground">
                           Waiting for your ESP32 device to send its first signal to the cloud. <br/>
                           Make sure it's powered on and connected to Wi-Fi.
                        </p>
                    </div>
                );
            case 'connected':
                return (
                     <div className="flex flex-col items-center gap-4 text-center">
                        <CheckCircle2 className="h-16 w-16 text-green-500" />
                        <h2 className="text-2xl font-bold">Sensor Connected!</h2>
                        <p className="text-muted-foreground">
                           Successfully received data from device <code className="bg-primary/10 text-primary p-1 rounded-md">device_A4B2</code>. <br/> You can now return to the dashboard to take live measurements.
                        </p>
                        <Button onClick={handleReturnToDashboard} size="lg" className='mt-4'>Go to Dashboard</Button>
                    </div>
                );
             case 'error':
                 return (
                     <div className="flex flex-col items-center gap-4 text-center">
                        <AlertTriangle className="h-16 w-16 text-red-500" />
                        <h2 className="text-2xl font-bold">No Sensor Found</h2>
                        <p className="text-muted-foreground">
                           Could not detect a signal from any sensor device. Please check your hardware setup and firmware.
                        </p>
                        <Button onClick={handleStartListening} variant="outline" className='mt-4'>Try Again</Button>
                    </div>
                );
            case 'waiting':
            default:
                return (
                    <div className="flex flex-col items-center gap-4 text-center">
                        <RadioTower className="h-16 w-16 text-muted-foreground" />
                        <h2 className="text-2xl font-bold">Ready to Connect</h2>
                        <p className="text-muted-foreground">
                           This interface listens for data from a physical sensor via a cloud database.
                        </p>
                        <Button onClick={handleStartListening} size="lg" className='mt-4'>Start Listening</Button>
                    </div>
                );
        }
    }


    return (
        <div className="flex flex-col min-h-screen bg-muted/30 text-foreground">
            <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-16 items-center justify-between">
                    <div className="flex items-center gap-2">
                        <AppLogo className="h-8 w-8 text-primary" />
                        <span className="font-bold text-xl font-headline text-foreground">
                            Connect to Real Sensor
                        </span>
                    </div>
                     <nav className="flex items-center gap-4">
                        <Link href="/" className="text-sm font-medium text-muted-foreground hover:underline">Dashboard</Link>
                        <Link href="/hardware" className="text-sm font-medium text-muted-foreground hover:underline">Hardware</Link>
                    </nav>
                </div>
            </header>
            <main className="flex-1 flex items-center justify-center">
                <div className="container py-6 md:py-8">
                    <div className="max-w-2xl mx-auto">
                        <Card>
                            <CardHeader>
                                <CardTitle>Real Sensor Connection</CardTitle>
                                <CardDescription>
                                    This page connects the web application to your physical GrainScan device.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className='min-h-[300px] flex items-center justify-center'>
                                <StatusIndicator />
                            </CardContent>
                        </Card>
                        <div className="text-center mt-4">
                            <Link href="/" className='text-sm text-muted-foreground hover:underline'>
                                Or, go back and use simulated data
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
             <footer className="py-6 mt-auto">
                <div className="container flex items-center justify-center">
                    <p className="text-xs text-muted-foreground">
                        &copy; {new Date().getFullYear()} Digital Grain Moisture Analyzer. Built for a better harvest.
                    </p>
                </div>
            </footer>
        </div>
    );
}

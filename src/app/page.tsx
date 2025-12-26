import { GrainAnalyzer } from './components/grain-analyzer';
import { SensorControlPanel } from './components/sensor-control-panel';
import { GrainScanLogo } from '@/components/icons';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <div className="mr-4 flex items-center">
            <GrainScanLogo className="h-8 w-8 mr-2 text-blue-500" />
            <span className="font-bold text-xl font-headline text-gray-800 dark:text-gray-200">
              GrainScan
            </span>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="container py-8 md:py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <GrainAnalyzer />
            </div>
            <div className="md:col-span-1">
              <SensorControlPanel />
            </div>
          </div>
        </div>
      </main>

      <footer className="py-6 md:py-8 mt-auto border-t">
        <div className="container flex items-center justify-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} GrainScan. Built for a better harvest.
          </p>
        </div>
      </footer>
    </div>
  );
}

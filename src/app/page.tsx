import { GrainAnalyzer } from './components/grain-analyzer';
import { GrainScanLogo } from '@/components/icons';
import { Wifi } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center">
            <GrainScanLogo className="h-8 w-8 mr-2 text-primary" />
            <span className="font-bold text-xl font-headline text-foreground">
              GrainScan
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-green-600 font-semibold">
            <Wifi className="h-5 w-5" />
            <span>Device Connected</span>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="container py-8 md:py-12">
          <div className="max-w-3xl mx-auto">
             <GrainAnalyzer />
          </div>
        </div>
      </main>

      <footer className="py-6 md:py-8 mt-auto">
        <div className="container flex items-center justify-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} GrainScan. Built for a better harvest.
          </p>
        </div>
      </footer>
    </div>
  );
}

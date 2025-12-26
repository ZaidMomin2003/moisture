import { GrainAnalyzerDashboard } from './components/grain-analyzer-dashboard';
import { GrainScanLogo } from '@/components/icons';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-muted/30 text-foreground">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <GrainScanLogo className="h-8 w-8 text-primary" />
            <span className="font-bold text-xl font-headline text-foreground">
              GrainScan Dashboard
            </span>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="container py-6 md:py-8">
          <GrainAnalyzerDashboard />
        </div>
      </main>

      <footer className="py-6 mt-auto">
        <div className="container flex items-center justify-center">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} GrainScan. Built for a better harvest.
          </p>
        </div>
      </footer>
    </div>
  );
}

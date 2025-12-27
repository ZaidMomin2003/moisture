import { GrainScanLogo } from '@/components/icons';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Check } from 'lucide-react';

const hardwareList = [
    {
        category: 'Core Components',
        items: [
            { name: 'ESP32 Development Board', description: 'The "brain" of the device. It has built-in Wi-Fi to create a hotspot and web server, and pins to connect the sensor. A WEMOS D1 Mini ESP32 or a similar board is a great choice.' },
            { name: 'Capacitive Moisture Sensor', description: 'This measures the grain moisture. A "Capacitive Soil Moisture Sensor v1.2" is a cheap and widely available option that works on the same principle needed for grain.' },
            { name: '5V Power Bank', description: 'To make the device portable, you\'ll need a standard USB power bank, like one you\'d use for a phone.' },
        ]
    },
    {
        category: 'Wiring & Assembly',
        items: [
            { name: 'Jumper Wires', description: 'A pack of male-to-female DuPont jumper wires to connect the sensor to the ESP32 without soldering.' },
            { name: 'Small Breadboard', description: 'Optional, but helpful for creating a stable circuit, especially if you add more components.' },
            { name: 'Micro USB Cable', description: 'To program the ESP32 and connect it to the power bank.' },
        ]
    },
    {
        category: 'Enclosure (Optional but Recommended)',
        items: [
            { name: '3D Printed Case', description: 'A custom-designed case to house the ESP32, battery, and provide a stable mount for the sensor, creating a single, handheld unit.' },
            { name: 'Plastic Project Box', description: 'A simpler alternative to a 3D printed case. You can cut holes for the sensor and USB port.' },
        ]
    }
];

export default function HardwarePage() {
    return (
        <div className="flex flex-col min-h-screen bg-muted/30 text-foreground">
            <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-16 items-center justify-between">
                    <div className="flex items-center gap-2">
                        <GrainScanLogo className="h-8 w-8 text-primary" />
                        <span className="font-bold text-xl font-headline text-foreground">
                            GrainScan Hardware
                        </span>
                    </div>
                     <nav className="flex items-center gap-4">
                        <Link href="/" className="text-sm font-medium text-muted-foreground hover:underline">Dashboard</Link>
                        <Link href="/hardware" className="text-sm font-medium text-primary hover:underline">Hardware</Link>
                    </nav>
                </div>
            </header>
            <main className="flex-1">
                <div className="container py-6 md:py-8">
                    <div className="max-w-4xl mx-auto">
                        <h1 className="text-3xl font-bold mb-2">Hardware Shopping List</h1>
                        <p className="text-muted-foreground mb-8">Here are the components needed to build a physical GrainScan device. You can find these items on sites like Amazon, AliExpress, or specialty electronics stores.</p>

                        <div className="space-y-8">
                            {hardwareList.map((section) => (
                                <Card key={section.category}>
                                    <CardHeader>
                                        <CardTitle>{section.category}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <ul className="space-y-4">
                                            {section.items.map((item) => (
                                                <li key={item.name} className="flex items-start gap-4">
                                                    <Check className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                                                    <div>
                                                        <p className="font-semibold">{item.name}</p>
                                                        <p className="text-sm text-muted-foreground">{item.description}</p>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
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
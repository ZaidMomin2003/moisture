'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Cpu, HardDrive, Code, Wifi } from 'lucide-react';

export function HardwareIntegrationGuide() {
  const steps = [
    {
      title: 'Step 1: Choose Your Hardware',
      icon: <HardDrive className="h-5 w-5 text-primary" />,
      content: (
        <div>
          <p className="font-semibold">1. Microcontroller:</p>
          <p className="mb-2 text-muted-foreground">
            An <span className="font-bold text-primary-foreground">ESP32</span> is highly recommended. It's powerful, affordable, and has built-in Wi-Fi, which is perfect for this project.
          </p>
          <p className="font-semibold">2. Sensor:</p>
          <p className="text-muted-foreground">
            Start with a <span className="font-bold text-primary-foreground">capacitive soil moisture sensor</span>. While designed for soil, its principles are the same and it's a great, low-cost way to prototype a capacitive grain moisture reader.
          </p>
        </div>
      ),
    },
    {
      title: 'Step 2: Write the Microcontroller Code',
      icon: <Code className="h-5 w-5 text-primary" />,
      content: (
        <div>
          <p className="font-semibold">1. Set up Arduino IDE:</p>
          <p className="mb-2 text-muted-foreground">
            Install the Arduino IDE and add support for the ESP32 board.
          </p>
          <p className="font-semibold">2. Read the Sensor:</p>
          <p className="mb-2 text-muted-foreground">
            Write a simple sketch to read the analog or digital value from your capacitive sensor. You can print these values to the serial monitor to see them change as you test different materials.
          </p>
           <p className="font-semibold">3. Create a Wi-Fi Hotspot & Web Server:</p>
          <p className="text-muted-foreground">
            Program the ESP32 to create its own Wi-Fi network (Access Point). Then, set up a small web server that responds to requests with the latest sensor reading, formatted as JSON (e.g., <code className="bg-muted px-1 py-0.5 rounded">{`{"rawValue": 450}`}</code>).
          </p>
        </div>
      ),
    },
    {
      title: 'Step 3: Connect the Web App',
      icon: <Wifi className="h-5 w-5 text-primary" />,
      content: (
        <div>
           <p className="font-semibold">1. Connect to the Device:</p>
          <p className="mb-2 text-muted-foreground">
            From your phone or computer running this web app, connect to the Wi-Fi network hosted by your ESP32. The "Device Connection" panel simulates this step.
          </p>
          <p className="font-semibold">2. Fetch Data:</p>
          <p className="mb-2 text-muted-foreground">
            In the `GrainAnalyzer` component, instead of generating a random number, use the `fetch()` API to make a request to your ESP32's server endpoint (e.g., <code className="bg-muted px-1 py-0.5 rounded">fetch('http://192.168.4.1/data')</code>).
          </p>
          <p className="font-semibold">3. Display Real Data:</p>
          <p className="text-muted-foreground">
            Parse the JSON response from the ESP32 and use that value to set the state for your moisture reading. Now, the number on the screen comes from your actual hardware!
          </p>
        </div>
      ),
    },
    {
      title: 'Step 4: Calibrate',
      icon: <Cpu className="h-5 w-5 text-primary" />,
      content: (
        <div>
          <p>
            The raw sensor values (like `450`) don't mean much. Calibration is the process of converting these raw values into an actual moisture percentage (%).
          </p>
          <p className="font-semibold mt-2">The Basic Method:</p>
          <ol className="list-decimal list-inside text-muted-foreground space-y-1 mt-1">
            <li>Take a reading of a completely dry grain sample (0% moisture). Record the raw sensor value.</li>
            <li>Take a reading of a very damp grain sample. Record that raw value.</li>
            <li>Use these two points to create a linear map (like the `map()` function in Arduino) to convert any raw reading into an approximate percentage.</li>
          </ol>
        </div>
      ),
    },
  ];

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline">Hardware Integration Steps</CardTitle>
        <CardDescription>
          A guide to connecting a real-world sensor to this application.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {steps.map((step, index) => (
            <AccordionItem value={`item-${index + 1}`} key={index}>
              <AccordionTrigger>
                <div className="flex items-center gap-4">
                  {step.icon}
                  <span className="font-semibold text-lg">{step.title}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pl-11 text-base">
                {step.content}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}

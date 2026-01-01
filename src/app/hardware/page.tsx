
'use client';

import { AppLogo } from '@/components/icons';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Check, Code, HardHat, Cloud, RadioTower, Wifi } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';


const hardwareList = [
    {
        category: 'Core Components',
        items: [
            { name: 'ESP32 Development Board', description: 'The "brain" of the device. It has built-in Wi-Fi to connect to the cloud. A WEMOS D1 Mini ESP32 or a similar board is a great choice.' },
            { name: 'Capacitive Moisture Sensor', description: 'This measures the grain moisture. A "Capacitive Soil Moisture Sensor v1.2" is a cheap and widely available option that works on the same principle needed for grain.' },
            { name: '5V Power Bank', description: 'To make the device portable, you\'ll need a standard USB power bank, like one you\'d use for a phone.' },
        ]
    },
    {
        category: 'Wiring & Assembly',
        items: [
            { name: 'Jumper Wires', description: 'A pack of male-to-female DuPont jumper wires to connect the sensor to the ESP32 without soldering.' },
            { name: 'Micro USB Cable', description: 'To program the ESP32 and connect it to the power bank.' },
        ]
    },
];

const firmwareCode = `
#include <WiFi.h>
#include <Firebase_ESP_Client.h>

// --- Update these values ---
#define WIFI_SSID "YOUR_WIFI_SSID"
#define WIFI_PASSWORD "YOUR_WIFI_PASSWORD"
#define API_KEY "YOUR_FIREBASE_WEB_API_KEY"
#define FIREBASE_PROJECT_ID "YOUR_FIREBASE_PROJECT_ID"
// --- (No need to change below this line) ---

#define USER_EMAIL "device@grainscan.com"
#define USER_PASSWORD "device_password"
#define SENSOR_PIN 34 // Use a valid ADC pin on your ESP32

FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

unsigned long sendDataPrevMillis = 0;
const char* deviceId = "device_A4B2"; // Static device ID

void setup() {
  Serial.begin(115200);
  pinMode(SENSOR_PIN, INPUT);

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(500);
  }
  Serial.println();
  Serial.print("Connected with IP: ");
  Serial.println(WiFi.localIP());

  config.api_key = API_KEY;
  config.project_id = FIREBASE_PROJECT_ID;
  auth.user.email = USER_EMAIL;
  auth.user.password = USER_PASSWORD;

  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);

  // Check if user exists, create if not
  if (!Firebase.userReady()){
    Serial.println("Signing up new device user...");
    if (Firebase.createUser(fbdo, API_KEY, USER_EMAIL, USER_PASSWORD)) {
      Serial.println("Device user created successfully.");
    } else {
      Serial.println("Failed to create user: " + fbdo.errorReason());
    }
  } else {
    Serial.println("Device user already exists.");
  }
}

void loop() {
  // Wait for Firebase to be ready and 10 seconds to pass
  if (Firebase.ready() && (millis() - sendDataPrevMillis > 10000)) {
    sendDataPrevMillis = millis();

    int rawValue = analogRead(SENSOR_PIN);
    Serial.print("Sensor raw value: ");
    Serial.println(rawValue);

    // Document path in Firestore: /live_reading/{deviceId}
    String documentPath = "live_reading/" + String(deviceId);
    
    // JSON payload
    String jsonPayload = "{\\"fields\\":{\\"rawValue\\":{\\"integerValue\\":\\"" + String(rawValue) + "\\"},\\"timestamp\\":{\\"integerValue\\":\\"" + String(millis()) + "\\"}}}";

    Serial.printf("Writing to Firestore path: %s\\n", documentPath.c_str());
    if (Firebase.Firestore.patchDocument(fbdo, FIREBASE_PROJECT_ID, "", documentPath.c_str(), jsonPayload.c_str())) {
      Serial.println("Firestore write PASSED");
    } else {
      Serial.println("Firestore write FAILED");
      Serial.println("REASON: " + fbdo.errorReason());
    }
  }
}
`;


export default function HardwarePage() {
    const { toast } = useToast();

    const copyToClipboard = () => {
        navigator.clipboard.writeText(firmwareCode);
        toast({
            title: "Code Copied!",
            description: "The firmware code has been copied to your clipboard.",
        });
    }

    return (
        <div className="flex flex-col min-h-screen bg-muted/30 text-foreground">
            <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-16 items-center justify-between">
                    <div className="flex items-center gap-2">
                        <AppLogo className="h-8 w-8 text-primary" />
                        <span className="font-bold text-xl font-headline text-foreground">
                            Hardware Guide
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
                        <div className="text-center mb-8">
                            <HardHat className="h-12 w-12 mx-auto text-primary" />
                            <h1 className="text-4xl font-bold mt-4">Build Your Own Sensor</h1>
                            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">Follow these steps to build a physical Grain Moisture Analyzer, connect it to the cloud, and see live data in this app.</p>
                        </div>
                        

                        <div className="space-y-12">
                            
                            {/* Step 1 */}
                            <Card className='border-primary border-2'>
                                <CardHeader>
                                    <CardTitle className='flex items-center gap-3'><span className='flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground font-bold text-lg'>1</span> Gather Your Components</CardTitle>
                                    <CardDescription>You can find these items on sites like Amazon, AliExpress, or specialty electronics stores.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                     {hardwareList.map((section) => (
                                        <div key={section.category}>
                                            <h3 className='font-semibold mb-2'>{section.category}</h3>
                                            <ul className="space-y-3">
                                                {section.items.map((item) => (
                                                    <li key={item.name} className="flex items-start gap-3">
                                                        <Check className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                                                        <div>
                                                            <p className="font-medium">{item.name}</p>
                                                            <p className="text-sm text-muted-foreground">{item.description}</p>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>

                             {/* Step 2 */}
                             <Card className='border-primary border-2'>
                                <CardHeader>
                                    <CardTitle className='flex items-center gap-3'><span className='flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground font-bold text-lg'>2</span> Set Up the Cloud Backend</CardTitle>
                                     <CardDescription>The device sends data to the app via Google Firebase. You'll need a free Firebase account.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-4">
                                        <li className='flex items-start gap-3'>
                                            <Check className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                                            <div>
                                                <p className="font-medium">Create a Firebase Project</p>
                                                <p className="text-sm text-muted-foreground">Go to the <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" className='underline text-primary'>Firebase Console</a>, click "Add Project", and follow the setup steps.</p>
                                            </div>
                                        </li>
                                        <li className='flex items-start gap-3'>
                                            <Check className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                                            <div>
                                                <p className="font-medium">Get Your Web API Key & Project ID</p>
                                                <p className="text-sm text-muted-foreground">In your new project, go to Project Settings (click the gear icon). Under the "General" tab, you'll find your <strong>Project ID</strong> and <strong>Web API Key</strong>. You'll need these for the device code.</p>
                                            </div>
                                        </li>
                                        <li className='flex items-start gap-3'>
                                            <Check className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                                            <div>
                                                <p className="font-medium">Set Up Firestore</p>
                                                <p className="text-sm text-muted-foreground">In the "Build" menu, click "Firestore Database" and create a new database in <strong>Test Mode</strong>. This will allow your device to write data without complex security rules for now.</p>
                                            </div>
                                        </li>
                                         <li className='flex items-start gap-3'>
                                            <Check className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                                            <div>
                                                <p className="font-medium">Enable Authentication</p>
                                                <p className="text-sm text-muted-foreground">In the "Build" menu, click "Authentication". Go to the "Sign-in method" tab and enable the <strong>Email/Password</strong> provider. The code uses this to create and sign in a user for the device itself.</p>
                                            </div>
                                        </li>
                                    </ul>
                                </CardContent>
                            </Card>

                             {/* Step 3 */}
                            <Card className='border-primary border-2'>
                                <CardHeader>
                                    <CardTitle className='flex items-center gap-3'><span className='flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground font-bold text-lg'>3</span> Program the Device</CardTitle>
                                    <CardDescription>This is the code you'll flash onto your ESP32. It reads the sensor and sends the data to Firebase.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="relative bg-muted p-4 rounded-lg text-xs overflow-x-auto">
                                        <Button size="sm" className="absolute top-2 right-2" onClick={copyToClipboard}>Copy Code</Button>
                                        <pre><code>{firmwareCode}</code></pre>
                                    </div>
                                     <ul className="space-y-4 mt-4 text-sm">
                                         <li className='flex items-start gap-3'>
                                            <Check className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                                            <div>
                                                <p className="font-medium">Update Credentials</p>
                                                <p className="text-muted-foreground">In the code, replace the placeholder values for <code className='text-foreground bg-primary/10 px-1 py-0.5 rounded'>WIFI_SSID</code>, <code className='text-foreground bg-primary/10 px-1 py-0.5 rounded'>WIFI_PASSWORD</code>, <code className='text-foreground bg-primary/10 px-1 py-0.5 rounded'>API_KEY</code>, and <code className='text-foreground bg-primary/10 px-1 py-0.5 rounded'>FIREBASE_PROJECT_ID</code> with your own.</p>
                                            </div>
                                        </li>
                                        <li className='flex items-start gap-3'>
                                            <Check className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                                            <div>
                                                <p className="font-medium">Wire the Sensor</p>
                                                <p className="text-muted-foreground">Connect the sensor to the ESP32. Connect VCC to 3.3V, GND to GND, and the Analog (AOUT) pin to pin 34 on the ESP32. If you use a different pin, update <code className='text-foreground bg-primary/10 px-1 py-0.5 rounded'>SENSOR_PIN</code> in the code.</p>
                                            </div>
                                        </li>
                                        <li className='flex items-start gap-3'>
                                            <Check className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                                            <div>
                                                <p className="font-medium">Flash the Code</p>
                                                <p className="text-muted-foreground">Using the Arduino IDE with the ESP32 board manager installed, upload this code to your device.</p>
                                            </div>
                                        </li>
                                     </ul>
                                </CardContent>
                            </Card>

                            {/* Step 4 */}
                            <Card className='border-primary border-2'>
                                <CardHeader>
                                    <CardTitle className='flex items-center gap-3'><span className='flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground font-bold text-lg'>4</span> Connect and Measure</CardTitle>
                                    <CardDescription>With your device powered on and sending data, it's time to connect the app.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-4">
                                        <li className='flex items-start gap-3'>
                                            <Check className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                                            <div>
                                                <p className="font-medium">Go to the Connect Page</p>
                                                <p className="text-sm text-muted-foreground">Navigate to the <Link href="/connect" className="text-primary underline">Connect Page</Link> and click "Start Listening". The app will now check Firebase for data from your sensor.</p>
                                            </div>
                                        </li>
                                        <li className='flex items-start gap-3'>
                                            <Check className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                                            <div>
                                                <p className="font-medium">See the Live Data</p>
                                                <p className="text-sm text-muted-foreground">If the connection is successful, you'll be redirected to the dashboard, where you can now use the "Measure Moisture" button to get real readings from your device.</p>
                                            </div>
                                        </li>
                                    </ul>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </main>
             <footer className="py-6 mt-auto">
                <div className="container flex items-center justify-center">
                    <p className="text-xs text-muted-foreground">
                        &copy; {new Date().getFullYear()} Digital Grain Moisture Analyzer. Happy building!
                    </p>
                </div>
            </footer>
        </div>
    );
}


    
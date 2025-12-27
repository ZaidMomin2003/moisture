import { GrainScanLogo } from '@/components/icons';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Check, Wifi, Cloud, Code } from 'lucide-react';

const hardwareList = [
    {
        category: 'Core Components',
        items: [
            { name: 'ESP32 Development Board', description: 'The "brain" of the device. It has built-in Wi-Fi to connect to the cloud or create a hotspot. A WEMOS D1 Mini ESP32 or a similar board is a great choice.' },
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
    {
        category: 'Enclosure (Optional but Recommended)',
        items: [
            { name: '3D Printed Case', description: 'A custom-designed case to house the ESP32, battery, and provide a stable mount for the sensor, creating a single, handheld unit.' },
        ]
    }
];

const firmwareCode = `
// Required Libraries (Install via Arduino IDE Library Manager):
// - "Firebase Arduino Client Library for ESP32 and ESP8266" by Mobizt
// - "ArduinoJson" by Benoit Blanchon

#include <WiFi.h>
#include <Firebase_ESP_Client.h>
#include <ArduinoJson.h>

// --- WIFI CREDENTIALS ---
#define WIFI_SSID "YOUR_WIFI_SSID"
#define WIFI_PASSWORD "YOUR_WIFI_PASSWORD"

// --- FIREBASE PROJECT CONFIG ---
#define API_KEY "YOUR_FIREBASE_WEB_API_KEY"
#define FIREBASE_PROJECT_ID "YOUR_FIREBASE_PROJECT_ID"
#define USER_EMAIL "device@grainscan.com" // A generic email for the device
#define USER_PASSWORD "device_password"  // A secure password for the device user

// --- SENSOR PIN ---
#define SENSOR_PIN 34 // ESP32 ADC1_CH6

// Firebase objects
FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

unsigned long sendDataPrevMillis = 0;

void setup() {
  Serial.begin(115200);

  // --- Connect to Wi-Fi ---
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(300);
  }
  Serial.println();
  Serial.print("Connected with IP: ");
  Serial.println(WiFi.localIP());

  // --- Configure Firebase ---
  config.api_key = API_KEY;
  config.project_id = FIREBASE_PROJECT_ID;
  auth.user.email = USER_EMAIL;
  auth.user.password = USER_PASSWORD;

  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);

  // Set up a new user for the device if it doesn't exist
  if (!Firebase.userReady()){
    Serial.println("Creating new device user...");
    Firebase.createUser(fbdo, API_KEY, USER_EMAIL, USER_PASSWORD);
  }
}

void loop() {
  // Send data to Firestore every 5 seconds
  if (Firebase.ready() && (millis() - sendDataPrevMillis > 5000)) {
    sendDataPrevMillis = millis();

    // --- Read Sensor ---
    int rawValue = analogRead(SENSOR_PIN);
    Serial.print("Sensor raw value: ");
    Serial.println(rawValue);

    // --- Prepare Data for Firestore ---
    // The path to the document: /live_reading/device_A4B2
    String documentPath = "live_reading/device_A4B2";

    // The data to write
    // Using ArduinoJson to create a JSON object
    StaticJsonDocument<200> jsonDoc;
    jsonDoc["rawValue"] = rawValue;
    jsonDoc["timestamp"] = millis(); // Example timestamp

    String jsonString;
    serializeJson(jsonDoc, jsonString);

    // --- Write to Firestore ---
    Serial.printf("Writing to Firestore: %s\\n", documentPath.c_str());
    if (Firebase.Firestore.patchDocument(fbdo, FIREBASE_PROJECT_ID, "", documentPath.c_str(), jsonString.c_str())) {
      Serial.println("Firestore write PASSED");
    } else {
      Serial.println("Firestore write FAILED");
      Serial.println("REASON: " + fbdo.errorReason());
    }
  }
}
`;


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

                            <Card>
                                <CardHeader>
                                    <CardTitle>Connection Architecture</CardTitle>
                                    <CardDescription>How the hardware sends data to the app.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                           <Wifi className="h-6 w-6 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-lg">Option 1: Local Hotspot (Simple)</h3>
                                            <p className="text-muted-foreground text-sm">The ESP32 creates its own Wi-Fi network. You connect your phone/laptop to it, and the app communicates directly with the device.
                                            <br /> <span className="font-semibold text-amber-600">This method does NOT work if the app is hosted on Vercel.</span>
                                            </p>
                                        </div>
                                    </div>
                                     <div className="flex items-start gap-4">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                            <Cloud className="h-6 w-6 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-lg">Option 2: Cloud Connected (Vercel-Friendly)</h3>
                                            <p className="text-muted-foreground text-sm">The ESP32 connects to your home Wi-Fi and pushes sensor data to a cloud database (like Firebase Firestore). The app, hosted on Vercel, reads from that same database.
                                            <br /> <span className="font-semibold text-green-600">This is the recommended approach for a real-world, deployable product.</span>
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                             <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Code className="h-5 w-5" />
                                        ESP32 Firmware Example (Arduino C++)
                                    </CardTitle>
                                    <CardDescription>This is the code you would flash onto your ESP32. It handles connecting to Wi-Fi and sending sensor data to Firebase Firestore.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="bg-muted p-4 rounded-lg text-xs overflow-x-auto">
                                        <pre><code>{firmwareCode}</code></pre>
                                    </div>
                                     <p className="text-xs text-muted-foreground mt-4">
                                        <strong>Note:</strong> You will need to replace the placeholder values (e.g., <code className='text-foreground bg-primary/10 px-1 py-0.5 rounded'>YOUR_WIFI_SSID</code>, <code className='text-foreground bg-primary/10 px-1 py-0.5 rounded'>YOUR_FIREBASE_PROJECT_ID</code>) with your actual credentials before uploading this code to your device.
                                    </p>
                                </CardContent>
                            </Card>
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

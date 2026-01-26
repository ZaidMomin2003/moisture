
import { NextResponse } from 'next/server';

// Simple in-memory storage for the latest sensor reading
// Note: In a production serverless environment, this wouldn't persist. 
// But for local development with 'npm run dev', this works perfectly for connecting your ESP32.
let latestReading = {
    rawValue: 0,
    timestamp: Date.now()
};

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Validate input
        if (typeof body.rawValue !== 'number') {
            return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
        }

        // Update the storage
        latestReading = {
            rawValue: body.rawValue,
            timestamp: Date.now()
        };

        console.log(`[Sensor API] Received: ${latestReading.rawValue}`);

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
    }
}

export async function GET() {
    return NextResponse.json(latestReading);
}

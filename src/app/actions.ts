
'use server';

import { z } from 'zod';
import { calibrateMoistureReadings, CalibrateMoistureReadingsInput } from '@/ai/flows/calibrate-moisture-readings';

const CalibrateSchema = z.object({
  grainType: z.string(),
  sampleData: z
    .array(z.object({
      sensorReading: z.number(),
      actualMoisture: z.number(),
    })),
});

export async function getCalibration(data: CalibrateMoistureReadingsInput) {
    const validatedData = CalibrateSchema.safeParse(data);
    if (!validatedData.success) {
        throw new Error("Invalid input data for calibration.");
    }
    
    try {
        const result = await calibrateMoistureReadings(validatedData.data);
        return result;
    } catch (error) {
        console.error("Calibration failed:", error);
        throw new Error("Failed to get calibration from AI model.");
    }
}

'use server';

/**
 * @fileOverview A tool for calibrating moisture readings using a regression model.
 *
 * - calibrateMoistureReadings - A function that calibrates moisture readings based on sample grain data.
 * - CalibrateMoistureReadingsInput - The input type for the calibrateMoistureReadings function.
 * - CalibrateMoistureReadingsOutput - The return type for the calibrateMoistureReadings function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CalibrateMoistureReadingsInputSchema = z.object({
  grainType: z
    .string()
    .describe('The type of grain being calibrated (e.g., rice, wheat, maize).'),
  sampleData: z
    .array(z.object({
      sensorReading: z.number().describe('The raw sensor reading.'),
      actualMoisture: z.number().describe('The actual moisture content of the sample.'),
    }))
    .describe('An array of sample data points, each containing a sensor reading and the corresponding actual moisture content.'),
});
export type CalibrateMoistureReadingsInput = z.infer<typeof CalibrateMoistureReadingsInputSchema>;

const CalibrateMoistureReadingsOutputSchema = z.object({
  calibrationEquation: z
    .string()
    .describe('The equation for calibrating moisture readings based on the regression model.'),
  rSquared: z
    .number()
    .describe('The R-squared value indicating the goodness of fit of the regression model.'),
});
export type CalibrateMoistureReadingsOutput = z.infer<typeof CalibrateMoistureReadingsOutputSchema>;

export async function calibrateMoistureReadings(
  input: CalibrateMoistureReadingsInput
): Promise<CalibrateMoistureReadingsOutput> {
  return calibrateMoistureReadingsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'calibrateMoistureReadingsPrompt',
  input: {schema: CalibrateMoistureReadingsInputSchema},
  output: {schema: CalibrateMoistureReadingsOutputSchema},
  prompt: `You are an expert in data analysis and regression modeling for agricultural applications.

  Given the following grain type and sample data, generate a simple regression model to calibrate the moisture readings of a grain moisture analyzer.

  Grain Type: {{{grainType}}}
  Sample Data:{{#each sampleData}} Sensor Reading: {{{this.sensorReading}}}, Actual Moisture: {{{this.actualMoisture}}}\n{{/each}}

  Provide the calibration equation and the R-squared value indicating the goodness of fit of the model.
  Ensure that the equation is easy to implement in embedded systems.
  Respond in this format:
  Calibration Equation: <equation>
R-squared: <r-squared_value>
`,
});

const calibrateMoistureReadingsFlow = ai.defineFlow(
  {
    name: 'calibrateMoistureReadingsFlow',
    inputSchema: CalibrateMoistureReadingsInputSchema,
    outputSchema: CalibrateMoistureReadingsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

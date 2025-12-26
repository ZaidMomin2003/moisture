'use server';
/**
 * @fileOverview Provides AI-powered harvest advice.
 *
 * - getHarvestAdvice - A function that uses Genkit to determine harvest readiness.
 * - GetHarvestAdviceInput - The input type for the getHarvestAdvice function.
 * - GetHarvestAdviceOutput - The return type for the getHarvestAdvice function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const DailyForecastSchema = z.object({
  day: z.string().describe('The day of the week (e.g., "Mon").'),
  high: z.number().describe('The forecasted high temperature in Celsius.'),
  low: z.number().describe('The forecasted low temperature in Celsius.'),
});

const GetHarvestAdviceInputSchema = z.object({
  grainType: z.enum(['Rice', 'Wheat', 'Maize']).describe('The type of grain being analyzed.'),
  moistureContent: z.number().describe('The current measured moisture content percentage of the grain.'),
  temperatureForecast: z.array(DailyForecastSchema).describe('An array of 7-day temperature forecasts.'),
});

const GetHarvestAdviceOutputSchema = z.object({
  status: z.enum(['good', 'caution', 'bad']).describe('A simple status indicating the harvest recommendation.'),
  title: z.string().describe('A short, descriptive title for the advice (e.g., "Good to Harvest").'),
  suggestion: z.string().describe('A detailed explanation for the recommendation, considering moisture, grain type, and weather forecast.'),
});

export type GetHarvestAdviceInput = z.infer<typeof GetHarvestAdviceInputSchema>;
export type GetHarvestAdviceOutput = z.infer<typeof GetHarvestAdviceOutputSchema>;

export async function getHarvestAdvice(input: GetHarvestAdviceInput): Promise<GetHarvestAdviceOutput> {
  return getHarvestAdviceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getHarvestAdvicePrompt',
  input: { schema: GetHarvestAdviceInputSchema },
  output: { schema: GetHarvestAdviceOutputSchema },
  prompt: `You are an expert agricultural advisor specializing in grain harvesting. Your task is to provide a clear and actionable recommendation based on the provided data.

Analyze the following information:
- Grain Type: {{{grainType}}}
- Current Moisture Content: {{{moistureContent}}}%
- 7-Day Temperature Forecast:
{{#each temperatureForecast}}
  - {{day}}: High {{high}}}°C, Low {{low}}}°C
{{/each}}

Based on this data, determine if it's a good time to harvest. Consider the ideal moisture levels for the specified grain and how the upcoming temperature trend (e.g., upcoming rain or heat) might affect the harvest decision.

Ideal Moisture Levels:
- Wheat: 13.5% is ideal. Up to 15.5% is acceptable but may require drying.
- Rice: 14% is ideal. Up to 16% is acceptable but may require drying.
- Maize: 15.5% is ideal. Up to 18% is acceptable but may require drying.

Your response must be in the specified JSON format with three fields: 'status', 'title', and 'suggestion'. The suggestion should be a concise, easy-to-understand recommendation for a farmer.`,
});

const getHarvestAdviceFlow = ai.defineFlow(
  {
    name: 'getHarvestAdviceFlow',
    inputSchema: GetHarvestAdviceInputSchema,
    outputSchema: GetHarvestAdviceOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error('Failed to get a response from the AI model.');
    }
    return output;
  }
);

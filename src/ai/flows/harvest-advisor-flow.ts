'use server';
import { ai } from '@/ai/genkit';
import { z } from 'zod';

export const HarvestAdviceInputSchema = z.object({
  grainType: z.enum(['Wheat', 'Rice', 'Maize']),
  moisture: z.number(),
});

export type HarvestAdviceInput = z.infer<typeof HarvestAdviceInputSchema>;

export const HarvestAdviceSchema = z.object({
  status: z.enum(['good', 'caution', 'bad']).describe('A single-word assessment of the situation. "good" for ideal conditions, "caution" for acceptable but not ideal, "bad" for poor conditions.'),
  title: z.string().describe('A short, catchy title for the advice (e.g., "Good to Harvest", "Harvest with Caution").'),
  suggestion: z.string().describe('A detailed suggestion for the user, explaining the reasoning. Provide actionable advice.'),
});

export type HarvestAdvice = z.infer<typeof HarvestAdviceSchema>;

const harvestAdvisorPrompt = ai.definePrompt({
  name: 'harvestAdvisorPrompt',
  input: { schema: HarvestAdviceInputSchema },
  output: { schema: HarvestAdviceSchema },
  prompt: `
    You are an expert agronomist and farm advisor.
    Your task is to provide clear, actionable advice to a farmer about whether to harvest their grain based on its moisture content.

    The user has provided the following information:
    - Grain Type: {{{grainType}}}
    - Moisture Content: {{{moisture}}}%

    Based on this data, provide a recommendation. Consider the ideal and acceptable moisture levels for the given grain type.
    - For Wheat, ideal is below 13.5%, acceptable up to 15.5%.
    - For Rice, ideal is below 14%, acceptable up to 16%.
    - For Maize (Corn), ideal is below 15.5%, acceptable up to 18%.

    - If moisture is at or below the ideal level, the status should be 'good'.
    - If moisture is between the ideal and acceptable level, the status should be 'caution'.
    - If moisture is above the acceptable level, the status should be 'bad'.

    Generate a response with a status, a clear title, and a helpful suggestion explaining why and what to do.
  `,
});


export const harvestAdvisorFlow = ai.defineFlow(
  {
    name: 'harvestAdvisorFlow',
    inputSchema: HarvestAdviceInputSchema,
    outputSchema: HarvestAdviceSchema,
  },
  async (input) => {
    const { output } = await harvestAdvisorPrompt(input);
    return output!;
  }
);

export async function getHarvestAdvice(input: HarvestAdviceInput): Promise<HarvestAdvice> {
  return harvestAdvisorFlow(input);
}

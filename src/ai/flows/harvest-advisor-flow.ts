'use server';
import { ai } from '@/ai/genkit';
import { HarvestAdviceInputSchema, HarvestAdviceSchema, type HarvestAdvice, type HarvestAdviceInput } from './harvest-advisor-shared';


const harvestAdvisorFlow = ai.defineFlow(
  {
    name: 'harvestAdvisorFlow',
    inputSchema: HarvestAdviceInputSchema,
    outputSchema: HarvestAdviceSchema,
  },
  async (input) => {
    const { output } = await ai.generate({
      model: 'googleai/gemini-2.5-flash-preview-09-2025',
      prompt: `
        You are an expert agronomist and farm advisor.
        Your task is to provide clear, actionable advice to a farmer about whether to harvest their grain based on its moisture content.

        The user has provided the following information:
        - Grain Type: ${input.grainType}
        - Moisture Content: ${input.moisture}%

        Based on this data, provide a recommendation. Consider the ideal and acceptable moisture levels for the given grain type.
        - For Wheat, ideal is below 13.5%, acceptable up to 15.5%.
        - For Rice, ideal is below 14%, acceptable up to 16%.
        - For Maize (Corn), ideal is below 15.5%, acceptable up to 18%.

        - If moisture is at or below the ideal level, the status should be 'good'.
        - If moisture is between the ideal and acceptable level, the status should be 'caution'.
        - If moisture is above the acceptable level, the status should be 'bad'.

        Generate a response with a status, a clear title, and a helpful suggestion explaining why and what to do.
      `,
      output: {
        schema: HarvestAdviceSchema,
      }
    });
    return output!;
  }
);

export async function getHarvestAdvice(input: HarvestAdviceInput): Promise<HarvestAdvice> {
  return harvestAdvisorFlow(input);
}

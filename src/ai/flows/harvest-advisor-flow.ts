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
      model: 'ollama/gemma3:1b',
      system: 'You are an expert post-harvest storage consultant. You MUST return ONLY a JSON object. NEVER return a schema definition. Always use exactly these keys: "status", "title", "suggestion".',
      prompt: `
        Analyze the storage safety for:
        - Grain: ${input.grainType}
        - Moisture: ${input.moisture}%

        STORAGE SAFETY RULES:
        - Wheat: Safe <13.5, Risky <15.5, Dangerous >15.5
        - Rice: Safe <14, Risky <16, Dangerous >16
        - Maize: Safe <15.5, Risky <18, Dangerous >18

        RESPONSE FORMAT:
        {
          "status": "good" | "caution" | "bad",
          "title": "Short summary",
          "suggestion": "2-3 sentences of specific advice."
        }

        STRICT RULES:
        1. Return ONLY the JSON instance.
        2. DO NOT include "type": "object" or any schema properties.
        3. Start your response with { and end with }.
      `,
      output: {
        schema: HarvestAdviceSchema,
      },
      config: {
        temperature: 0.1, // Low temperature for stability
      }
    });
    return output!;
  }
);

export async function getHarvestAdvice(input: HarvestAdviceInput): Promise<HarvestAdvice> {
  return harvestAdvisorFlow(input);
}

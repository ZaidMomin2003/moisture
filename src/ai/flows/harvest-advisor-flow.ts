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
      system: 'You are a helpful assistant that always responds with valid, flat JSON objects. Do not include any explanation or schema wrappers. Always include all three fields: "status", "title", and "suggestion".',
      prompt: `
        You are an expert agronomist. Provide advice based on grain moisture.
        
        DATA:
        - Grain Type: ${input.grainType}
        - Moisture Content: ${input.moisture}%

        RULES:
        - Wheat: Ideal <13.5%, Caution <15.5%, Bad >15.5%
        - Rice: Ideal <14%, Caution <16%, Bad >16%
        - Maize: Ideal <15.5%, Caution <18%, Bad >18%

        EXAMPLE RESPONSE:
        {
          "status": "good",
          "title": "Ready for Storage",
          "suggestion": "The moisture level is perfect. You should proceed with storage immediately to ensure best quality."
        }

        RESPONSE INSTRUCTIONS:
        1. Return ONLY the JSON object.
        2. You MUST include the "suggestion" field with at least 2 sentences of advice regarding storage.
        3. Do not include any other text.
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

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
      system: 'You are an expert post-harvest storage consultant. You always respond with a valid, flat JSON object containing "status", "title", and "suggestion". Do not include any extra text.',
      prompt: `
        Analyze the storage safety of ${input.grainType} with ${input.moisture}% moisture content.
        
        STORAGE SAFETY RULES:
        - Wheat: Safe <13.5%, Risky <15.5%, Dangerous >15.5% (Mold Risk)
        - Rice: Safe <14%, Risky <16%, Dangerous >16% (Heating/Spoilage)
        - Maize: Safe <15.5%, Risky <18%, Dangerous >18% (Aflatoxin/Fungal Risk)

        RESPONSE INSTRUCTIONS:
        1. "status": Use "good" (safe), "caution" (risky), or "bad" (dangerous).
        2. "title": Concise summary (e.g., "Safe for Long-Term Storage").
        3. "suggestion": Provide 2-3 specific sentences about storage longevity, aeration needs, and moisture-related risks. Focus ONLY on storage, not harvesting.

        EXAMPLE:
        {
          "status": "bad",
          "title": "High Spoilage Risk",
          "suggestion": "This moisture level is too high for safe storage and will lead to rapid fungal growth and heating. You must dry the grain further or implement vigorous mechanical aeration immediately."
        }
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

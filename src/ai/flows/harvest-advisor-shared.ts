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

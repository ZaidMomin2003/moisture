import { genkitNext } from '@genkit-ai/next/server';
import { ai } from '@/ai/genkit';

export const { GET, POST } = genkitNext(ai);

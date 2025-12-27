import genkitNext from "@genkit-ai/next";
import { ai } from '@/ai/genkit';

export const { GET, POST } = genkitNext(ai);

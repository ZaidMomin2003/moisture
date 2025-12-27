import { createGenkitRoute } from "@genkit-ai/next";
import { ai } from '@/ai/genkit';

export const { GET, POST } = createGenkitRoute(ai);

import { config } from 'dotenv';
config();

import '@/ai/flows/suggest-model-configuration.ts';
import '@/ai/flows/format-response-as-markdown.ts';
import '@/ai/flows/chat.ts';

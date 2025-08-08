'use server';
/**
 * @fileOverview A chat flow that uses Gemini.
 *
 * - chat - A function that handles the chat process.
 * - ChatInput - The input type for the chat function.
 * - ChatOutput - The return type for the chat function.
 */

import {ai} from '@/ai/genkit';
import {generate, Message, Part} from 'genkit';
import {z} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

const ChatInputSchema = z.object({
  model: z.string().describe('The model to use for the chat.'),
  messages: z.array(
    z.object({
      role: z.enum(['user', 'assistant']),
      content: z.array(z.object({ text: z.string() })),
    })
  ).describe('The chat history.'),
  temperature: z.number().optional().describe('The temperature for the model.'),
});
export type ChatInput = z.infer<typeof ChatInputSchema>;

const ChatOutputSchema = z.object({
  reply: z.string().describe('The model\'s reply.'),
});
export type ChatOutput = z.infer<typeof ChatOutputSchema>;

export async function chat(input: ChatInput): Promise<ChatOutput> {
  return chatFlow(input);
}

const chatFlow = ai.defineFlow(
  {
    name: 'chatFlow',
    inputSchema: ChatInputSchema,
    outputSchema: ChatOutputSchema,
  },
  async input => {
    const { model, messages, temperature } = input;
    const llm = googleAI.model(model);

    const history: Message[] = messages.map(m => ({
      role: m.role,
      content: m.content as Part[],
    }));

    const response = await ai.generate({
      model: llm,
      history,
      config: {
        temperature,
      },
    });

    const reply = response.text;
    return { reply };
  }
);

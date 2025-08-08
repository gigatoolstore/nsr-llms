'use server';

/**
 * @fileOverview This file defines a Genkit flow to suggest appropriate model configurations based on the user's task.
 *
 * - suggestModelConfiguration - A function that suggests model configurations based on the task.
 * - SuggestModelConfigurationInput - The input type for the suggestModelConfiguration function.
 * - SuggestModelConfigurationOutput - The return type for the suggestModelConfiguration function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestModelConfigurationInputSchema = z.object({
  task: z.string().describe('The task the model will be used for.'),
});
export type SuggestModelConfigurationInput = z.infer<typeof SuggestModelConfigurationInputSchema>;

const SuggestModelConfigurationOutputSchema = z.object({
  temperature: z.number().describe('The suggested temperature setting for the model.'),
  maxTokens: z.number().describe('The suggested maximum number of tokens for the model.'),
  topP: z.number().optional().describe('The suggested top_p setting for the model, if applicable.'),
  topK: z.number().optional().describe('The suggested top_k setting for the model, if applicable.'),
  otherParameters: z.record(z.any()).optional().describe('Any other suggested parameters for the model.'),
});
export type SuggestModelConfigurationOutput = z.infer<typeof SuggestModelConfigurationOutputSchema>;

export async function suggestModelConfiguration(
  input: SuggestModelConfigurationInput
): Promise<SuggestModelConfigurationOutput> {
  return suggestModelConfigurationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestModelConfigurationPrompt',
  input: {schema: SuggestModelConfigurationInputSchema},
  output: {schema: SuggestModelConfigurationOutputSchema},
  prompt: `You are an expert AI model configuration specialist.

  Based on the task provided, suggest the optimal model configuration parameters.
  Provide the temperature and maxTokens parameters.
  Optionally, you can also provide topP, topK, and otherParameters if they are relevant to the task.

  Task: {{{task}}}
  `,
});

const suggestModelConfigurationFlow = ai.defineFlow(
  {
    name: 'suggestModelConfigurationFlow',
    inputSchema: SuggestModelConfigurationInputSchema,
    outputSchema: SuggestModelConfigurationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

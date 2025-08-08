'use server';
/**
 * @fileOverview A flow to format LLM responses as markdown.
 *
 * - formatResponseAsMarkdown - A function that formats the LLM response as markdown.
 * - FormatResponseAsMarkdownInput - The input type for the formatResponseAsMarkdown function.
 * - FormatResponseAsMarkdownOutput - The return type for the formatResponseAsMarkdown function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FormatResponseAsMarkdownInputSchema = z.object({
  text: z.string().describe('The text to format as markdown.'),
});
export type FormatResponseAsMarkdownInput = z.infer<typeof FormatResponseAsMarkdownInputSchema>;

const FormatResponseAsMarkdownOutputSchema = z.object({
  markdown: z.string().describe('The formatted text as markdown.'),
});
export type FormatResponseAsMarkdownOutput = z.infer<typeof FormatResponseAsMarkdownOutputSchema>;

export async function formatResponseAsMarkdown(
  input: FormatResponseAsMarkdownInput
): Promise<FormatResponseAsMarkdownOutput> {
  return formatResponseAsMarkdownFlow(input);
}

const prompt = ai.definePrompt({
  name: 'formatResponseAsMarkdownPrompt',
  input: {schema: FormatResponseAsMarkdownInputSchema},
  output: {schema: FormatResponseAsMarkdownOutputSchema},
  prompt: `You are a helpful assistant that formats text as markdown.

  Format the following text as markdown:

  {{{text}}} `,
});

const formatResponseAsMarkdownFlow = ai.defineFlow(
  {
    name: 'formatResponseAsMarkdownFlow',
    inputSchema: FormatResponseAsMarkdownInputSchema,
    outputSchema: FormatResponseAsMarkdownOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

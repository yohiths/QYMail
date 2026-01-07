'use server';

/**
 * @fileOverview An email summarization AI agent.
 *
 * - summarizeEmail - A function that handles the email summarization process.
 * - SummarizeEmailInput - The input type for the summarizeEmail function.
 * - SummarizeEmailOutput - The return type for the summarizeEmail function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeEmailInputSchema = z.object({
  emailContent: z.string().describe('The complete content of the email to be summarized.'),
});
export type SummarizeEmailInput = z.infer<typeof SummarizeEmailInputSchema>;

const SummarizeEmailOutputSchema = z.object({
  summary: z.string().describe('A short summary of the email content.'),
});
export type SummarizeEmailOutput = z.infer<typeof SummarizeEmailOutputSchema>;

export async function summarizeEmail(input: SummarizeEmailInput): Promise<SummarizeEmailOutput> {
  return summarizeEmailFlow(input);
}

const summarizeEmailPrompt = ai.definePrompt({
  name: 'summarizeEmailPrompt',
  input: {schema: SummarizeEmailInputSchema},
  output: {schema: SummarizeEmailOutputSchema},
  prompt: `You are an AI assistant that summarizes emails.  Provide a concise summary of the following email content. The summary should capture the main points and purpose of the email in a few sentences.\n\nEmail Content:\n{{{emailContent}}}`,
});

const summarizeEmailFlow = ai.defineFlow(
  {
    name: 'summarizeEmailFlow',
    inputSchema: SummarizeEmailInputSchema,
    outputSchema: SummarizeEmailOutputSchema,
  },
  async input => {
    const {output} = await summarizeEmailPrompt(input);
    return output!;
  }
);

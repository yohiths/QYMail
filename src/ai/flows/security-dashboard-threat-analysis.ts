'use server';

/**
 * @fileOverview Analyzes emails for potential security threats and generates a security dashboard display.
 *
 * - analyzeEmailForThreats - A function that analyzes an email and returns a threat analysis.
 * - ThreatAnalysisInput - The input type for the analyzeEmailForThreats function.
 * - ThreatAnalysisOutput - The return type for the analyzeEmailForThreats function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ThreatAnalysisInputSchema = z.object({
  emailContent: z
    .string()
    .describe('The content of the email to analyze for security threats.'),
});
export type ThreatAnalysisInput = z.infer<typeof ThreatAnalysisInputSchema>;

const ThreatAnalysisOutputSchema = z.object({
  threatLevel: z
    .enum(['low', 'medium', 'high'])
    .describe('The overall threat level of the email.'),
  threatIndicators: z
    .array(z.string())
    .describe('Specific indicators of potential threats found in the email.'),
  summary: z
    .string()
    .describe('A summary of the threat analysis, explaining the identified threats.'),
});
export type ThreatAnalysisOutput = z.infer<typeof ThreatAnalysisOutputSchema>;

export async function analyzeEmailForThreats(
  input: ThreatAnalysisInput
): Promise<ThreatAnalysisOutput> {
  return threatAnalysisFlow(input);
}

const threatAnalysisPrompt = ai.definePrompt({
  name: 'threatAnalysisPrompt',
  input: {schema: ThreatAnalysisInputSchema},
  output: {schema: ThreatAnalysisOutputSchema},
  prompt: `You are a security expert analyzing email content for potential threats.

  Analyze the following email content and determine the threat level (low, medium, or high), identify specific threat indicators, and provide a summary of the threat analysis.

  Email Content: {{{emailContent}}}

  Threat Level: 
  Threat Indicators:
  Summary:`,
});

const threatAnalysisFlow = ai.defineFlow(
  {
    name: 'threatAnalysisFlow',
    inputSchema: ThreatAnalysisInputSchema,
    outputSchema: ThreatAnalysisOutputSchema,
  },
  async input => {
    const {output} = await threatAnalysisPrompt(input);
    return output!;
  }
);

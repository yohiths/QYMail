'use server';

/**
 * @fileOverview Analyzes security events to build a threat profile for a user.
 *
 * - analyzeSecurityEvents - A function that analyzes user behavior and returns a threat profile.
 * - ThreatProfileInput - The input type for the analyzeSecurityEvents function.
 * - ThreatProfileOutput - The return type for the analyzeSecurityEvents function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SecurityEventSchema = z.object({
  id: z.string(),
  userId: z.string(),
  action: z.enum(['send', 'decrypt']),
  outcome: z.enum(['success', 'failure']),
  reason: z.string().optional().describe('Reason for failure, e.g., unauthorized, session_expired'),
  timestamp: z.string().describe('ISO 8601 timestamp'),
});
export type SecurityEvent = z.infer<typeof SecurityEventSchema>;

const ThreatProfileInputSchema = z.object({
  securityEvents: z
    .array(SecurityEventSchema)
    .describe('A log of security events for a user.'),
});
export type ThreatProfileInput = z.infer<typeof ThreatProfileInputSchema>;

const ThreatProfileOutputSchema = z.object({
  threatLevel: z
    .enum(['NORMAL', 'SUSPICIOUS', 'HIGH RISK'])
    .describe('The overall threat level for the user.'),
  analysisSummary: z
    .string()
    .describe('A summary of the threat analysis, explaining the determined threat level based on behavior.'),
  suspiciousActivity: z.array(z.string()).describe('Specific suspicious activities that were detected.'),
});
export type ThreatProfileOutput = z.infer<typeof ThreatProfileOutputSchema>;

export async function analyzeSecurityEvents(
  input: ThreatProfileInput
): Promise<ThreatProfileOutput> {
  return threatAnalysisFlow(input);
}

const threatAnalysisPrompt = ai.definePrompt({
  name: 'threatAnalysisPrompt',
  input: {schema: ThreatProfileInputSchema},
  output: {schema: ThreatProfileOutputSchema},
  prompt: `You are a security expert analyzing a user's security event log to build a threat profile. Your analysis is based on behavior, not email content.

  The system is designed with these principles:
  - Each email is encrypted with a unique, short-lived session key.
  - Emails can only be decrypted once.
  - Unauthorized access attempts are logged.

  Threat Levels:
  - NORMAL: Legitimate usage.
  - SUSPICIOUS: Repeated failures or abnormal access patterns.
  - HIGH RISK: Unauthorized decryption attempts detected.

  Analyze the following security events and determine the user's threat profile.

  Events:
  {{#each securityEvents}}
  - Action: {{action}}, Outcome: {{outcome}}{{#if reason}}, Reason: {{reason}}{{/if}}, Time: {{timestamp}}
  {{/each}}

  Based on these events, determine the threat level, provide a summary of your analysis, and list any specific suspicious activities. Focus on patterns like repeated failures, access to unauthorized emails, or attempts to reuse sessions.`,
});

const threatAnalysisFlow = ai.defineFlow(
  {
    name: 'threatAnalysisFlow',
    inputSchema: ThreatProfileInputSchema,
    outputSchema: ThreatProfileOutputSchema,
  },
  async input => {
    const {output} = await threatAnalysisPrompt(input);
    return output!;
  }
);

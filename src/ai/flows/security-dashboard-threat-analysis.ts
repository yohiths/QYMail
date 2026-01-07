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
export type ThreatProfileOutput = z_infer<typeof ThreatProfileOutputSchema>;

const threatAnalysisPrompt = ai.definePrompt({
  name: 'threatAnalysisPrompt',
  input: {schema: z.any()},
  output: {schema: ThreatProfileOutputSchema},
  prompt: `You are a cybersecurity assistant analyzing access behavior in a zero-trust encrypted email system.

Context:
- Emails are encrypted using disposable keys.
- Each email can be decrypted only once.
- Decryption is allowed only for the intended receiver.
- All access attempts are logged and analyzed.

Security Profile:
Threat Level: {{threatLevel}}
Failed Decrypt Attempts: {{failedDecrypts}}
Unauthorized Access Attempts: {{unauthorizedAttempts}}
Indicators: {{indicators}}

Task:
1. Determine the Threat Level (NORMAL, SUSPICIOUS, HIGH RISK) based on the profile.
2. Explain whether this behavior is normal or suspicious in the 'analysisSummary'.
3. Describe what kind of attack or misuse (if any) this resembles.
4. List the identified "Indicators" as 'suspiciousActivity'.

Do NOT discuss email content.
Focus only on access behavior and security risk.`,
});

export async function analyzeSecurityEvents(
  input: ThreatProfileInput
): Promise<ThreatProfileOutput> {
  const failedDecrypts = input.securityEvents.filter(e => e.action === 'decrypt' && e.outcome === 'failure').length;
  const unauthorizedAttempts = input.securityEvents.filter(e => e.reason === 'unauthorized').length;
  
  const indicators = [];
  if (failedDecrypts > 3) indicators.push('Multiple failed decryptions');
  if (unauthorizedAttempts > 0) indicators.push('Unauthorized access attempts');
  if (input.securityEvents.some(e => e.reason === 'session_reused')) indicators.push('Reused session keys');

  const promptInput = {
    threatLevel: 'analyzing...',
    failedDecrypts,
    unauthorizedAttempts,
    indicators: indicators.join(', ') || 'None',
  };

  const {output} = await threatAnalysisPrompt(promptInput);
  return output!;
}

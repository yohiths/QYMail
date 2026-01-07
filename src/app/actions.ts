'use server';

import { summarizeEmail } from '@/ai/flows/summarize-email';
import { analyzeSecurityEvents, type ThreatProfileInput } from '@/ai/flows/security-dashboard-threat-analysis';

export async function getSummary(emailContent: string) {
  try {
    const result = await summarizeEmail({ emailContent });
    return { summary: result.summary };
  } catch (error) {
    console.error('Error summarizing email:', error);
    return { error: 'Failed to summarize email.' };
  }
}

export async function getThreatProfile(input: ThreatProfileInput) {
  try {
    const result = await analyzeSecurityEvents(input);
    return result;
  } catch (error) {
    console.error('Error analyzing security events:', error);
    return { error: 'Failed to analyze security events.' };
  }
}

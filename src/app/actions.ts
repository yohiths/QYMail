'use server';

import { summarizeEmail } from '@/ai/flows/summarize-email';
import { analyzeEmailForThreats } from '@/ai/flows/security-dashboard-threat-analysis';

export async function getSummary(emailContent: string) {
  try {
    const result = await summarizeEmail({ emailContent });
    return { summary: result.summary };
  } catch (error) {
    console.error('Error summarizing email:', error);
    return { error: 'Failed to summarize email.' };
  }
}

export async function getThreatAnalysis(emailContent: string) {
  try {
    const result = await analyzeEmailForThreats({ emailContent });
    return result;
  } catch (error) {
    console.error('Error analyzing email for threats:', error);
    return { error: 'Failed to analyze email for threats.' };
  }
}

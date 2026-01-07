import { analyzeEmailForThreats, type ThreatAnalysisOutput } from '@/ai/flows/security-dashboard-threat-analysis';
import { emails } from '@/lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { ChartTooltipContent } from '@/components/ui/chart';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ShieldAlert } from 'lucide-react';

export default async function DashboardPage() {
  const emailsToAnalyze = emails.slice(0, 5); // Analyze first 5 emails for demo
  const analyses: (ThreatAnalysisOutput & { subject: string; id: string })[] = [];

  for (const email of emailsToAnalyze) {
    const result = await analyzeEmailForThreats({ emailContent: email.body });
    if (!result.error) {
      analyses.push({ ...result, subject: email.subject, id: email.id });
    }
  }

  const threatCounts = analyses.reduce(
    (acc, analysis) => {
      acc[analysis.threatLevel]++;
      return acc;
    },
    { low: 0, medium: 0, high: 0 }
  );

  const chartData = [
    { level: 'Low', count: threatCounts.low, fill: 'hsl(var(--chart-1))' },
    { level: 'Medium', count: threatCounts.medium, fill: 'hsl(var(--chart-2))' },
    { level: 'High', count: threatCounts.high, fill: 'hsl(var(--destructive))' },
  ];

  const highThreatEmails = analyses.filter((a) => a.threatLevel === 'high');

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      <header>
        <h1 className="font-headline text-3xl font-bold tracking-tight">Security Dashboard</h1>
        <p className="text-muted-foreground">AI-powered threat analysis overview</p>
      </header>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Threats Analyzed</CardTitle>
            <CardDescription>Total number of emails scanned for threats.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{analyses.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>High-Risk Alerts</CardTitle>
            <CardDescription>Emails flagged with a high threat level.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-destructive">{threatCounts.high}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Overall Status</CardTitle>
            <CardDescription>System-wide threat assessment.</CardDescription>
          </CardHeader>
          <CardContent>
            <Badge
              className={
                threatCounts.high > 0
                  ? 'bg-destructive/10 text-destructive'
                  : 'bg-primary/10 text-primary'
              }
            >
              {threatCounts.high > 0 ? 'Action Required' : 'All Clear'}
            </Badge>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Threat Distribution</CardTitle>
            <CardDescription>Breakdown of threats by severity level.</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="level" />
                <YAxis allowDecimals={false} />
                <Tooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>High-Threat Email Log</CardTitle>
            <CardDescription>A log of emails identified as high-risk.</CardDescription>
          </CardHeader>
          <CardContent>
            {highThreatEmails.length > 0 ? (
              <div className="space-y-4">
                {highThreatEmails.map((email) => (
                  <Alert key={email.id} variant="destructive">
                    <ShieldAlert className="h-4 w-4" />
                    <AlertTitle>{email.subject}</AlertTitle>
                    <AlertDescription>{email.summary}</AlertDescription>
                  </Alert>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-8">
                 <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-10 w-10 mb-2"
                >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                    <path d="m9 12 2 2 4-4" />
                </svg>
                <p>No high-threat emails detected.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

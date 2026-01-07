import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import type { ThreatAnalysisOutput } from '@/ai/flows/security-dashboard-threat-analysis';
import { ShieldAlert, ShieldCheck, ShieldQuestion } from 'lucide-react';

interface ThreatAnalysisResultProps {
  analysis: Omit<ThreatAnalysisOutput, 'error'>;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const threatLevelConfig = {
  low: {
    label: 'Low',
    variant: 'secondary',
    icon: <ShieldCheck className="mr-2 h-4 w-4 text-green-500" />,
    color: 'bg-green-500/10 border-green-500/50 text-green-700 dark:text-green-400',
  },
  medium: {
    label: 'Medium',
    variant: 'secondary',
    icon: <ShieldAlert className="mr-2 h-4 w-4 text-yellow-500" />,
    color: 'bg-yellow-500/10 border-yellow-500/50 text-yellow-700 dark:text-yellow-400',
  },
  high: {
    label: 'High',
    variant: 'destructive',
    icon: <ShieldAlert className="mr-2 h-4 w-4 text-red-500" />,
    color: 'bg-red-500/10 border-red-500/50 text-red-700 dark:text-red-400',
  },
};

export function ThreatAnalysisResult({ analysis, isOpen, onOpenChange }: ThreatAnalysisResultProps) {
  const config = threatLevelConfig[analysis.threatLevel] || {
    label: 'Unknown',
    variant: 'secondary',
    icon: <ShieldQuestion className="mr-2 h-4 w-4" />,
    color: 'bg-gray-500/10 border-gray-500/50 text-gray-700 dark:text-gray-400',
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center font-headline text-2xl">
            {config.icon}
            Security Analysis
          </AlertDialogTitle>
          <AlertDialogDescription className="pt-2">
            AI-powered threat analysis of the selected email.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex items-center gap-4">
            <span className="font-medium">Threat Level:</span>
            <Badge variant={config.variant} className={config.color}>
              {config.label}
            </Badge>
          </div>
          <div>
            <h4 className="font-medium mb-2">Threat Indicators:</h4>
            {analysis.threatIndicators.length > 0 ? (
              <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                {analysis.threatIndicators.map((indicator, index) => (
                  <li key={index}>{indicator}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No specific threat indicators found.</p>
            )}
          </div>
          <div>
            <h4 className="font-medium mb-2">AI Summary:</h4>
            <p className="text-sm text-muted-foreground">{analysis.summary}</p>
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Close</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

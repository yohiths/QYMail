'use client';

import * as React from 'react';
import { getSummary, getThreatAnalysis } from '@/app/actions';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import type { Email } from '@/lib/types';
import {
  Archive,
  ArchiveX,
  ChevronDown,
  Clock,
  Forward,
  MoreVertical,
  Paperclip,
  Reply,
  ReplyAll,
  Sparkles,
  ShieldAlert,
  Loader2,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ThreatAnalysisResult } from './threat-analysis-result';
import type { ThreatAnalysisOutput } from '@/ai/flows/security-dashboard-threat-analysis';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '../ui/scroll-area';

interface EmailDisplayProps {
  email: Email | null;
}

export function EmailDisplay({ email }: EmailDisplayProps) {
  const { toast } = useToast();
  const [isSummarizing, setIsSummarizing] = React.useState(false);
  const [summary, setSummary] = React.useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const [analysisResult, setAnalysisResult] = React.useState<ThreatAnalysisOutput | null>(null);
  const [isAnalysisModalOpen, setIsAnalysisModalOpen] = React.useState(false);

  React.useEffect(() => {
    setSummary(null);
    setAnalysisResult(null);
  }, [email]);

  const handleSummarize = async () => {
    if (!email) return;
    setIsSummarizing(true);
    setSummary(null);
    const result = await getSummary(email.body);
    setIsSummarizing(false);
    if (result.error) {
      toast({
        title: 'Error',
        description: result.error,
        variant: 'destructive',
      });
    } else {
      setSummary(result.summary || 'No summary could be generated.');
    }
  };

  const handleAnalyze = async () => {
    if (!email) return;
    setIsAnalyzing(true);
    const result = await getThreatAnalysis(email.body);
    setIsAnalyzing(false);
    if (result.error) {
      toast({
        title: 'Error',
        description: result.error,
        variant: 'destructive',
      });
    } else {
      setAnalysisResult(result);
      setIsAnalysisModalOpen(true);
    }
  };

  if (!email) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-8 text-center text-muted-foreground">
        <div className="flex flex-col items-center gap-2">
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
            className="h-12 w-12"
          >
            <path d="m22 13-8.07 8.07a2.83 2.83 0 0 1-4 0L2 13" />
            <path d="m22 7-8.07 8.07a2.83 2.83 0 0 1-4 0L2 7" />
          </svg>
          <p className="text-lg font-medium">No email selected</p>
          <p className="text-sm">Select an email from the list to view its content.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center p-2">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Archive className="h-4 w-4" />
            <span className="sr-only">Archive</span>
          </Button>
          <Button variant="ghost" size="icon">
            <ArchiveX className="h-4 w-4" />
            <span className="sr-only">Move to junk</span>
          </Button>
          <Button variant="ghost" size="icon">
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Move to trash</span>
          </Button>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Reply className="mr-2 h-4 w-4" />
            Reply
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 w-8 px-2">
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Reply className="mr-2 h-4 w-4" />
                Reply
              </DropdownMenuItem>
              <DropdownMenuItem>
                <ReplyAll className="mr-2 h-4 w-4" />
                Reply All
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Forward className="mr-2 h-4 w-4" />
                Forward
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <Separator />
      <div className="flex flex-1 flex-col">
        <div className="flex items-start p-4">
          <div className="flex items-start gap-4 text-sm">
            <Avatar>
              <AvatarImage alt={email.from.name} />
              <AvatarFallback>
                {email.from.name
                  .split(' ')
                  .map((chunk) => chunk[0])
                  .join('')}
              </AvatarFallback>
            </Avatar>
            <div className="grid gap-1">
              <div className="font-semibold">{email.from.name}</div>
              <div className="line-clamp-1 text-xs">{email.from.email}</div>
              <div className="line-clamp-1 text-xs">
                To:{' '}
                {email.to.map((person) => person.name).join(', ')}
              </div>
            </div>
          </div>
          <div className="ml-auto text-xs text-muted-foreground">
            {new Date(email.date).toLocaleString()}
          </div>
        </div>
        <Separator />
        <div className="p-4 space-y-4">
            <h1 className="font-headline text-2xl font-bold">{email.subject}</h1>
            <div className="flex gap-2">
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline" size="sm" disabled={isSummarizing}>
                            {isSummarizing ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <Sparkles className="mr-2 h-4 w-4 text-accent" />
                            )}
                            Summarize
                        </Button>
                    </PopoverTrigger>
                    {summary && <PopoverContent className="text-sm">{summary}</PopoverContent>}
                </Popover>

                <Button variant="outline" size="sm" onClick={handleAnalyze} disabled={isAnalyzing}>
                    {isAnalyzing ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <ShieldAlert className="mr-2 h-4 w-4 text-destructive" />
                    )}
                    Analyze Threats
                </Button>
            </div>
        </div>
        <Separator />

        <ScrollArea className="flex-1 whitespace-pre-wrap p-4 text-sm">
            <div dangerouslySetInnerHTML={{ __html: email.body }} />
        </ScrollArea>
        
        {email.attachments.length > 0 && (
          <>
            <Separator className="mt-auto" />
            <div className="p-4">
              <h3 className="text-sm font-medium mb-2">Attachments</h3>
              <div className="flex gap-2">
                {email.attachments.map((attachment) => (
                  <Button variant="outline" size="sm" key={attachment.filename} asChild>
                    <a href="#" download={attachment.filename}>
                      <Paperclip className="h-4 w-4 mr-2" />
                      {attachment.filename} ({attachment.size})
                    </a>
                  </Button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
      {analysisResult && (
        <ThreatAnalysisResult
          analysis={analysisResult}
          isOpen={isAnalysisModalOpen}
          onOpenChange={setIsAnalysisModalOpen}
        />
      )}
    </div>
  );
}

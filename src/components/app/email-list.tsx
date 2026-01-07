'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import type { Email } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';

interface EmailListProps {
  emails: Email[];
}

export function EmailList({ emails }: EmailListProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const selectedEmailId = searchParams.get('id');

  const handleSelectEmail = (id: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('id', id);
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <ScrollArea className="h-full">
      <div className="flex flex-col gap-2 p-4 pt-0">
        {emails.map((email) => (
          <button
            key={email.id}
            className={cn(
              'flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent/50',
              selectedEmailId === email.id && 'bg-muted'
            )}
            onClick={() => handleSelectEmail(email.id)}
          >
            <div className="flex w-full flex-col gap-1">
              <div className="flex items-center">
                <div className="flex items-center gap-2">
                  <div className={cn('font-semibold', !email.read && 'text-foreground')}>
                    {email.from.name}
                  </div>
                  {!email.read && <span className="flex h-2 w-2 rounded-full bg-primary" />}
                </div>
                <div
                  className={cn(
                    'ml-auto text-xs',
                    selectedEmailId === email.id ? 'text-foreground' : 'text-muted-foreground'
                  )}
                >
                  {new Date(email.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </div>
              </div>
              <div className="text-xs font-medium">{email.subject}</div>
            </div>
            <div className="line-clamp-2 text-xs text-muted-foreground">
              {email.body.replace(/<[^>]*>?/gm, '').substring(0, 100)}
            </div>
          </button>
        ))}
      </div>
    </ScrollArea>
  );
}

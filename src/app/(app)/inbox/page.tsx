'use client';

import * as React from 'react';
import { EmailList } from '@/components/app/email-list';
import { EmailDisplay } from '@/components/app/email-display';
import { emails } from '@/lib/data';
import type { Email } from '@/lib/types';
import { useSearchParams } from 'next/navigation';

export default function InboxPage() {
  const searchParams = useSearchParams();
  const selectedEmailId = searchParams.get('id');

  const inboxEmails = emails.filter((email) => email.mailbox === 'inbox');

  const selectedEmail =
    (inboxEmails.find((email) => email.id === selectedEmailId) as Email) || null;

  return (
    <div className="grid h-full grid-cols-1 md:grid-cols-[350px_1fr] lg:grid-cols-[400px_1fr]">
      <div className="border-r bg-card">
        <EmailList emails={inboxEmails} />
      </div>
      <div className="flex flex-col">
        <EmailDisplay email={selectedEmail} />
      </div>
    </div>
  );
}

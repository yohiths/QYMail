'use client';

import * as React from 'react';
import { EmailList } from '@/components/app/email-list';
import { EmailDisplay } from '@/components/app/email-display';
import type { Email } from '@/lib/types';
import { useSearchParams } from 'next/navigation';
import { useCollection, useFirebase, useMemoFirebase } from '@/firebase';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { collection, query, where } from 'firebase/firestore';
import { DUMMY_EMAILS } from '@/lib/data';

export default function InboxPage() {
  const searchParams = useSearchParams();
  const selectedEmailId = searchParams.get('id');
  const { firestore, user } = useFirebase();

  const emailsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(
      collection(firestore, `users/${user.uid}/emails`),
      where('mailbox', '==', 'inbox')
    );
  }, [firestore, user]);

  const { data: inboxEmails, isLoading } = useCollection<Email>(emailsQuery);

  React.useEffect(() => {
    if (inboxEmails?.length === 0 && user && firestore) {
      const recipient = {
        name: user.displayName || 'User',
        email: user.email || '',
      };
      DUMMY_EMAILS.forEach((email) => {
        const emailData = {
          ...email,
          to: [recipient],
          read: false,
          mailbox: 'inbox' as const,
        };
        addDocumentNonBlocking(
          collection(firestore, `users/${user.uid}/emails`),
          emailData
        );
      });
    }
  }, [inboxEmails, user, firestore]);

  const selectedEmail =
    (inboxEmails?.find((email) => email.id === selectedEmailId) as Email) ||
    null;

  if (isLoading) {
    return <p className="p-4">Loading emails...</p>;
  }

  return (
    <div className="grid h-full grid-cols-1 md:grid-cols-[350px_1fr] lg:grid-cols-[400px_1fr]">
      <div className="border-r bg-card">
        <EmailList emails={inboxEmails || []} />
      </div>
      <div className="flex flex-col">
        <EmailDisplay email={selectedEmail} />
      </div>
    </div>
  );
}

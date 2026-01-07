'use client';

import * as React from 'react';
import { EmailList } from '@/components/app/email-list';
import { EmailDisplay } from '@/components/app/email-display';
import type { Email } from '@/lib/types';
import { useSearchParams } from 'next/navigation';
import { useCollection, useFirebase, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';

export default function SentPage() {
  const searchParams = useSearchParams();
  const selectedEmailId = searchParams.get('id');
  const { firestore, user } = useFirebase();

  const emailsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(
      collection(firestore, `users/${user.uid}/emails`),
      where('mailbox', '==', 'sent')
    );
  }, [firestore, user]);

  const { data: sentEmails, isLoading } = useCollection<Email>(emailsQuery);

  const selectedEmail =
    (sentEmails?.find((email) => email.id === selectedEmailId) as Email) ||
    null;

  if (isLoading) {
    return <p className="p-4">Loading sent emails...</p>;
  }

  return (
    <div className="grid h-full grid-cols-1 md:grid-cols-[350px_1fr] lg:grid-cols-[400px_1fr]">
      <div className="border-r bg-card">
        <EmailList emails={sentEmails || []} />
      </div>
      <div className="flex flex-col">
        <EmailDisplay email={selectedEmail} />
      </div>
    </div>
  );
}

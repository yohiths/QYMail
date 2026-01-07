'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useFirebase } from '@/firebase';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { collection } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { Label } from '../ui/label';

export function ComposeDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const [isSending, setIsSending] = React.useState(false);
  const { firestore, user } = useFirebase();
  const { toast } = useToast();
  const formRef = React.useRef<HTMLFormElement>(null);

  const handleSendEmail = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!firestore || !user) return;

    setIsSending(true);

    const formData = new FormData(event.currentTarget);
    const to = formData.get('to') as string;
    const subject = formData.get('subject') as string;
    const body = formData.get('body') as string;

    const fromPerson = {
      name: user.displayName || 'User',
      email: user.email || '',
    };
    
    // For simplicity, we're assuming a single recipient email string.
    const toPerson = {
      name: to,
      email: to,
    }

    try {
      await addDocumentNonBlocking(collection(firestore, `users/${user.uid}/emails`), {
        from: fromPerson,
        to: [toPerson],
        subject,
        body,
        date: new Date().toISOString(),
        read: true,
        mailbox: 'sent',
        attachments: [],
      });
      
      toast({
        title: 'Email Sent!',
        description: `Your email to ${to} has been sent.`,
      });
      setOpen(false); // Close dialog on success
      formRef.current?.reset();
    } catch (error) {
       toast({
        title: 'Error Sending Email',
        description: 'There was a problem sending your email. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Compose Email</DialogTitle>
          <DialogDescription>
            Draft your secure message. It will be sent to the recipient's inbox.
          </DialogDescription>
        </DialogHeader>
        <form ref={formRef} onSubmit={handleSendEmail} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="to" className="text-right">
              To
            </Label>
            <Input id="to" name="to" type="email" required className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="subject" className="text-right">
              Subject
            </Label>
            <Input id="subject" name="subject" required className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="body" className="text-right pt-2">
              Body
            </Label>
            <Textarea id="body" name="body" required className="col-span-3 min-h-[200px]" />
          </div>
        <DialogFooter>
          <Button type="submit" disabled={isSending}>
            {isSending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              'Send Email'
            )}
          </Button>
        </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

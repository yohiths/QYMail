import { Mail } from 'lucide-react';

export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <Mail className="size-6 text-primary" />
      <h1 className="font-headline text-xl font-bold text-foreground">
        QYMail
      </h1>
    </div>
  );
}

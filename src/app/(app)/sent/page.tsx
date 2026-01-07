import { Send } from 'lucide-react';

export default function SentPage() {
  return (
    <div className="flex h-full flex-col items-center justify-center p-8 text-center text-muted-foreground">
      <div className="flex flex-col items-center gap-2">
        <Send className="h-12 w-12" />
        <p className="text-lg font-medium">Sent Mail</p>
        <p className="text-sm">This is where your sent emails would appear.</p>
      </div>
    </div>
  );
}

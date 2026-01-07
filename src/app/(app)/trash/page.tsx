import { Trash2 } from 'lucide-react';

export default function TrashPage() {
  return (
    <div className="flex h-full flex-col items-center justify-center p-8 text-center text-muted-foreground">
      <div className="flex flex-col items-center gap-2">
        <Trash2 className="h-12 w-12" />
        <p className="text-lg font-medium">Trash</p>
        <p className="text-sm">This is where your deleted emails would appear.</p>
      </div>
    </div>
  );
}

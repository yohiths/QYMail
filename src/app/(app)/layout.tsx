'use client';

import { Logo } from '@/components/app/logo';
import { UserNav } from '@/components/app/user-nav';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import {
  Inbox,
  Send,
  Trash2,
  Search,
  PanelLeft,
  Shield,
  Mail,
  Edit,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import * as React from 'react';
import { useUser } from '@/firebase';
import { useEffect } from 'react';
import { ComposeDialog } from '@/components/app/compose-dialog';

const navLinks = [
  { href: '/inbox', label: 'Inbox', icon: Inbox },
  { href: '/sent', label: 'Sent', icon: Send },
  { href: '/trash', label: 'Trash', icon: Trash2 },
  { href: '/dashboard', label: 'Security', icon: Shield },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false);
  const pathname = usePathname();
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <TooltipProvider delayDuration={0}>
      <div className="flex h-screen w-full flex-col bg-background">
        <header className="flex h-14 items-center gap-4 border-b bg-card px-4 sm:h-16 sm:px-6">
          <div className="hidden items-center gap-2 md:flex">
             <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                className="h-8 w-8"
              >
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Toggle Sidebar</span>
              </Button>
            <Logo />
          </div>

          <div className="flex w-full items-center gap-4 md:ml-auto md:w-auto">
            <form className="relative w-full md:w-64 lg:w-96">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search emails..."
                className="w-full rounded-lg bg-background pl-8"
              />
            </form>
            <UserNav />
          </div>
        </header>
        <div className="flex flex-1 overflow-hidden">
          <nav
            className={cn(
              'hidden flex-col border-r bg-card transition-all duration-300 ease-in-out md:flex',
              isSidebarCollapsed ? 'w-16 items-center' : 'w-60 items-start'
            )}
          >
            <div
              className={cn('flex flex-col p-2', isSidebarCollapsed ? 'px-2' : 'px-4')}
            >
              <ComposeDialog>
                <Button className={cn(isSidebarCollapsed ? 'w-10 h-10 p-0' : 'w-full')}>
                  <Edit className={cn(!isSidebarCollapsed && 'mr-2')}/>
                  {!isSidebarCollapsed && 'Compose'}
                </Button>
              </ComposeDialog>

            </div>
            <div className={cn('flex-1 p-2', isSidebarCollapsed ? 'px-2' : 'px-4')}>
              {navLinks.map((link) => {
                const isActive = pathname.startsWith(link.href);
                return (
                  <Tooltip key={link.label}>
                    <TooltipTrigger asChild>
                      <Link
                        href={link.href}
                        className={cn(
                          'my-1 flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
                          isActive && 'bg-muted text-primary',
                          isSidebarCollapsed ? 'justify-center' : ''
                        )}
                      >
                        <link.icon className="h-5 w-5" />
                        {!isSidebarCollapsed && <span>{link.label}</span>}
                      </Link>
                    </TooltipTrigger>
                    {isSidebarCollapsed && <TooltipContent side="right">{link.label}</TooltipContent>}
                  </Tooltip>
                );
              })}
            </div>
          </nav>
          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </div>
    </TooltipProvider>
  );
}

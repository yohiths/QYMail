import { getThreatProfile } from '@/app/actions';
import { securityEvents } from '@/lib/data';
import type { SecurityEvent } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ShieldAlert, Fingerprint, Shield, UserX, Clock, Siren } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface UserProfile {
  userId: string;
  threatLevel: 'NORMAL' | 'SUSPICIOUS' | 'HIGH RISK';
  analysisSummary: string;
  suspiciousActivity: string[];
}

export default async function DashboardPage() {
  const users = [...new Set(securityEvents.map((e) => e.userId))];
  const userProfiles: UserProfile[] = [];

  for (const userId of users) {
    const events = securityEvents.filter((e) => e.userId === userId);
    const result = await getThreatProfile({ securityEvents: events });
    if (result && !result.error) {
      userProfiles.push({ userId, ...result });
    }
  }

  const highRiskProfiles = userProfiles.filter(
    (p) => p.threatLevel === 'HIGH RISK'
  );
  const suspiciousProfiles = userProfiles.filter(
    (p) => p.threatLevel === 'SUSPICIOUS'
  );

  const getThreatLevelVariant = (level: UserProfile['threatLevel']) => {
    switch (level) {
      case 'HIGH RISK':
        return 'destructive';
      case 'SUSPICIOUS':
        return 'secondary';
      default:
        return 'default';
    }
  };
  
    const getThreatLevelClass = (level: UserProfile['threatLevel']) => {
    switch (level) {
      case 'HIGH RISK':
        return 'bg-destructive/10 text-destructive';
      case 'SUSPICIOUS':
        return 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400';
      default:
        return 'bg-primary/10 text-primary';
    }
  };


  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      <header>
        <h1 className="font-headline text-3xl font-bold tracking-tight">Security Dashboard</h1>
        <p className="text-muted-foreground">Behavior-based threat analysis</p>
      </header>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Users Monitored</CardTitle>
            <CardDescription>Total number of users analyzed.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{userProfiles.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>High-Risk Users</CardTitle>
            <CardDescription>Users with unauthorized access patterns.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-destructive">{highRiskProfiles.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Suspicious Activity</CardTitle>
            <CardDescription>Users with abnormal access patterns.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-yellow-600 dark:text-yellow-400">{suspiciousProfiles.length}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>User Threat Profiles</CardTitle>
            <CardDescription>AI-powered analysis of user behavior.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {userProfiles.length > 0 ? (
              userProfiles.map((profile) => (
                <div key={profile.userId}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <Fingerprint className="h-5 w-5 text-muted-foreground" />
                      <span className="font-mono text-sm">{profile.userId}</span>
                    </div>
                     <Badge className={cn('text-xs', getThreatLevelClass(profile.threatLevel))}>
                      {profile.threatLevel}
                    </Badge>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground pl-8">{profile.analysisSummary}</p>
                   {profile.suspiciousActivity.length > 0 && (
                    <div className="mt-2 pl-8">
                      {profile.suspiciousActivity.map((activity, index) => (
                         <Alert key={index} variant="destructive" className="mt-2 text-xs">
                           <Siren className="h-4 w-4" />
                           <AlertDescription>{activity}</AlertDescription>
                         </Alert>
                      ))}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-center py-8">No user data to analyze.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Security Events</CardTitle>
            <CardDescription>A log of notable security-related events.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Outcome</TableHead>
                  <TableHead>Reason</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {securityEvents.slice(0, 10).map((event) => (
                  <TableRow key={event.id}>
                    <TableCell className="font-mono text-xs">{event.userId}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">{event.action}</Badge>
                    </TableCell>
                    <TableCell>
                       <Badge variant={event.outcome === 'success' ? 'default' : 'secondary'} className={cn('text-xs', event.outcome === 'success' ? 'bg-primary/10 text-primary' : 'bg-destructive/10 text-destructive')}>
                        {event.outcome}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs">{event.reason || 'N/A'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

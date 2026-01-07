export type Attachment = {
  filename: string;
  size: string;
};

export type Person = {
  name: string;
  email: string;
  avatar?: string;
};

export type Email = {
  id: string;
  from: Person;
  to: Person[];
  subject: string;
  body: string;
  date: string;
  read: boolean;
  attachments: Attachment[];
  mailbox: 'inbox' | 'sent' | 'trash' | 'spam';
};

export type SecurityEvent = {
  id: string;
  userId: string;
  action: 'send' | 'decrypt';
  outcome: 'success' | 'failure';
  reason?: 'unauthorized' | 'session_expired' | 'session_reused' | 'not_found';
  timestamp: string;
  emailId: string;
  emailSubject: string;
};

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt: string;
}

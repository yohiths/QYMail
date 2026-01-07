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

// This file is no longer used for static data, but can be kept for type definitions
// or future local data needs. All data is now fetched from Firestore.
import type { Email, SecurityEvent, Person } from './types';

// Dummy data for prototyping
const sender: Person = { name: 'QYMail Team', email: 'team@qymail.dev' };
const recipient: Person = { name: 'New User', email: 'user@qymail.dev' };

export const DUMMY_EMAILS: Omit<Email, 'id' | 'to' | 'read' | 'mailbox'>[] = [
  {
    from: { name: 'Project Galileo', email: 'no-reply@project-galileo.com' },
    subject: 'Welcome to the Future of Secure Communication',
    body: `
      <p>Hello,</p>
      <p>Welcome to QYMail, a demonstration of quantum-inspired email security. Your communications are now protected by principles that go beyond traditional encryption.</p>
      <p>Key features include:</p>
      <ul>
        <li><strong>Single-Use Session Keys:</strong> Each email is encrypted with a unique key that is destroyed after one use.</li>
        <li><strong>One-Time Decryption:</strong> Emails can only be decrypted once by the intended recipient.</li>
        <li><strong>Behavioral Threat Analysis:</strong> Our system monitors access patterns, not content, to detect and flag potential misuse.</li>
      </ul>
      <p>Explore the Security Dashboard to see how your account is being protected.</p>
      <p>Best,<br/>The Project Galileo Team</p>
    `,
    date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    attachments: [],
  },
  {
    from: { name: 'Security Operations', email: 'soc@qymail.dev' },
    subject: 'Security Tip: Understanding Your Dashboard',
    body: `
      <p>Hi there,</p>
      <p>Your Security Dashboard is your window into the integrity of your email sessions. It does <strong>not</strong> analyze your email content. Instead, it looks for unusual access behavior:</p>
      <ul>
        <li>Multiple failed decryption attempts.</li>
        <li>Attempts to access an email by an unauthorized party.</li>
        <li>Attempts to re-use an expired session key.</li>
      </ul>
      <p>A "SUSPICIOUS" or "HIGH RISK" status indicates that our system has detected patterns that could suggest an attempt to compromise your communications. Stay vigilant!</p>
      <p>Regards,<br/>QYMail Security Operations</p>
    `,
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    attachments: [],
  },
  {
    from: { name: 'Dr. Evelyn Reed', email: 'e.reed@quantum-research.org' },
    subject: 'Initial Data from Experiment Q-Delta',
    body: `
      <p>Team,</p>
      <p>The preliminary data from the Q-Delta entanglement experiment is in, and the results are promising. The decoherence rates are lower than projected, suggesting our new stabilization matrix is effective.</p>
      <p>Please review the attached data summary. We'll convene tomorrow at 10:00 AM to discuss the implications for the next phase.</p>
      <p>This is a breakthrough. Well done, everyone.</p>
      <p>Dr. Reed</p>
    `,
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    attachments: [{ filename: 'Q-Delta_Summary.pdf', size: '1.2MB' }],
  },
    {
    from: { name: 'Automated Alert System', email: 'alert@qymail.dev' },
    subject: 'Alert: Anomalous Session Activity Detected',
    body: `
      <p>This is an automated notification.</p>
      <p>Our system has detected multiple failed decryption attempts on an email sent to you. While the content remains secure, this pattern is considered suspicious.</p>
      <p><strong>Details:</strong></p>
      <ul>
        <li><strong>Email ID:</strong> #a4b1c8-3e5f-4r7g-9h1i-j2k3l4m5n6o7</li>
        <li><strong>Attempts:</strong> 5 failed decryptions</li>
        <li><strong>Timestamp:</strong> ${new Date().toLocaleString()}</li>
      </ul>
      <p>Your threat level has been elevated to <strong>SUSPICIOUS</strong>. Please review your Security Dashboard for more information. No immediate action is required, but remain aware.</p>
    `,
    date: new Date().toISOString(),
    attachments: [],
  },
];

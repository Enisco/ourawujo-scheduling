import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Ourawujo Scheduling',
  description: 'Cal.com-style scheduling for Ourawujo teachers and students',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

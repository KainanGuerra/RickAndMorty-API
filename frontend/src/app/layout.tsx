import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ZRP — Rick and Morty Episode Characters',
  description: 'Look up every character that appears in a Rick and Morty episode.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

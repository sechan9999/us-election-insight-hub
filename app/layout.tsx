import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'US Election Insights Hub',
  description: '2026 US midterm forecast board (ko/en): chamber control probabilities, battleground polling averages, uncertainty ranges.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body className="antialiased">{children}</body>
    </html>
  );
}

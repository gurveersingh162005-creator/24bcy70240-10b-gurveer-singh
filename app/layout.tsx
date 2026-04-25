import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import '../styles/globals.css';
import { Toaster } from 'sonner';
import AppHeader from '../components/AppHeader';

const geist = Geist({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '10b Fullstack App',
  description: 'Next.js Fullstack Auth & Posts Application',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={geist.className}>
        <AppHeader />
        <main className="min-h-screen bg-gray-50">
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  );
}
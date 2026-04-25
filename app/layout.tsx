import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AuthGate } from '@/components/AuthGate';

export const metadata: Metadata = {
  title: 'Kevin Moralez Manager',
  description: 'Manager dashboard para Kevin Moralez - Regional mexicano, corridos, covers',
  icons: {
    icon: '/favicon.svg',
    apple: '/logo.svg',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#000000',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-black">
        <AuthGate>{children}</AuthGate>
      </body>
    </html>
  );
}

import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import { AntdRegistry } from '@ant-design/nextjs-registry';

import { RouteGuard } from '@/components/guards/RouteGuard';
import { NotificationProvider } from '@/components/Notification';
import ReactQueryProvider from '@/components/providers/ReactQueryProvider';
import { ModuleProvider } from '@/contexts/ModuleContext';

import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Simple Go',
  description: 'High-performance modular CRM application',
  icons: {
    icon: [
      {
        url: '/favicon.ico',
        href: '/favicon.ico',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/favicon-dark.ico',
        href: '/favicon-dark.ico',
        media: '(prefers-color-scheme: dark)',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <AntdRegistry>
          <ReactQueryProvider>
            <ModuleProvider>
              <NotificationProvider />
              <RouteGuard>{children}</RouteGuard>
            </ModuleProvider>
          </ReactQueryProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}

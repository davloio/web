import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';
import SmoothScroll from '@/components/ui/SmoothScroll';

export const metadata: Metadata = {
  metadataBase: new URL('https://davlo.io'),
  title: 'davlo.io - software for the universe',
  description: 'Next generation blockchain explorers and innovative software solutions for modern blockchain ecosystems',
  keywords: ['blockchain', 'explorer', 'crypto', 'software'],
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
  },
  openGraph: {
    title: 'davlo.io - software for the universe',
    description: 'Next generation blockchain explorers and innovative software solutions for modern blockchain ecosystems',
    url: 'https://davlo.io',
    siteName: 'davlo.io',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'davlo.io - software for the universe',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'davlo.io - software for the universe',
    description: 'Next generation blockchain explorers and innovative software solutions for modern blockchain ecosystems',
    images: ['/og-image.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/yke5uje.css" />
      </head>
      <body>
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}

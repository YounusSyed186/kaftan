import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/layout/Footer';
import { getNavigationItems } from '@/services/navigation';

export const metadata: Metadata = {
  title: "KAFTAN — The World of Women's Fashion | Australia",
  description:
    'Australia premier luxury fashion editorial publication covering designer profiles, resort style, trends, travel, and modern elegance.',
  openGraph: {
    title: "KAFTAN — The World of Women's Fashion",
    description:
      'Australia premier luxury fashion editorial publication covering designer profiles, resort style, trends, travel, and modern elegance.',
    type: 'website',
    locale: 'en_AU',
    url: 'https://kaftan.fashion',
  },
};

import { SiteShell } from '@/components/layout/SiteShell';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navigationItems = await getNavigationItems();

  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#F7F4ED] text-[#25221F]">
        <SiteShell navigationItems={navigationItems}>
          {children}
        </SiteShell>
      </body>
    </html>
  );
}

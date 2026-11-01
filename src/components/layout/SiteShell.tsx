'use client';

import React, { Suspense } from 'react';
import { usePathname } from 'next/navigation';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/layout/Footer';
import type { NavigationItemRow } from '@/types/models';

interface SiteShellProps {
  children: React.ReactNode;
  navigationItems: NavigationItemRow[];
}

export function SiteShell({ children, navigationItems }: SiteShellProps) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  // If in admin panel, render without the public customer-facing Header and Footer
  if (isAdmin) {
    return <div className="min-h-screen flex flex-col flex-1">{children}</div>;
  }

  // Normal public publication pages
  return (
    <>
      <Suspense fallback={<div className="h-24 bg-[#F7F4ED] border-b border-[#D8D1C5]" />}>
        <Header navigationItems={navigationItems} />
      </Suspense>
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}

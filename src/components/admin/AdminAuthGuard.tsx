'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { getAdminSession } from '@/lib/auth/admin-static-auth';

export function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // If on the login page, bypass guard
    if (pathname === '/admin/login') {
      setIsAuthenticated(true);
      return;
    }

    // Verify static session
    const session = getAdminSession();
    if (!session) {
      setIsAuthenticated(false);
      const redirectUrl = pathname ? `/admin/login?redirect=${encodeURIComponent(pathname)}` : '/admin/login';
      router.replace(redirectUrl);
    } else {
      setIsAuthenticated(true);
    }
  }, [pathname, router]);

  // When on login page, render login UI directly
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  // Elegant verification splash while checking static session
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen w-full bg-[#F7F4ED] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-8 h-8 border-2 border-[#D8D1C5] border-t-[#A94F42] rounded-full animate-spin mb-3" />
        <span className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#77716A]">
          Verifying Editorial Session...
        </span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Redirecting to /admin/login
  }

  return <>{children}</>;
}


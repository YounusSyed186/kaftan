import React from 'react';
import { AdminAuthGuard } from '@/components/admin/AdminAuthGuard';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen w-full overflow-hidden bg-[#F7F4ED] text-[#25221F] flex flex-col font-sans antialiased">
      <AdminAuthGuard>{children}</AdminAuthGuard>
    </div>
  );
}

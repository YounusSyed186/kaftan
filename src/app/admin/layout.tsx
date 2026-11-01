import React from 'react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen w-full overflow-hidden bg-[#0C0B0A] text-[#EDE8DF] flex flex-col font-sans antialiased">
      {children}
    </div>
  );
}

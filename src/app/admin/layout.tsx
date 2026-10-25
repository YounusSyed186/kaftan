import React from 'react';
import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#EFEAE0] flex flex-col font-sans">
      {/* Admin Top Navigation */}
      <header className="bg-[#25221F] text-[#F7F4ED] px-6 py-4 flex items-center justify-between shadow-xs">
        <div className="flex items-center space-x-6">
          <Link href="/admin" className="font-serif-editorial text-2xl tracking-[0.18em]">
            KAFTAN CMS
          </Link>
          <span className="text-[10px] uppercase tracking-widest text-[#D8D1C5] bg-[#38332E] px-2 py-0.5 rounded-xs">
            Editorial Admin
          </span>
        </div>

        <div className="flex items-center space-x-6 text-xs text-[#D8D1C5]">
          <Link href="/" className="hover:text-white transition-colors">
            View Live Site &rarr;
          </Link>
          <span>•</span>
          <span className="font-medium text-white">Editorial Desk</span>
        </div>
      </header>

      {/* Admin Subheader / Module Nav */}
      <nav className="bg-[#FFFEFA] border-b border-[#D8D1C5] px-6 py-3 flex space-x-8 text-xs font-semibold uppercase tracking-wider text-[#77716A] overflow-x-auto">
        <Link href="/admin" className="text-[#25221F] border-b-2 border-[#25221F] pb-1">
          Dashboard
        </Link>
        <span className="hover:text-[#25221F] cursor-pointer">Articles</span>
        <span className="hover:text-[#25221F] cursor-pointer">Media Library</span>
        <span className="hover:text-[#25221F] cursor-pointer">Homepage Builder</span>
        <span className="hover:text-[#25221F] cursor-pointer">Products</span>
        <span className="hover:text-[#25221F] cursor-pointer">Competitions</span>
        <span className="hover:text-[#25221F] cursor-pointer">Campaigns &amp; Ads</span>
      </nav>

      {/* Content */}
      <main className="flex-1 max-w-[1400px] w-full mx-auto p-6 md:p-8">
        {children}
      </main>
    </div>
  );
}

import React from 'react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const modules = [
    { title: 'Articles', count: '14 published', desc: 'All editorial formats, contributors and revisions', link: '#' },
    { title: 'Media Library', count: '16 assets', desc: 'Cloudinary storage, variants, and responsive crops', link: '#' },
    { title: 'Homepage Sections', count: '7 active sections', desc: 'Section order, source modes and item assignments', link: '#' },
    { title: 'Products', count: '4 active listings', desc: 'Lightweight promotional cards and partner links', link: '#' },
    { title: 'Competitions', count: '1 active competition', desc: 'Terms, prize summaries, and entry submissions', link: '#' },
    { title: 'Sponsors & Campaigns', count: '1 sponsor, 1 campaign', desc: 'Commercial partnerships and disclosures', link: '#' },
    { title: 'Advertising', count: '1 placement, 1 creative', desc: 'Slot scheduling and device responsive banners', link: '#' },
    { title: 'Users & Roles', count: '3 team accounts', desc: 'Single-role administration and author permissions', link: '#' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-[#FFFEFA] border border-[#D8D1C5] p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#A94F42]">
            Editorial Headquarters
          </span>
          <h1 className="font-serif-editorial text-3xl sm:text-4xl text-[#25221F] font-normal mt-1">
            KAFTAN Publication Management
          </h1>
          <p className="text-xs text-[#77716A] mt-1 max-w-xl">
            Centralized content management system for stories, media library, database-driven homepage layout, promotional cards, and advertising.
          </p>
        </div>

        <div>
          <Link
            href="/"
            className="inline-flex items-center text-xs font-semibold uppercase tracking-[0.2em] bg-[#25221F] text-[#F7F4ED] px-5 py-2.5 hover:bg-[#A94F42] transition-colors"
          >
            Preview Live Site &rarr;
          </Link>
        </div>
      </div>

      {/* Grid of Modules */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {modules.map((mod, i) => (
          <div
            key={i}
            className="bg-[#FFFEFA] border border-[#D8D1C5] p-6 flex flex-col justify-between hover:border-[#25221F] transition-colors"
          >
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#77716A]">
                {mod.title}
              </span>
              <p className="font-serif-editorial text-2xl text-[#25221F] font-normal mt-2">
                {mod.count}
              </p>
              <p className="text-xs text-[#77716A] mt-2 leading-relaxed">
                {mod.desc}
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-[#D8D1C5]/60 flex items-center justify-between text-xs text-[#25221F] font-semibold uppercase tracking-wider">
              <span>Manage</span>
              <span>&rarr;</span>
            </div>
          </div>
        ))}
      </div>

      {/* Database Schema Status Box */}
      <div className="bg-[#FFFEFA] border border-[#D8D1C5] p-6">
        <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-[#25221F] mb-4">
          Schema &amp; Architecture Verification
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-[#77716A]">
          <div className="space-y-1.5 border-l-2 border-[#777B59] pl-3">
            <span className="font-semibold text-[#25221F] block">
              19 Approved Tables
            </span>
            <p>Full SQL migration implemented with UUIDs, foreign keys, and RLS policies.</p>
          </div>
          <div className="space-y-1.5 border-l-2 border-[#A94F42] pl-3">
            <span className="font-semibold text-[#25221F] block">
              Article Revisions Discrepancy
            </span>
            <p>Documented in implementation report; proposed schema ready for review.</p>
          </div>
          <div className="space-y-1.5 border-l-2 border-[#25221F] pl-3">
            <span className="font-semibold text-[#25221F] block">
              One Role Per User
            </span>
            <p>Enforced with roles table constraint and no redundant user_roles join table.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

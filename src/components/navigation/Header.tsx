'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Search, X } from 'lucide-react';
import { useNavigationStore } from '@/stores/navigation-store';
import type { NavigationItemRow } from '@/types/models';

interface HeaderProps {
  navigationItems: NavigationItemRow[];
}

export function Header({ navigationItems }: HeaderProps) {
  const pathname = usePathname();
  const {
    isMobileDrawerOpen,
    isSearchOpen,
    searchQuery,
    openMobileDrawer,
    closeMobileDrawer,
    toggleSearch,
    setSearchQuery,
  } = useNavigationStore();

  // Close drawer on route change
  useEffect(() => {
    closeMobileDrawer();
  }, [pathname, closeMobileDrawer]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeMobileDrawer();
        if (isSearchOpen) toggleSearch();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closeMobileDrawer, isSearchOpen, toggleSearch]);

  return (
    <header className="w-full bg-[#F7F4ED]">
      {/* =========================================================================
          DESKTOP MASTHEAD (hidden on small screens)
          ========================================================================= */}
      <div className="hidden md:block w-full px-[21px] lg:px-6 pt-3 pb-2.5">
        <div className="grid grid-cols-3 items-center">
          {/* Left: Region & Date */}
          <div className="flex flex-col text-[8.5px] uppercase tracking-[0.24em] text-[#77716A] leading-tight">
            <span className="font-semibold text-[#25221F]">AUSTRALIA</span>
            <span className="text-[7.5px] tracking-[0.18em] text-[#77716A] mt-0.5">MON, 20 OCT 2026</span>
          </div>

          {/* Center: KAFTAN Logo & Tagline */}
          <div className="flex flex-col items-center justify-center text-center">
            <Link href="/" className="inline-block group">
              <h1 className="font-serif-editorial text-[42px] lg:text-[46px] leading-none font-normal tracking-[0.18em] text-[#25221F] uppercase transition-opacity hover:opacity-85">
                KAFTAN
              </h1>
            </Link>
            <p className="mt-1 text-[7.5px] lg:text-[8px] uppercase tracking-[0.34em] text-[#77716A] font-medium">
              The World of Women&apos;s Fashion
            </p>
          </div>

          {/* Right: Subscribe & Search */}
          <div className="flex items-center justify-end space-x-4">
            <div className="text-right">
              <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#25221F] block">
                Subscribe
              </span>
              <span className="text-[8px] text-[#77716A] tracking-wider block mt-0.5">
                Fashion. Designers. Inspiration. &rarr;
              </span>
            </div>
            <div className="h-4 w-[1px] bg-[#D8D1C5]" aria-hidden="true" />
            <button
              onClick={toggleSearch}
              aria-label="Search publication"
              className="p-1 text-[#25221F] hover:text-[#A94F42] transition-colors"
            >
              <Search className="w-4 h-4 stroke-[1.5]" />
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Navigation Row */}
      <div className="hidden md:block border-t border-b border-[#D8D1C5]">
        <div className="w-full px-[21px] lg:px-6 h-[46px] flex items-center justify-between">
          <button
            onClick={openMobileDrawer}
            aria-label="Open menu drawer"
            className="w-5 p-0.5 text-[#25221F] hover:text-[#A94F42]"
          >
            <Menu className="w-4 h-4 stroke-[1.5]" />
          </button>

          <nav className="flex-1 flex items-center justify-center space-x-6 sm:space-x-8 lg:space-x-10">
            {navigationItems.map((item) => {
              const isActive = pathname === item.url;
              const isSale = item.label.toLowerCase() === 'sale';
              return (
                <Link
                  key={item.id}
                  href={item.url}
                  target={item.open_in_new_tab ? '_blank' : undefined}
                  rel={item.open_in_new_tab ? 'noopener noreferrer' : undefined}
                  className={`text-[8.5px] lg:text-[9.5px] uppercase tracking-[0.20em] transition-colors ${
                    isSale
                      ? 'text-[#B44238] font-semibold hover:text-[#8f322a]'
                      : isActive
                      ? 'text-[#25221F] font-semibold border-b border-[#25221F] pb-0.5'
                      : 'text-[#55504A] hover:text-[#25221F]'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Spacer to keep navigation centered */}
          <div className="w-5" aria-hidden="true" />
        </div>
      </div>

      {/* =========================================================================
          MOBILE MASTHEAD
          ========================================================================= */}
      <div className="md:hidden h-11 px-4 flex items-center justify-between border-b border-[#D8D1C5]">
        <button
          onClick={openMobileDrawer}
          aria-label="Open navigation menu"
          className="p-1.5 text-[#25221F]"
        >
          <Menu className="w-5 h-5 stroke-[1.5]" />
        </button>

        <Link href="/" className="flex flex-col items-center">
          <span className="font-serif-editorial text-2xl font-normal tracking-[0.18em] text-[#25221F] uppercase">
            KAFTAN
          </span>
        </Link>

        <button
          onClick={toggleSearch}
          aria-label="Open search"
          className="p-1.5 text-[#25221F]"
        >
          <Search className="w-5 h-5 stroke-[1.5]" />
        </button>
      </div>

      {/* =========================================================================
          SEARCH OVERLAY
          ========================================================================= */}
      {isSearchOpen && (
        <div className="border-t border-[#D8D1C5] bg-[#EFEAE0] px-4 py-4 transition-all">
          <div className="max-w-[800px] mx-auto flex items-center space-x-3">
            <Search className="w-5 h-5 text-[#77716A]" />
            <input
              type="text"
              placeholder="Search stories, designers, trends, products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
              className="flex-1 bg-transparent border-b border-[#D8D1C5] pb-1 text-sm text-[#25221F] placeholder-[#77716A] focus:outline-none focus:border-[#25221F]"
            />
            <button
              onClick={toggleSearch}
              className="text-xs uppercase tracking-widest text-[#77716A] hover:text-[#25221F]"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          MOBILE DRAWER (Accessible Modal)
          ========================================================================= */}
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={closeMobileDrawer}
          />

          {/* Drawer content */}
          <div className="relative w-4/5 max-w-xs bg-[#F7F4ED] h-full shadow-2xl flex flex-col p-6 z-10 overflow-y-auto">
            <div className="flex items-center justify-between pb-6 border-b border-[#D8D1C5]">
              <span className="font-serif-editorial text-2xl tracking-[0.2em] text-[#25221F]">
                KAFTAN
              </span>
              <button
                onClick={closeMobileDrawer}
                aria-label="Close menu"
                className="p-1 text-[#77716A] hover:text-[#25221F]"
              >
                <X className="w-6 h-6 stroke-[1.5]" />
              </button>
            </div>

            <div className="my-4 text-[10px] uppercase tracking-[0.2em] text-[#77716A]">
              Australia Edition — Mon, 20 Oct 2026
            </div>

            <nav className="flex flex-col space-y-4 py-4">
              {navigationItems.map((item) => {
                const isActive = pathname === item.url;
                const isSale = item.label.toLowerCase() === 'sale';
                return (
                  <Link
                    key={item.id}
                    href={item.url}
                    onClick={closeMobileDrawer}
                    className={`text-sm uppercase tracking-[0.2em] py-2 border-b border-[#D8D1C5]/40 transition-colors ${
                      isSale
                        ? 'text-[#B44238] font-semibold'
                        : isActive
                        ? 'text-[#25221F] font-bold'
                        : 'text-[#77716A] hover:text-[#25221F]'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-auto pt-6 border-t border-[#D8D1C5] text-xs text-[#77716A] space-y-2">
              <p className="font-medium text-[#25221F] tracking-wider uppercase text-[11px]">
                KAFTAN Publication
              </p>
              <p>The World of Women&apos;s Fashion</p>
              <p className="text-[10px] text-[#77716A]/80">© 2026 KAFTAN. All rights reserved.</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { buildCloudinaryUrl } from '@/lib/cloudinary/url';

export interface CategoryItem {
  id: string;
  name: string;
  href: string;
  imageSrc: string;
}

const DEFAULT_CATEGORIES: CategoryItem[] = [
  {
    id: 'cat-1',
    name: 'Resortwear',
    href: '/trends',
    imageSrc: 'kaftan/categories/resortwear',
  },
  {
    id: 'cat-2',
    name: 'Occasion Wear',
    href: '/style',
    imageSrc: 'kaftan/categories/occasion-wear',
  },
  {
    id: 'cat-3',
    name: 'Australian Designers',
    href: '/designers',
    imageSrc: 'kaftan/categories/australian-designers',
  },
  {
    id: 'cat-4',
    name: 'Sustainable Fashion',
    href: '/lifestyle',
    imageSrc: 'kaftan/categories/sustainable-fashion',
  },
  {
    id: 'cat-5',
    name: 'Street Style',
    href: '/trends',
    imageSrc: 'kaftan/categories/street-style',
  },
  {
    id: 'cat-6',
    name: 'Accessories',
    href: '/lifestyle',
    imageSrc: 'kaftan/categories/accessories',
  },
];

interface VisualCategoryStripProps {
  categories?: CategoryItem[];
}

export function VisualCategoryStrip({ categories = DEFAULT_CATEGORIES }: VisualCategoryStripProps) {
  return (
    <section aria-label="Fashion Categories" className="w-full py-5 md:py-6 border-b border-[#D8D1C5]/60 bg-[#FAF8F5]">
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
      {/* =========================================================================
          DESKTOP: 6 EQUAL COLUMNS GRID (>= md)
          ========================================================================= */}
      <div className="hidden md:grid md:grid-cols-6 gap-3 lg:gap-4 items-start w-full">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={cat.href}
            className="flex flex-col items-center group text-center"
          >
            <div className="relative w-full aspect-[4/3] overflow-hidden bg-[#EFEAE0] border border-[#D8D1C5]/50 shadow-sm transition-all duration-300 group-hover:border-[#A94F42]/40">
              <Image
                src={buildCloudinaryUrl(cat.imageSrc, { width: 400 })}
                alt={cat.name}
                fill
                sizes="(max-width: 1024px) 16vw, 14vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <span className="mt-2 text-[10px] lg:text-[11px] font-medium tracking-[0.08em] text-[#25221F] group-hover:text-[#A94F42] transition-colors leading-tight">
              {cat.name}
            </span>
          </Link>
        ))}
      </div>

      {/* =========================================================================
          MOBILE: HORIZONTALLY SCROLLABLE CAROUSEL (< md)
          ========================================================================= */}
      <div className="md:hidden flex overflow-x-auto snap-x snap-mandatory space-x-3 pb-1 -mx-4 sm:-mx-6 px-4 sm:px-6 scrollbar-none">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={cat.href}
            className="flex-shrink-0 w-[148px] flex flex-col items-center snap-start group text-center"
          >
            <div className="relative w-full aspect-[4/3] overflow-hidden bg-[#EFEAE0] border border-[#D8D1C5]/50 shadow-sm">
              <Image
                src={buildCloudinaryUrl(cat.imageSrc, { width: 400 })}
                alt={cat.name}
                fill
                sizes="148px"
                className="object-cover group-active:scale-105 transition-transform duration-300"
              />
            </div>
            <span className="mt-2 text-[10.5px] font-medium tracking-[0.06em] text-[#25221F] leading-tight">
              {cat.name}
            </span>
          </Link>
        ))}
      </div>
      </div>
    </section>
  );
}

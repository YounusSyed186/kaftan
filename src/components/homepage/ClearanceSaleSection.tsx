'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { buildCloudinaryUrl } from '@/lib/cloudinary/url';
import { EditableElement } from '@/components/admin/homepage-studio/EditableElement';
import type { PopulatedProduct } from '@/types/models';

interface ClearanceSaleSectionProps {
  products: PopulatedProduct[];
  sectionId?: string;
  isEditorMode?: boolean;
  clearanceTitle?: string;
  clearanceSubtitle?: string;
  clearanceViewAllLabel?: string;
  clearanceViewAllUrl?: string;
  forcedViewport?: 'desktop' | 'tablet' | 'mobile';
  onCommitInlineText?: (field: string, value: string) => void;
}

function ArrowIcon() {
  return (
    <svg
      className="w-3.5 h-3.5 inline-block ml-0.5 transition-transform group-hover:translate-x-0.5 shrink-0"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2.5 8h10.5M8.5 4l4 4-4 4" />
    </svg>
  );
}

export function ClearanceSaleSection({
  products,
  sectionId = 'clearance_sale',
  isEditorMode = false,
  clearanceTitle = 'CLEARANCE SALE',
  clearanceSubtitle,
  clearanceViewAllLabel = 'VIEW ALL',
  clearanceViewAllUrl = '/sale',
  forcedViewport,
  onCommitInlineText,
}: ClearanceSaleSectionProps) {
  const [mobileIndex, setMobileIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  if (!products || products.length === 0) {
    return null;
  }

  const handlePrev = () => {
    setMobileIndex((prev) => (prev > 0 ? prev - 1 : products.length - 1));
  };

  const handleNext = () => {
    setMobileIndex((prev) => (prev < products.length - 1 ? prev + 1 : 0));
  };

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const currentX = e.touches[0].clientX;
    const diff = touchStartX - currentX;
    if (diff > 50) {
      handleNext();
      setTouchStartX(null);
    } else if (diff < -50) {
      handlePrev();
      setTouchStartX(null);
    }
  };

  const onTouchEnd = () => {
    setTouchStartX(null);
  };

  const currentProduct = products[mobileIndex] || products[0];

  return (
    <section aria-label="Clearance Sale" className="w-full py-8 md:py-10 border-b border-[#D8D1C5]/60 bg-[#FAF8F5]">
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
        {/* Header Row */}
        <div className="flex items-center justify-between pb-3.5 border-b border-[#D8D1C5]/60 mb-6">
          <div className="flex items-center gap-3">
            <EditableElement
              sectionId={sectionId}
              elementId="clearance_title"
              elementType="heading"
              label="Clearance Title"
              allowInlineEdit
              inlineTextValue={clearanceTitle}
              onCommitInlineText={(val) => onCommitInlineText?.('clearance_title', val)}
            >
              <h3 className="text-xs sm:text-[13px] font-bold uppercase tracking-[0.22em] text-[#25221F]">
                {clearanceTitle} &mdash;
              </h3>
            </EditableElement>

            {clearanceSubtitle && (
              <span className="hidden sm:inline text-xs text-[#77716A] font-serif-editorial italic">
                {clearanceSubtitle}
              </span>
            )}
          </div>

          <EditableElement
            sectionId={sectionId}
            elementId="clearance_view_all"
            elementType="link"
            label="View All Link"
          >
            <Link
              href={isEditorMode ? '#' : clearanceViewAllUrl}
              className="text-[9px] sm:text-[9.5px] font-semibold uppercase tracking-[0.2em] text-[#706C66] hover:text-[#25221F] transition-colors inline-flex items-center gap-1.5"
            >
              <span>{clearanceViewAllLabel}</span>
              <ArrowIcon />
            </Link>
          </EditableElement>
        </div>

        {/* Desktop 4 Equal Product Cards */}
        <div className={forcedViewport === 'mobile' ? 'hidden' : (forcedViewport ? 'grid md:grid-cols-4 gap-4 lg:gap-5' : 'hidden md:grid md:grid-cols-4 gap-4 lg:gap-5')}>
          {products.map((product, idx) => (
            <div
              key={product.id}
              className="flex flex-col justify-between bg-[#FFFEFA] border border-[#D8D1C5]/70 p-4 group shadow-sm transition-all duration-300 hover:border-[#A94F42]/40"
            >
              <EditableElement
                sectionId={sectionId}
                elementId={`product_card_${idx}`}
                elementType="slot"
                label={`Product Slot 0${idx + 1}`}
              >
                {/* Product Image */}
                <a
                  href={isEditorMode ? '#' : product.product_url}
                  target={isEditorMode ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  className="relative block w-full aspect-[3/4] overflow-hidden bg-[#EFEAE0] border border-[#D8D1C5]/30"
                >
                  <Image
                    src={buildCloudinaryUrl(product.image?.storage_key || 'kaftan/products/azure-resort-kaftan', { width: 800 })}
                    alt={product.name}
                    fill
                    sizes="25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </a>

                {/* Product Meta */}
                <div className="pt-3.5 flex flex-col space-y-1 text-center">
                  <span className="text-[9px] uppercase tracking-[0.18em] text-[#77716A] font-medium">
                    {product.brand_name}
                  </span>
                  <a
                    href={isEditorMode ? '#' : product.product_url}
                    target={isEditorMode ? undefined : '_blank'}
                    rel="noopener noreferrer"
                  >
                    <h4 className="font-serif-editorial text-[17px] text-[#25221F] font-normal leading-tight group-hover:text-[#A94F42] transition-colors line-clamp-1">
                      {product.name}
                    </h4>
                  </a>
                  <div className="flex items-center justify-center space-x-2 pt-1 font-mono text-xs">
                    {product.original_price && (
                      <span className="text-[#99938B] line-through text-[11px]">
                        ${product.original_price.toFixed(2)}
                      </span>
                    )}
                    <span className="text-[#A94F42] font-semibold text-[13px]">
                      ${(product.sale_price || product.original_price || 0).toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="pt-3">
                  <a
                    href={isEditorMode ? '#' : product.product_url}
                    target={isEditorMode ? undefined : '_blank'}
                    rel="noopener noreferrer"
                    className="block w-full py-1.5 text-center text-[8.5px] font-semibold uppercase tracking-[0.18em] text-[#25221F] border border-[#D8D1C5] hover:border-[#25221F] hover:bg-[#25221F] hover:text-[#FFFEFA] transition-all duration-300"
                  >
                    SHOP NOW
                  </a>
                </div>
              </EditableElement>
            </div>
          ))}
        </div>

        {/* Mobile Single Card Carousel */}
        <div
          className={forcedViewport === 'mobile' ? 'flex flex-col items-center w-full' : (forcedViewport ? 'hidden' : 'md:hidden flex flex-col items-center w-full')}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div className="w-full max-w-[340px] bg-[#FFFEFA] border border-[#D8D1C5]/70 p-4 shadow-sm">
            <a
              href={isEditorMode ? '#' : currentProduct.product_url}
              target={isEditorMode ? undefined : '_blank'}
              rel="noopener noreferrer"
              className="relative block w-full aspect-[3/4] overflow-hidden bg-[#EFEAE0] border border-[#D8D1C5]/30"
            >
              <Image
                src={buildCloudinaryUrl(currentProduct.image?.storage_key || 'kaftan/products/azure-resort-kaftan', { width: 800 })}
                alt={currentProduct.name}
                fill
                sizes="340px"
                className="object-cover"
              />
            </a>

            <div className="pt-3.5 flex flex-col space-y-1 text-center">
              <span className="text-[9px] uppercase tracking-[0.18em] text-[#77716A] font-medium">
                {currentProduct.brand_name}
              </span>
              <a
                href={isEditorMode ? '#' : currentProduct.product_url}
                target={isEditorMode ? undefined : '_blank'}
                rel="noopener noreferrer"
              >
                <h4 className="font-serif-editorial text-[17px] text-[#25221F] font-normal leading-tight">
                  {currentProduct.name}
                </h4>
              </a>
              <div className="flex items-center justify-center space-x-2 pt-1 font-mono text-xs">
                {currentProduct.original_price && (
                  <span className="text-[#99938B] line-through text-[11px]">
                    ${currentProduct.original_price.toFixed(2)}
                  </span>
                )}
                <span className="text-[#A94F42] font-semibold text-[13px]">
                  ${(currentProduct.sale_price || currentProduct.original_price || 0).toFixed(2)}
                </span>
              </div>
            </div>

            <div className="pt-3">
              <a
                href={isEditorMode ? '#' : currentProduct.product_url}
                target={isEditorMode ? undefined : '_blank'}
                rel="noopener noreferrer"
                className="block w-full py-1.5 text-center text-[8.5px] font-semibold uppercase tracking-[0.18em] text-[#25221F] border border-[#D8D1C5]"
              >
                SHOP NOW
              </a>
            </div>
          </div>

          {/* Carousel dots */}
          <div className="flex items-center justify-center gap-1.5 mt-4">
            {products.map((_, i) => (
              <button
                key={i}
                onClick={() => setMobileIndex(i)}
                className={`h-1.5 rounded-full transition-all ${
                  mobileIndex === i ? 'w-4 bg-[#A94F42]' : 'w-1.5 bg-[#D8D1C5]'
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

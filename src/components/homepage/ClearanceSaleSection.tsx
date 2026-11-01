'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { PopulatedProduct } from '@/types/models';

interface ClearanceSaleSectionProps {
  products: PopulatedProduct[];
}

export function ClearanceSaleSection({ products }: ClearanceSaleSectionProps) {
  const [mobileIndex, setMobileIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);

  if (!products || products.length === 0) return null;

  const totalProducts = products.length;

  const handlePrev = () => {
    setMobileIndex((prev) => (prev === 0 ? totalProducts - 1 : prev - 1));
  };

  const handleNext = () => {
    setMobileIndex((prev) => (prev === totalProducts - 1 ? 0 : prev + 1));
  };

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEndX(null);
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStartX || !touchEndX) return;
    const distance = touchStartX - touchEndX;
    const minSwipeDistance = 40;
    if (distance > minSwipeDistance) {
      handleNext();
    } else if (distance < -minSwipeDistance) {
      handlePrev();
    }
  };

  const currentProduct = products[mobileIndex] || products[0];

  return (
    <section aria-label="Clearance Sale" className="w-full px-[21px] lg:px-6 py-8 md:py-10 border-b border-[#D8D1C5]/60 bg-[#FAF8F5]">
      {/* Header Row */}
      <div className="flex items-center justify-between pb-3.5 border-b border-[#D8D1C5]/60 mb-6">
        <div className="flex items-center gap-3">
          <h3 className="text-[11px] sm:text-[12px] font-bold uppercase tracking-[0.24em] text-[#25221F]">
            Clearance Sale
          </h3>
          <span className="hidden sm:inline-block w-8 h-[1px] bg-[#D8D1C5]"></span>
        </div>
        <Link
          href="/sale"
          className="text-[9.5px] sm:text-[10px] font-semibold uppercase tracking-[0.18em] text-[#77716A] hover:text-[#25221F] transition-colors"
        >
          <span className="hidden sm:inline">View All Clearance</span>
          <span className="sm:hidden">View All</span> &rarr;
        </Link>
      </div>

      {/* =========================================================================
          DESKTOP: 4 EQUAL PRODUCT CARDS (>= md)
          ========================================================================= */}
      <div className="hidden md:grid md:grid-cols-4 gap-4 lg:gap-5">
        {products.map((product) => (
          <div
            key={product.id}
            className="flex flex-col justify-between bg-[#FFFEFA] border border-[#D8D1C5]/70 p-4 group shadow-sm transition-all duration-300 hover:border-[#A94F42]/40"
          >
            {/* Product Image */}
            <a
              href={product.product_url}
              target="_blank"
              rel="noopener noreferrer"
              className="relative block w-full aspect-[3/4] overflow-hidden bg-[#EFEAE0] border border-[#D8D1C5]/30"
            >
              <Image
                src={product.image?.storage_key || '/images/products/azure-resort-kaftan.jpg'}
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
                href={product.product_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <h4 className="font-serif-editorial text-[17px] text-[#25221F] font-normal leading-tight group-hover:text-[#A94F42] transition-colors">
                  {product.name}
                </h4>
              </a>

              {/* Price Display */}
              <div className="pt-1 flex items-center justify-center space-x-2 text-[12px]">
                {product.original_price && (
                  <span className="text-[#888177] line-through font-mono text-[11.5px]">
                    ${Number(product.original_price).toFixed(2)}
                  </span>
                )}
                {product.sale_price ? (
                  <span className="text-[#B44238] font-bold font-mono">
                    ${Number(product.sale_price).toFixed(2)}
                  </span>
                ) : (
                  <span className="text-[#25221F] font-semibold font-mono">
                    ${Number(product.original_price || 0).toFixed(2)}
                  </span>
                )}
              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-3 mt-auto">
              <a
                href={product.product_url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full block text-center text-[9px] font-semibold uppercase tracking-[0.18em] text-[#25221F] border border-[#D8D1C5] py-2 hover:border-[#25221F] hover:bg-[#25221F] hover:text-[#FAF8F5] transition-colors"
              >
                Shop Now &rarr;
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* =========================================================================
          MOBILE: SINGLE CARD INTERACTIVE CAROUSEL (< md)
          ========================================================================= */}
      <div
        className="md:hidden flex flex-col items-center w-full"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div className="w-full max-w-[340px] bg-[#FFFEFA] border border-[#D8D1C5]/70 p-4 shadow-sm">
          {/* Product Image */}
          <a
            href={currentProduct.product_url}
            target="_blank"
            rel="noopener noreferrer"
            className="relative block w-full aspect-[3/4] overflow-hidden bg-[#EFEAE0] border border-[#D8D1C5]/30"
          >
            <Image
              src={currentProduct.image?.storage_key || '/images/products/azure-resort-kaftan.jpg'}
              alt={currentProduct.name}
              fill
              sizes="340px"
              className="object-cover"
            />
          </a>

          {/* Product Meta */}
          <div className="pt-3.5 flex flex-col space-y-1 text-center">
            <span className="text-[9px] uppercase tracking-[0.18em] text-[#77716A] font-medium">
              {currentProduct.brand_name}
            </span>
            <a
              href={currentProduct.product_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <h4 className="font-serif-editorial text-[17px] text-[#25221F] font-normal leading-tight">
                {currentProduct.name}
              </h4>
            </a>

            {/* Price Display */}
            <div className="pt-1 flex items-center justify-center space-x-2 text-[12px]">
              {currentProduct.original_price && (
                <span className="text-[#888177] line-through font-mono text-[11.5px]">
                  ${Number(currentProduct.original_price).toFixed(2)}
                </span>
              )}
              {currentProduct.sale_price ? (
                <span className="text-[#B44238] font-bold font-mono">
                  ${Number(currentProduct.sale_price).toFixed(2)}
                </span>
              ) : (
                <span className="text-[#25221F] font-semibold font-mono">
                  ${Number(currentProduct.original_price || 0).toFixed(2)}
                </span>
              )}
            </div>
          </div>

          {/* CTA Button */}
          <div className="pt-3 mt-auto">
            <a
              href={currentProduct.product_url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full block text-center text-[9px] font-semibold uppercase tracking-[0.18em] text-[#25221F] border border-[#D8D1C5] py-2 hover:bg-[#25221F] hover:text-[#FAF8F5] transition-colors"
            >
              Shop Now &rarr;
            </a>
          </div>
        </div>

        {/* Carousel Pagination Dots & Arrow Controls */}
        <div className="flex items-center justify-between w-full max-w-[340px] pt-4 px-1">
          {/* Dot Indicators */}
          <div className="flex items-center space-x-1.5" aria-label="Product navigation dots">
            {products.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setMobileIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`transition-all duration-300 rounded-full ${
                  idx === mobileIndex
                    ? 'w-2 h-2 bg-[#25221F]'
                    : 'w-1.5 h-1.5 bg-[#D8D1C5] hover:bg-[#77716A]'
                }`}
              />
            ))}
          </div>

          {/* Arrow Buttons */}
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous product"
              className="w-7 h-7 rounded-full border border-[#D8D1C5] flex items-center justify-center text-[12px] text-[#25221F] hover:bg-[#25221F] hover:text-[#FAF8F5] transition-colors"
            >
              &lsaquo;
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next product"
              className="w-7 h-7 rounded-full border border-[#D8D1C5] flex items-center justify-center text-[12px] text-[#25221F] hover:bg-[#25221F] hover:text-[#FAF8F5] transition-colors"
            >
              &rsaquo;
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

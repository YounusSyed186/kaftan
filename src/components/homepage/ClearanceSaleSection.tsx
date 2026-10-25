import React from 'react';
import Link from 'next/link';
import { EditorialImage } from '@/components/media/EditorialImage';
import type { PopulatedProduct } from '@/types/models';

interface ClearanceSaleSectionProps {
  products: PopulatedProduct[];
}

export function ClearanceSaleSection({ products }: ClearanceSaleSectionProps) {
  return (
    <section className="w-full px-4 sm:px-5 lg:px-6 py-10 sm:py-12">
      {/* Header Row */}
      <div className="flex items-center justify-between pb-4 border-b border-[#D8D1C5]">
        <div>
          <h3 className="text-xs sm:text-sm font-bold uppercase tracking-[0.25em] text-[#25221F]">
            Clearance Sale
          </h3>
        </div>
        <Link
          href="/sale"
          className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#77716A] hover:text-[#25221F] transition-colors"
        >
          View All Clearance &rarr;
        </Link>
      </div>

      {/* Product Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-8">
        {products.map((product) => (
          <div
            key={product.id}
            className="flex flex-col justify-between bg-[#FFFEFA] border border-[#D8D1C5]/70 p-4 group"
          >
            {/* Product Image */}
            <div className="w-full aspect-[3/4] overflow-hidden bg-[#EFEAE0] relative">
              <a
                href={product.product_url}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full h-full"
              >
                <EditorialImage
                  media={product.image}
                  src={product.image?.storage_key}
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </a>
            </div>

            {/* Product Meta */}
            <div className="pt-4 flex flex-col space-y-1 text-center">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#77716A]">
                {product.brand_name}
              </span>
              <a
                href={product.product_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <h4 className="font-serif-editorial text-lg text-[#25221F] font-normal group-hover:text-[#A94F42] transition-colors">
                  {product.name}
                </h4>
              </a>

              {/* Price Display */}
              <div className="pt-1 flex items-center justify-center space-x-2 text-xs">
                {product.original_price && (
                  <span className="text-[#77716A] line-through font-mono">
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
            <div className="pt-4 mt-auto">
              <a
                href={product.product_url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full block text-center text-[10px] font-semibold uppercase tracking-[0.2em] text-[#25221F] border border-[#D8D1C5] py-2.5 hover:border-[#25221F] hover:bg-[#25221F] hover:text-[#F7F4ED] transition-colors"
              >
                Shop Now &rarr;
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

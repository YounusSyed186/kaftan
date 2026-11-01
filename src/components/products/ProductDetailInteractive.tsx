'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { PopulatedProduct } from '@/types/models';

interface ProductDetailInteractiveProps {
  product: PopulatedProduct;
  relatedProducts: PopulatedProduct[];
}

export function ProductDetailInteractive({
  product,
  relatedProducts,
}: ProductDetailInteractiveProps) {
  const [selectedSize, setSelectedSize] = useState<string>('One Size Fits Most');
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'craft' | 'styling' | 'dimensions' | 'delivery'>('craft');
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('kaftan_wishlist');
        const list: string[] = saved ? JSON.parse(saved) : [];
        return list.includes(product.id);
      } catch {
        return false;
      }
    }
    return false;
  });
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const toggleWishlist = () => {
    const nextState = !isWishlisted;
    setIsWishlisted(nextState);
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('kaftan_wishlist');
        let list: string[] = saved ? JSON.parse(saved) : [];
        if (nextState) {
          if (!list.includes(product.id)) list.push(product.id);
          showToast(`Saved "${product.name}" to your wishlist`);
        } else {
          list = list.filter((id) => id !== product.id);
          showToast(`Removed "${product.name}" from your wishlist`);
        }
        localStorage.setItem('kaftan_wishlist', JSON.stringify(list));
      } catch {
        // ignore
      }
    }
  };

  const discountPct =
    product.original_price && product.sale_price && product.original_price > product.sale_price
      ? Math.round(((product.original_price - product.sale_price) / product.original_price) * 100)
      : null;

  const savings =
    product.original_price && product.sale_price && product.original_price > product.sale_price
      ? (product.original_price - product.sale_price).toFixed(2)
      : null;

  const sizes = [
    { label: 'One Size Fits Most', desc: 'Fluid relaxed drape (AU 8 - 18)' },
    { label: 'XS / S', desc: 'Petite silhouette (AU 6 - 10)' },
    { label: 'M / L', desc: 'Standard tailored flow (AU 12 - 16)' },
    { label: 'XL / Oversized', desc: 'Voluminous resort sweep (AU 18 - 22)' },
  ];

  return (
    <div className="w-full">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#25221F] text-[#FAF8F5] text-xs px-5 py-3 shadow-xl border border-[#D8D1C5] animate-fade-in flex items-center space-x-3">
          <span className="text-[#B44238]">♥</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main PDP Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14">
        {/* Left: Gallery & Visual Showcase (7 cols on lg) */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          <div className="relative aspect-[3/4] w-full bg-[#EFEAE0] border border-[#D8D1C5] overflow-hidden group shadow-xs">
            <Image
              src={product.image?.storage_key || '/images/products/azure-resort-kaftan.jpg'}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            {discountPct && (
              <span className="absolute top-4 left-4 bg-[#B44238] text-white text-[11px] font-mono font-bold px-3 py-1 tracking-wider uppercase shadow-md">
                {discountPct}% OFF
              </span>
            )}
            <button
              type="button"
              onClick={toggleWishlist}
              aria-label="Toggle Wishlist"
              className={`absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center transition-colors shadow-md ${
                isWishlisted ? 'bg-[#B44238] text-white' : 'bg-white/80 text-[#25221F] hover:bg-white'
              }`}
            >
              <span className="text-sm">{isWishlisted ? '♥' : '♡'}</span>
            </button>
          </div>

          {/* Atelier Trust Badges */}
          <div className="grid grid-cols-3 gap-3 pt-3 border-t border-[#D8D1C5]/70 text-center text-[#77716A]">
            <div className="p-3 bg-[#FFFEFA] border border-[#D8D1C5]/60 flex flex-col items-center justify-center">
              <span className="text-base mb-1">✦</span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#25221F]">
                100% Pure Silk
              </span>
              <span className="text-[9px] text-[#888177]">Artisanal Hand-Finish</span>
            </div>
            <div className="p-3 bg-[#FFFEFA] border border-[#D8D1C5]/60 flex flex-col items-center justify-center">
              <span className="text-base mb-1">✈</span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#25221F]">
                Fast Delivery
              </span>
              <span className="text-[9px] text-[#888177]">Carbon-Neutral Express</span>
            </div>
            <div className="p-3 bg-[#FFFEFA] border border-[#D8D1C5]/60 flex flex-col items-center justify-center">
              <span className="text-base mb-1">↺</span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#25221F]">
                Atelier Returns
              </span>
              <span className="text-[9px] text-[#888177]">14-Day Boutique Exchange</span>
            </div>
          </div>
        </div>

        {/* Right: Product Details & Purchase Actions (5 cols on lg) */}
        <div className="lg:col-span-5 flex flex-col justify-start space-y-6">
          {/* Brand Kicker & In Stock Indicator */}
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#B44238] font-bold">
              {product.brand_name}
            </span>
            <div className="flex items-center space-x-2 text-[10px] uppercase tracking-wider text-[#496C42] font-medium bg-[#EBF3E7] px-2.5 py-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#496C42] animate-pulse"></span>
              <span>In Stock — Atelier Verified</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="font-serif-editorial text-3xl sm:text-4xl text-[#25221F] font-normal leading-tight">
            {product.name}
          </h1>

          {/* Price Block */}
          <div className="flex items-baseline space-x-3 pb-4 border-b border-[#D8D1C5]/70">
            {product.sale_price ? (
              <>
                <span className="font-mono text-2xl sm:text-3xl font-bold text-[#B44238]">
                  ${Number(product.sale_price).toFixed(2)}
                </span>
                {product.original_price && (
                  <span className="font-mono text-base text-[#888177] line-through">
                    ${Number(product.original_price).toFixed(2)}
                  </span>
                )}
                <span className="text-xs font-medium uppercase tracking-wider text-[#77716A]">
                  {product.currency}
                </span>
                {savings && (
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#B44238] bg-[#F9ECE9] px-2 py-0.5 ml-auto">
                    Save ${savings}
                  </span>
                )}
              </>
            ) : (
              <>
                <span className="font-mono text-2xl sm:text-3xl font-semibold text-[#25221F]">
                  ${Number(product.original_price || 0).toFixed(2)}
                </span>
                <span className="text-xs font-medium uppercase tracking-wider text-[#77716A]">
                  {product.currency}
                </span>
              </>
            )}
          </div>

          {/* Short Editorial Excerpt */}
          <p className="text-xs sm:text-sm text-[#77716A] leading-relaxed">
            {product.description}
          </p>

          {/* Size Selector */}
          <div className="space-y-2.5 pt-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[11px] uppercase tracking-widest text-[#25221F] font-bold">
                Silhouette / Size:
              </span>
              <button
                type="button"
                onClick={() => setIsSizeGuideOpen(true)}
                className="text-[10px] uppercase tracking-wider text-[#B44238] hover:underline font-semibold"
              >
                Size &amp; Fit Guide &rarr;
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {sizes.map((s) => (
                <button
                  key={s.label}
                  type="button"
                  onClick={() => setSelectedSize(s.label)}
                  className={`text-left p-3 border transition-colors ${
                    selectedSize === s.label
                      ? 'border-[#25221F] bg-[#FAF8F5]'
                      : 'border-[#D8D1C5] bg-[#FFFEFA] hover:border-[#77716A]'
                  }`}
                >
                  <span className="block text-xs font-bold text-[#25221F] uppercase tracking-wider">
                    {s.label}
                  </span>
                  <span className="block text-[9.5px] text-[#77716A] mt-0.5">
                    {s.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Quantity & CTA */}
          <div className="pt-2 space-y-3">
            <div className="flex items-center space-x-3">
              {/* Quantity Counter */}
              <div className="flex items-center border border-[#D8D1C5] bg-[#FFFEFA]">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-9 h-11 flex items-center justify-center text-sm text-[#77716A] hover:text-[#25221F]"
                >
                  &minus;
                </button>
                <span className="w-10 text-center font-mono text-xs font-semibold text-[#25221F]">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-9 h-11 flex items-center justify-center text-sm text-[#77716A] hover:text-[#25221F]"
                >
                  &#43;
                </button>
              </div>

              {/* Primary Acquire Button */}
              <a
                href={product.product_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-[#25221F] text-[#FAF8F5] text-xs font-semibold uppercase tracking-[0.2em] h-11 flex items-center justify-center hover:bg-[#B44238] transition-colors shadow-xs"
              >
                Acquire from {product.brand_name} &rarr;
              </a>
            </div>

            {/* Secondary Wishlist Button */}
            <button
              type="button"
              onClick={toggleWishlist}
              className={`w-full py-2.5 text-xs font-semibold uppercase tracking-[0.18em] border transition-colors flex items-center justify-center space-x-2 ${
                isWishlisted
                  ? 'border-[#B44238] bg-[#F9ECE9] text-[#B44238]'
                  : 'border-[#D8D1C5] text-[#25221F] hover:border-[#25221F] bg-[#FFFEFA]'
              }`}
            >
              <span>{isWishlisted ? '♥ Saved to Wishlist' : '♡ Add to Editorial Wishlist'}</span>
            </button>

            <p className="text-[10px] text-[#888177] text-center tracking-wide">
              Official partner listing. Transactions processed directly through verified {product.brand_name} atelier.
            </p>
          </div>

          {/* Interactive Editorial Tabs */}
          <div className="pt-4 border-t border-[#D8D1C5]/70">
            {/* Tab Navigation */}
            <div className="flex border-b border-[#D8D1C5] text-xs font-semibold uppercase tracking-wider text-[#77716A]">
              <button
                type="button"
                onClick={() => setActiveTab('craft')}
                className={`pb-2.5 mr-6 border-b-2 transition-colors ${
                  activeTab === 'craft'
                    ? 'border-[#25221F] text-[#25221F]'
                    : 'border-transparent hover:text-[#25221F]'
                }`}
              >
                Material &amp; Craft
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('styling')}
                className={`pb-2.5 mr-6 border-b-2 transition-colors ${
                  activeTab === 'styling'
                    ? 'border-[#25221F] text-[#25221F]'
                    : 'border-transparent hover:text-[#25221F]'
                }`}
              >
                Styling Notes
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('dimensions')}
                className={`pb-2.5 mr-6 border-b-2 transition-colors ${
                  activeTab === 'dimensions'
                    ? 'border-[#25221F] text-[#25221F]'
                    : 'border-transparent hover:text-[#25221F]'
                }`}
              >
                Fit &amp; Sizing
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('delivery')}
                className={`pb-2.5 border-b-2 transition-colors ${
                  activeTab === 'delivery'
                    ? 'border-[#25221F] text-[#25221F]'
                    : 'border-transparent hover:text-[#25221F]'
                }`}
              >
                Shipping &amp; Duties
              </button>
            </div>

            {/* Tab Contents */}
            <div className="pt-4 text-xs text-[#77716A] leading-relaxed space-y-2">
              {activeTab === 'craft' && (
                <>
                  <p>
                    Crafted from 100% fine-gauge silk georgette with gentle hand-draped fluid motion.
                    Features hand-applied Austrian Swarovski crystals framing the décolletage and French interior seams for an unblemished finish.
                  </p>
                  <ul className="list-disc pl-4 space-y-1 text-[#25221F] pt-1">
                    <li>100% Premium Mulberry Silk Crepe</li>
                    <li>Hand-embellished crystal neckline</li>
                    <li>Dry clean only; steam gently from reverse</li>
                  </ul>
                </>
              )}

              {activeTab === 'styling' && (
                <>
                  <p>
                    <strong>Daytime Chic:</strong> Style over swimwear with a wide-brim Panama straw hat and tan leather slides for effortless sun-soaked elegance.
                  </p>
                  <p>
                    <strong>Evening Glamour:</strong> Layer with sculptural gold drop earrings, a metallic clutch, and strappy stilettos for seaside twilight dining.
                  </p>
                </>
              )}

              {activeTab === 'dimensions' && (
                <>
                  <p>
                    Cut for a universally flattering, relaxed kaftan silhouette that skims without clinging.
                  </p>
                  <div className="grid grid-cols-2 gap-3 pt-2 text-[#25221F] font-mono text-[11px]">
                    <div>Garment Length: 145 cm</div>
                    <div>Bust Allowance: Up to 130 cm</div>
                    <div>Sleeve Sweep: 58 cm</div>
                    <div>Model Height: 178 cm (Size OS)</div>
                  </div>
                </>
              )}

              {activeTab === 'delivery' && (
                <>
                  <p>
                    Dispatched from Australian designer atelier headquarters with complimentary carbon-neutral shipping on all domestic orders.
                  </p>
                  <p>
                    <strong>Express Australia:</strong> 1-2 business days via Australia Post Express.<br />
                    <strong>International:</strong> 3-5 business days worldwide via DHL Express.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Carousel / Grid */}
      {relatedProducts.length > 0 && (
        <div className="mt-20 pt-10 border-t border-[#D8D1C5]/70">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#B44238] font-bold">
                Atelier Ensemble
              </span>
              <h2 className="font-serif-editorial text-2xl sm:text-3xl text-[#25221F] font-normal mt-1">
                More From The Collection
              </h2>
            </div>
            <Link
              href="/products"
              className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#77716A] hover:text-[#25221F] transition-colors"
            >
              View All Pieces &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((rel) => (
              <div
                key={rel.id}
                className="group flex flex-col justify-between bg-[#FFFEFA] border border-[#D8D1C5]/70 p-4 shadow-xs hover:border-[#25221F] transition-all"
              >
                <Link
                  href={`/products/${rel.slug}`}
                  className="relative block w-full aspect-[3/4] overflow-hidden bg-[#EFEAE0] border border-[#D8D1C5]/30"
                >
                  <Image
                    src={rel.image?.storage_key || '/images/products/azure-resort-kaftan.jpg'}
                    alt={rel.name}
                    fill
                    sizes="25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </Link>

                <div className="pt-3.5 flex flex-col space-y-1 text-center">
                  <span className="text-[9px] uppercase tracking-[0.2em] text-[#77716A]">
                    {rel.brand_name}
                  </span>
                  <Link href={`/products/${rel.slug}`}>
                    <h3 className="font-serif-editorial text-[16px] text-[#25221F] font-normal group-hover:text-[#B44238] transition-colors">
                      {rel.name}
                    </h3>
                  </Link>
                  <div className="pt-1 flex items-center justify-center space-x-2 text-xs font-mono">
                    {rel.original_price && (
                      <span className="text-[#888177] line-through">
                        ${Number(rel.original_price).toFixed(2)}
                      </span>
                    )}
                    {rel.sale_price ? (
                      <span className="text-[#B44238] font-bold">
                        ${Number(rel.sale_price).toFixed(2)}
                      </span>
                    ) : (
                      <span className="text-[#25221F] font-semibold">
                        ${Number(rel.original_price || 0).toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-3 mt-auto">
                  <Link
                    href={`/products/${rel.slug}`}
                    className="w-full block text-center text-[9px] font-semibold uppercase tracking-[0.18em] border border-[#D8D1C5] py-2 hover:border-[#25221F] hover:bg-[#25221F] hover:text-[#FAF8F5] transition-colors"
                  >
                    View Atelier Piece &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Size Guide Modal */}
      {isSizeGuideOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setIsSizeGuideOpen(false)}
        >
          <div
            className="bg-[#FFFEFA] border border-[#D8D1C5] max-w-lg w-full p-6 sm:p-8 relative shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsSizeGuideOpen(false)}
              className="absolute top-4 right-4 text-xl text-[#77716A] hover:text-[#25221F] w-8 h-8 flex items-center justify-center"
            >
              &times;
            </button>

            <span className="text-[10px] uppercase tracking-[0.25em] text-[#B44238] font-bold">
              Atelier Fit Standard
            </span>
            <h3 className="font-serif-editorial text-2xl text-[#25221F] font-normal mt-1 mb-4">
              Size &amp; Measurement Guide
            </h3>

            <p className="text-xs text-[#77716A] mb-4 leading-relaxed">
              KAFTAN garments are designed with generous, flowing resort drape. Measurements reflect maximum body dimensions for each size category.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-[#D8D1C5]">
                <thead className="bg-[#FAF8F5] text-[10px] uppercase font-bold text-[#25221F] border-b border-[#D8D1C5]">
                  <tr>
                    <th className="p-2.5">Size</th>
                    <th className="p-2.5">AU Size</th>
                    <th className="p-2.5">Bust</th>
                    <th className="p-2.5">Length</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D8D1C5]/60 text-[#77716A] font-mono text-[11px]">
                  <tr>
                    <td className="p-2.5 font-sans font-medium text-[#25221F]">One Size (OS)</td>
                    <td className="p-2.5">8 - 18</td>
                    <td className="p-2.5">Up to 130 cm</td>
                    <td className="p-2.5">145 cm</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-sans font-medium text-[#25221F]">XS / S</td>
                    <td className="p-2.5">6 - 10</td>
                    <td className="p-2.5">82 - 92 cm</td>
                    <td className="p-2.5">140 cm</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-sans font-medium text-[#25221F]">M / L</td>
                    <td className="p-2.5">12 - 16</td>
                    <td className="p-2.5">96 - 110 cm</td>
                    <td className="p-2.5">145 cm</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-sans font-medium text-[#25221F]">XL / Oversized</td>
                    <td className="p-2.5">18 - 22</td>
                    <td className="p-2.5">114 - 135 cm</td>
                    <td className="p-2.5">150 cm</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <button
              type="button"
              onClick={() => setIsSizeGuideOpen(false)}
              className="mt-6 w-full text-xs font-semibold uppercase tracking-[0.2em] bg-[#25221F] text-[#FAF8F5] py-2.5 hover:bg-[#B44238] transition-colors"
            >
              Close Guide
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { buildCloudinaryUrl } from '@/lib/cloudinary/url';
import type { PopulatedProduct } from '@/types/models';

interface ProductCatalogViewProps {
  initialProducts: PopulatedProduct[];
  title?: string;
  subtitle?: string;
  kicker?: string;
  defaultOnSaleOnly?: boolean;
}

export function ProductCatalogView({
  initialProducts,
  title = 'The Designer Collection',
  subtitle = 'Curated luxury kaftans, artisanal resortwear, and contemporary Australian statement pieces.',
  kicker = 'Atelier Selection',
  defaultOnSaleOnly = false,
}: ProductCatalogViewProps) {
  const [search, setSearch] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [priceRange, setPriceRange] = useState<'all' | 'under-150' | '150-250' | '250-plus'>('all');
  const [onSaleOnly, setOnSaleOnly] = useState(defaultOnSaleOnly);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'discount'>('featured');
  const [quickViewProduct, setQuickViewProduct] = useState<PopulatedProduct | null>(null);
  const [wishlist, setWishlist] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('kaftan_wishlist');
        return saved ? JSON.parse(saved) : [];
      } catch {
        return [];
      }
    }
    return [];
  });

  const toggleWishlist = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlist((prev) => {
      const updated = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        localStorage.setItem('kaftan_wishlist', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const brands = useMemo(() => {
    const set = new Set(initialProducts.map((p) => p.brand_name));
    return ['all', ...Array.from(set).sort()];
  }, [initialProducts]);

  const filteredProducts = useMemo(() => {
    return initialProducts.filter((product) => {
      // Search
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(q);
        const matchesBrand = product.brand_name.toLowerCase().includes(q);
        const matchesDesc = product.description?.toLowerCase().includes(q) ?? false;
        if (!matchesName && !matchesBrand && !matchesDesc) return false;
      }

      // Brand
      if (selectedBrand !== 'all' && product.brand_name !== selectedBrand) {
        return false;
      }

      // Sale only
      const price = product.sale_price ?? product.original_price ?? 0;
      const isDiscounted = Boolean(
        product.sale_price && product.original_price && product.sale_price < product.original_price
      );
      if (onSaleOnly && !isDiscounted) {
        return false;
      }

      // Price range
      if (priceRange === 'under-150' && price >= 150) return false;
      if (priceRange === '150-250' && (price < 150 || price > 250)) return false;
      if (priceRange === '250-plus' && price <= 250) return false;

      return true;
    }).sort((a, b) => {
      const priceA = a.sale_price ?? a.original_price ?? 0;
      const priceB = b.sale_price ?? b.original_price ?? 0;

      if (sortBy === 'price-asc') return priceA - priceB;
      if (sortBy === 'price-desc') return priceB - priceA;
      if (sortBy === 'discount') {
        const discA = a.original_price && a.sale_price ? (a.original_price - a.sale_price) / a.original_price : 0;
        const discB = b.original_price && b.sale_price ? (b.original_price - b.sale_price) / b.original_price : 0;
        return discB - discA;
      }
      return 0;
    });
  }, [initialProducts, search, selectedBrand, priceRange, onSaleOnly, sortBy]);

  const resetFilters = () => {
    setSearch('');
    setSelectedBrand('all');
    setPriceRange('all');
    setOnSaleOnly(false);
    setSortBy('featured');
  };

  return (
    <div className="w-full">
      {/* Editorial Header */}
      <div className="bg-[#FAF8F5] border-b border-[#D8D1C5]/60 pt-10 pb-8">
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-[10px] uppercase tracking-[0.2em] text-[#77716A] mb-4">
            <Link href="/" className="hover:text-[#25221F] transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-[#25221F] font-semibold">{title}</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#B44238]">
                {kicker}
              </span>
              <h1 className="font-serif-editorial text-3xl sm:text-4xl lg:text-5xl font-normal text-[#25221F] mt-1.5">
                {title}
              </h1>
              <p className="text-xs sm:text-sm text-[#77716A] leading-relaxed mt-2.5 max-w-xl">
                {subtitle}
              </p>
            </div>

            <div className="flex items-center space-x-4 self-start md:self-end">
              <div className="text-right">
                <span className="text-xs uppercase tracking-wider text-[#77716A]">Catalog</span>
                <p className="font-serif-editorial text-xl font-normal text-[#25221F]">
                  {filteredProducts.length} {filteredProducts.length === 1 ? 'Piece' : 'Pieces'}
                </p>
              </div>
              {wishlist.length > 0 && (
                <div className="border-l border-[#D8D1C5] pl-4 text-right">
                  <span className="text-xs uppercase tracking-wider text-[#B44238]">Saved</span>
                  <p className="font-serif-editorial text-xl font-normal text-[#25221F]">
                    ♥ {wishlist.length}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Control & Filter Toolbar */}
      <div className="bg-[#FFFEFA] border-b border-[#D8D1C5]/60 sticky top-0 z-20 shadow-xs">
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-4 space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search pieces, silhouettes, or designers..."
                className="w-full bg-[#FAF8F5] border border-[#D8D1C5] px-3.5 py-2 pl-9 text-xs text-[#25221F] placeholder-[#888177] focus:outline-hidden focus:border-[#25221F] transition-colors"
              />
              <svg
                className="w-4 h-4 text-[#77716A] absolute left-3 top-2.5 pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-2.5 text-xs text-[#77716A] hover:text-[#25221F]"
                >
                  &times;
                </button>
              )}
            </div>

            {/* Quick Filters & Sorting */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Sale Only Toggle */}
              <label className="flex items-center space-x-2 text-xs font-medium text-[#25221F] cursor-pointer bg-[#FAF8F5] px-3 py-2 border border-[#D8D1C5] hover:border-[#25221F] transition-colors">
                <input
                  type="checkbox"
                  checked={onSaleOnly}
                  onChange={(e) => setOnSaleOnly(e.target.checked)}
                  className="accent-[#B44238] rounded-xs"
                />
                <span className="uppercase tracking-wider text-[11px]">On Sale Only</span>
              </label>

              {/* Price Filter */}
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value as typeof priceRange)}
                className="bg-[#FAF8F5] border border-[#D8D1C5] px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-[#25221F] focus:outline-hidden focus:border-[#25221F]"
              >
                <option value="all">All Prices</option>
                <option value="under-150">Under $150</option>
                <option value="150-250">$150 - $250</option>
                <option value="250-plus">$250+</option>
              </select>

              {/* Sort By Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="bg-[#FAF8F5] border border-[#D8D1C5] px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-[#25221F] focus:outline-hidden focus:border-[#25221F]"
              >
                <option value="featured">Featured Order</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="discount">Largest Discount</option>
              </select>

              {/* Clear filters if active */}
              {(search || selectedBrand !== 'all' || priceRange !== 'all' || onSaleOnly || sortBy !== 'featured') && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="text-[10px] uppercase font-bold tracking-wider text-[#B44238] hover:underline px-2"
                >
                  Reset All
                </button>
              )}
            </div>
          </div>

          {/* Designer Brand Filter Pills */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 pt-1 no-scrollbar text-xs">
            <span className="text-[10px] uppercase tracking-widest text-[#77716A] shrink-0 font-medium mr-1">
              Designers:
            </span>
            {brands.map((brand) => (
              <button
                key={brand}
                type="button"
                onClick={() => setSelectedBrand(brand)}
                className={`text-[10px] uppercase tracking-[0.16em] px-3 py-1 shrink-0 transition-colors border ${
                  selectedBrand === brand
                    ? 'bg-[#25221F] text-[#FAF8F5] border-[#25221F]'
                    : 'bg-[#FAF8F5] text-[#77716A] border-[#D8D1C5] hover:border-[#25221F] hover:text-[#25221F]'
                }`}
              >
                {brand === 'all' ? 'All Ateliers' : brand}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Product Catalog Grid */}
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-10">
        {filteredProducts.length === 0 ? (
          <div className="bg-[#FFFEFA] border border-[#D8D1C5] p-12 text-center space-y-4 max-w-md mx-auto my-12">
            <span className="text-3xl block">✦</span>
            <h3 className="font-serif-editorial text-2xl text-[#25221F]">No Pieces Found</h3>
            <p className="text-xs text-[#77716A] leading-relaxed">
              We couldn&apos;t find any pieces matching your specific filter criteria. Try expanding your search or clearing active filters.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="inline-block text-[10px] font-semibold uppercase tracking-[0.2em] bg-[#25221F] text-[#FAF8F5] px-6 py-2.5 hover:bg-[#A94F42] transition-colors mt-2"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-7">
            {filteredProducts.map((product) => {
              const isWishlisted = wishlist.includes(product.id);
              const discountPct =
                product.original_price && product.sale_price && product.original_price > product.sale_price
                  ? Math.round(((product.original_price - product.sale_price) / product.original_price) * 100)
                  : null;

              return (
                <div
                  key={product.id}
                  className="group flex flex-col justify-between bg-[#FFFEFA] border border-[#D8D1C5]/70 p-4 shadow-xs hover:border-[#25221F] transition-all duration-300"
                >
                  {/* Image Container with Actions */}
                  <div className="relative w-full aspect-[3/4] overflow-hidden bg-[#EFEAE0] border border-[#D8D1C5]/30">
                    <Link href={`/products/${product.slug}`} className="block w-full h-full">
                      <Image
                        src={buildCloudinaryUrl(product.image?.storage_key || 'kaftan/products/azure-resort-kaftan', { width: 800 })}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                    </Link>

                    {/* Discount Badge */}
                    {discountPct && (
                      <span className="absolute top-2.5 left-2.5 bg-[#B44238] text-white text-[9.5px] font-mono font-bold px-2 py-0.5 tracking-wider uppercase shadow-xs">
                        {discountPct}% OFF
                      </span>
                    )}

                    {/* Wishlist Button */}
                    <button
                      type="button"
                      onClick={(e) => toggleWishlist(product.id, e)}
                      aria-label="Save to wishlist"
                      className={`absolute top-2.5 right-2.5 w-7 h-7 rounded-full flex items-center justify-center transition-colors shadow-xs ${
                        isWishlisted
                          ? 'bg-[#B44238] text-white'
                          : 'bg-white/80 text-[#25221F] hover:bg-white'
                      }`}
                    >
                      <span className="text-xs leading-none">{isWishlisted ? '♥' : '♡'}</span>
                    </button>

                    {/* Quick View Floating Button */}
                    <button
                      type="button"
                      onClick={() => setQuickViewProduct(product)}
                      className="absolute bottom-2.5 inset-x-2.5 bg-white/95 text-[#25221F] text-[9.5px] font-semibold uppercase tracking-[0.18em] py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-[#25221F] hover:text-white text-center shadow-xs"
                    >
                      Quick Preview
                    </button>
                  </div>

                  {/* Product Metadata */}
                  <div className="pt-4 flex flex-col space-y-1.5 text-center">
                    <span className="text-[9.5px] uppercase tracking-[0.2em] text-[#77716A] font-medium">
                      {product.brand_name}
                    </span>
                    <Link href={`/products/${product.slug}`}>
                      <h3 className="font-serif-editorial text-[18px] text-[#25221F] font-normal leading-snug group-hover:text-[#B44238] transition-colors">
                        {product.name}
                      </h3>
                    </Link>

                    {/* Price Block */}
                    <div className="pt-1 flex items-center justify-center space-x-2 text-[12.5px]">
                      {product.original_price && (
                        <span className="text-[#888177] line-through font-mono text-[11.5px]">
                          ${Number(product.original_price).toFixed(2)}
                        </span>
                      )}
                      {product.sale_price ? (
                        <span className="text-[#B44238] font-bold font-mono">
                          ${Number(product.sale_price).toFixed(2)} {product.currency}
                        </span>
                      ) : (
                        <span className="text-[#25221F] font-semibold font-mono">
                          ${Number(product.original_price || 0).toFixed(2)} {product.currency}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* CTA Actions */}
                  <div className="pt-4 mt-auto grid grid-cols-2 gap-2">
                    <Link
                      href={`/products/${product.slug}`}
                      className="block text-center text-[9.5px] font-semibold uppercase tracking-[0.16em] text-[#25221F] border border-[#D8D1C5] py-2 hover:border-[#25221F] transition-colors"
                    >
                      View Piece
                    </Link>
                    <a
                      href={product.product_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-center text-[9.5px] font-semibold uppercase tracking-[0.16em] bg-[#25221F] text-[#FAF8F5] py-2 hover:bg-[#A94F42] transition-colors"
                    >
                      Acquire &rarr;
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setQuickViewProduct(null)}
        >
          <div
            className="bg-[#FFFEFA] border border-[#D8D1C5] max-w-2xl w-full p-6 sm:p-8 relative shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setQuickViewProduct(null)}
              className="absolute top-4 right-4 text-xl text-[#77716A] hover:text-[#25221F] w-8 h-8 flex items-center justify-center"
            >
              &times;
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
              <div className="relative aspect-[3/4] overflow-hidden bg-[#EFEAE0] border border-[#D8D1C5]/50">
                <Image
                  src={buildCloudinaryUrl(quickViewProduct.image?.storage_key || 'kaftan/products/azure-resort-kaftan', { width: 1000 })}
                  alt={quickViewProduct.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="space-y-4">
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#B44238] font-bold">
                  {quickViewProduct.brand_name}
                </span>
                <h2 className="font-serif-editorial text-2xl text-[#25221F] font-normal leading-tight">
                  {quickViewProduct.name}
                </h2>

                <div className="flex items-center space-x-3 text-base font-mono">
                  {quickViewProduct.original_price && (
                    <span className="text-[#888177] line-through">
                      ${Number(quickViewProduct.original_price).toFixed(2)}
                    </span>
                  )}
                  {quickViewProduct.sale_price ? (
                    <span className="text-[#B44238] font-bold">
                      ${Number(quickViewProduct.sale_price).toFixed(2)} {quickViewProduct.currency}
                    </span>
                  ) : (
                    <span className="text-[#25221F] font-semibold">
                      ${Number(quickViewProduct.original_price || 0).toFixed(2)} {quickViewProduct.currency}
                    </span>
                  )}
                </div>

                <p className="text-xs text-[#77716A] leading-relaxed">
                  {quickViewProduct.description}
                </p>

                <div className="pt-2 flex flex-col space-y-2">
                  <Link
                    href={`/products/${quickViewProduct.slug}`}
                    className="w-full block text-center text-xs font-semibold uppercase tracking-[0.18em] border border-[#25221F] py-2.5 text-[#25221F] hover:bg-[#FAF8F5] transition-colors"
                  >
                    View Full Atelier Details &rarr;
                  </Link>
                  <a
                    href={quickViewProduct.product_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full block text-center text-xs font-semibold uppercase tracking-[0.18em] bg-[#25221F] text-white py-2.5 hover:bg-[#B44238] transition-colors"
                  >
                    Acquire from Atelier &rarr;
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

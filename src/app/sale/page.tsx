import type { Metadata } from 'next';
import { getFeaturedProducts } from '@/services/products';
import { ClearanceSaleSection } from '@/components/homepage/ClearanceSaleSection';

export const metadata: Metadata = {
  title: 'Clearance Sale & Promotional Listings | KAFTAN',
  description: 'Curated editorial sale items, designer promotions, and luxury kaftans at exclusive clearance prices.',
};

export default async function SalePage() {
  const products = await getFeaturedProducts(12);

  return (
    <div className="w-full py-8">
      <div className="w-full px-4 sm:px-5 lg:px-6 mb-6">
        <div className="bg-[#EFEAE0] border border-[#D8D1C5] p-6 text-center space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#B44238]">
            Editorial Selection
          </span>
          <h1 className="font-serif-editorial text-3xl sm:text-4xl font-normal text-[#25221F]">
            Seasonal Clearance &amp; Promotional Archive
          </h1>
          <p className="text-xs text-[#77716A] max-w-lg mx-auto leading-relaxed">
            Lightweight editorial and partner listings. Links connect directly to verified partner brand ateliers.
          </p>
        </div>
      </div>

      <ClearanceSaleSection products={products} />
    </div>
  );
}

import type { Metadata } from 'next';
import { getAllProducts } from '@/services/products';
import { ProductCatalogView } from '@/components/products/ProductCatalogView';

export const metadata: Metadata = {
  title: 'Seasonal Clearance & Promotional Archive | KAFTAN Australia',
  description: 'Curated editorial sale items, designer promotions, and luxury kaftans at exclusive clearance prices.',
};

export default async function SalePage() {
  const products = await getAllProducts({ onSale: true });

  return (
    <main className="min-h-screen bg-[#FAF8F5]">
      <ProductCatalogView
        initialProducts={products}
        title="Seasonal Clearance Archive"
        subtitle="Curated luxury kaftans, artisanal resortwear, and designer promotions at exclusive seasonal clearance pricing."
        kicker="Limited Editorial Sale"
        defaultOnSaleOnly={true}
      />
    </main>
  );
}

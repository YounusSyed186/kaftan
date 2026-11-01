import type { Metadata } from 'next';
import { getAllProducts } from '@/services/products';
import { ProductCatalogView } from '@/components/products/ProductCatalogView';

export const metadata: Metadata = {
  title: 'Curated Designer Kaftans & Resortwear Collection | KAFTAN Australia',
  description: 'Explore the complete curated catalogue of luxury Australian and international designer kaftans, silk evening silhouettes, and artisanal resortwear.',
};

export default async function ProductsPage() {
  const products = await getAllProducts();

  return (
    <main className="min-h-screen bg-[#FAF8F5]">
      <ProductCatalogView
        initialProducts={products}
        title="The Designer Collection"
        subtitle="Curated luxury kaftans, artisanal resortwear, and contemporary Australian statement pieces from premier fashion ateliers."
        kicker="Editorial Selection"
      />
    </main>
  );
}

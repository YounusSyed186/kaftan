import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getProductBySlug, getFeaturedProducts, getRelatedProducts } from '@/services/products';
import { ProductDetailInteractive } from '@/components/products/ProductDetailInteractive';

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const products = await getFeaturedProducts(10);
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return { title: 'Product Not Found | KAFTAN Australia' };
  }

  return {
    title: `${product.name} by ${product.brand_name} | KAFTAN Australia Editorial`,
    description: product.description || undefined,
  };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(slug, 4);

  return (
    <main className="min-h-screen bg-[#FAF8F5]">
      {/* Top Breadcrumb Navigation */}
      <div className="border-b border-[#D8D1C5]/60 bg-[#FFFEFA]">
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-3.5">
          <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-[10.5px] uppercase tracking-[0.2em] text-[#77716A]">
            <Link href="/" className="hover:text-[#25221F] transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/products" className="hover:text-[#25221F] transition-colors">
              Collection
            </Link>
            <span>/</span>
            <span className="text-[#77716A]">{product.brand_name}</span>
            <span>/</span>
            <span className="text-[#25221F] font-semibold truncate max-w-[200px] sm:max-w-none">
              {product.name}
            </span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-8 md:py-12">
        <ProductDetailInteractive product={product} relatedProducts={relatedProducts} />
      </div>
    </main>
  );
}

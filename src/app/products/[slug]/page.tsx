import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getProductBySlug, getFeaturedProducts } from '@/services/products';
import { EditorialImage } from '@/components/media/EditorialImage';

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
    return { title: 'Product Not Found | KAFTAN' };
  }

  return {
    title: `${product.name} by ${product.brand_name} | KAFTAN Editorial`,
    description: product.description || undefined,
  };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 py-16">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
        {/* Product Image */}
        <div className="md:col-span-6 aspect-[3/4] bg-[#EFEAE0] overflow-hidden border border-[#D8D1C5]">
          <EditorialImage
            media={product.image}
            src={product.image?.storage_key}
            alt={product.name}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Product Details */}
        <div className="md:col-span-6 flex flex-col space-y-6">
          <span className="text-xs uppercase tracking-[0.25em] text-[#77716A]">
            {product.brand_name}
          </span>

          <h1 className="font-serif-editorial text-3xl sm:text-4xl lg:text-5xl font-normal text-[#25221F]">
            {product.name}
          </h1>

          <div className="flex items-center space-x-3 text-lg font-mono">
            {product.original_price && (
              <span className="text-[#77716A] line-through">
                ${Number(product.original_price).toFixed(2)}
              </span>
            )}
            {product.sale_price ? (
              <span className="text-[#B44238] font-bold">
                ${Number(product.sale_price).toFixed(2)} {product.currency}
              </span>
            ) : (
              <span className="text-[#25221F] font-semibold">
                ${Number(product.original_price || 0).toFixed(2)} {product.currency}
              </span>
            )}
          </div>

          <p className="text-sm text-[#77716A] leading-relaxed pt-2">
            {product.description}
          </p>

          <div className="pt-6 border-t border-[#D8D1C5]">
            <a
              href={product.product_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center text-xs font-semibold uppercase tracking-[0.2em] bg-[#25221F] text-[#F7F4ED] px-8 py-3.5 hover:bg-[#A94F42] transition-colors"
            >
              Shop At {product.brand_name} &rarr;
            </a>
            <p className="text-[10px] text-[#77716A] mt-2 tracking-wide">
              * External link. You will be redirected to the designer or partner atelier website.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

import type { MetadataRoute } from 'next';
import { getAllPublishedArticles } from '@/services/articles';
import { getFeaturedProducts } from '@/services/products';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://kaftan.fashion';
  const articles = await getAllPublishedArticles();
  const products = await getFeaturedProducts(50);

  const staticRoutes: MetadataRoute.Sitemap = [
    '',
    '/latest',
    '/trends',
    '/style',
    '/designers',
    '/travel',
    '/lifestyle',
    '/beauty',
    '/sale',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: route === '' ? 1.0 : 0.8,
  }));

  const articleRoutes: MetadataRoute.Sitemap = articles.map((art) => ({
    url: `${baseUrl}/stories/${art.slug}`,
    lastModified: art.updated_at ? new Date(art.updated_at) : new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  const productRoutes: MetadataRoute.Sitemap = products.map((prod) => ({
    url: `${baseUrl}/products/${prod.slug}`,
    lastModified: prod.updated_at ? new Date(prod.updated_at) : new Date(),
    changeFrequency: 'weekly',
    priority: 0.6,
  }));

  return [...staticRoutes, ...articleRoutes, ...productRoutes];
}

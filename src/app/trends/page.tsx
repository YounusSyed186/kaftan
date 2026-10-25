import type { Metadata } from 'next';
import { getAllPublishedArticles } from '@/services/articles';
import { EditorialListing } from '@/components/editorial/EditorialListing';

export const metadata: Metadata = {
  title: 'Fashion Trends & Forecasts | KAFTAN',
  description: 'Seasonal silhouettes, textile directions, and colour palettes defining modern Australian resort and everyday style.',
};

export default async function TrendsPage() {
  const articles = await getAllPublishedArticles();
  const trendArticles = articles.filter(
    (a) => a.article_type === 'trend_report' || a.article_type === 'fashion_editorial'
  );

  return (
    <EditorialListing
      title="Trends & Forecasts"
      subtitle="Analyses of key silhouettes, runway evolutions, and the mood of modern dressing."
      articles={trendArticles.length > 0 ? trendArticles : articles}
    />
  );
}

import type { Metadata } from 'next';
import { getAllPublishedArticles } from '@/services/articles';
import { EditorialListing } from '@/components/editorial/EditorialListing';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Search Publication | KAFTAN',
  description: 'Search fashion stories, designer interviews, trend reports, and style guides.',
};

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const allArticles = await getAllPublishedArticles();

  const query = q?.trim().toLowerCase() || '';
  const filtered = query
    ? allArticles.filter(
        (art) =>
          art.title.toLowerCase().includes(query) ||
          (art.excerpt && art.excerpt.toLowerCase().includes(query)) ||
          art.article_type.toLowerCase().includes(query)
      )
    : allArticles;

  return (
    <EditorialListing
      title={query ? `Search: "${query}"` : 'Search Publication'}
      subtitle={
        query
          ? `Found ${filtered.length} stories matching your query.`
          : 'Browse all published fashion stories and features.'
      }
      articles={filtered}
    />
  );
}

import type { Metadata } from 'next';
import { getAllPublishedArticles } from '@/services/articles';
import { EditorialListing } from '@/components/editorial/EditorialListing';

export const metadata: Metadata = {
  title: 'The Latest Fashion Stories & Reports | KAFTAN',
  description: 'The latest news, runway dispatch, designer spotlights, and fashion editorials from Australia and beyond.',
};

export default async function LatestPage() {
  const articles = await getAllPublishedArticles();

  return (
    <EditorialListing
      title="The Latest Stories"
      subtitle="Fresh runway dispatches, style essays, designer profiles, and seasonal trend forecasts."
      articles={articles}
    />
  );
}

import type { Metadata } from 'next';
import { getAllPublishedArticles } from '@/services/articles';
import { EditorialListing } from '@/components/editorial/EditorialListing';

export const metadata: Metadata = {
  title: 'Travel & Destination Boutiques | KAFTAN',
  description: 'Curated shopping itineraries, luxury coastal destinations, and boutique recommendations.',
};

export default async function TravelPage() {
  const articles = await getAllPublishedArticles();

  return (
    <EditorialListing
      title="Travel & Boutiques"
      subtitle="The finest coastal destinations, boutique itineraries, and lifestyle escapes."
      articles={articles}
    />
  );
}

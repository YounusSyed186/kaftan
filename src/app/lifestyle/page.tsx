import type { Metadata } from 'next';
import { getAllPublishedArticles } from '@/services/articles';
import { EditorialListing } from '@/components/editorial/EditorialListing';

export const metadata: Metadata = {
  title: 'Lifestyle, Art & Sustainability | KAFTAN',
  description: 'Conscious living, sustainable fashion, interior aesthetics, and culture.',
};

export default async function LifestylePage() {
  const articles = await getAllPublishedArticles();

  return (
    <EditorialListing
      title="Lifestyle & Culture"
      subtitle="Conscious design, art, living well, and sustainable luxury."
      articles={articles}
    />
  );
}

import type { Metadata } from 'next';
import { getAllPublishedArticles } from '@/services/articles';
import { EditorialListing } from '@/components/editorial/EditorialListing';

export const metadata: Metadata = {
  title: 'Beauty & Wellness | KAFTAN',
  description: 'Clean skincare, botanical fragrances, and effortless beauty rituals for the sun-kissed season.',
};

export default async function BeautyPage() {
  const articles = await getAllPublishedArticles();

  return (
    <EditorialListing
      title="Beauty & Wellness"
      subtitle="Restorative skincare, solar protection, and natural beauty rituals."
      articles={articles}
    />
  );
}

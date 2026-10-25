import type { Metadata } from 'next';
import { getAllPublishedArticles } from '@/services/articles';
import { EditorialListing } from '@/components/editorial/EditorialListing';

export const metadata: Metadata = {
  title: 'Style Guides & Wardrobe Curation | KAFTAN',
  description: 'Practical style guides, investment pieces, and capsule wardrobe advice for the modern woman.',
};

export default async function StylePage() {
  const articles = await getAllPublishedArticles();
  const styleArticles = articles.filter((a) => a.article_type === 'style_guide');

  return (
    <EditorialListing
      title="Style Guides"
      subtitle="Intentional dressing, wardrobe architecture, and effortless styling formulas."
      articles={styleArticles.length > 0 ? styleArticles : articles}
    />
  );
}

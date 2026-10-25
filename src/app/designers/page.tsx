import type { Metadata } from 'next';
import { getAllPublishedArticles } from '@/services/articles';
import { EditorialListing } from '@/components/editorial/EditorialListing';

export const metadata: Metadata = {
  title: 'Visionary Fashion Designers & Ateliers | KAFTAN',
  description: 'Interviews and spotlights with Australian and international designers shaping contemporary luxury fashion.',
};

export default async function DesignersPage() {
  const articles = await getAllPublishedArticles();
  const designerArticles = articles.filter(
    (a) => a.article_type === 'designer_profile' || a.article_type === 'interview'
  );

  return (
    <EditorialListing
      title="Designers & Ateliers"
      subtitle="Visionaries, master craftspeople, and emergent labels redefining modern silhouettes."
      articles={designerArticles.length > 0 ? designerArticles : articles}
    />
  );
}

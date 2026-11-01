import { getHomepageSections } from '@/services/homepage';
import { getAllPublishedArticles } from '@/services/articles';
import { getFeaturedProducts } from '@/services/products';
import { getActiveCompetition } from '@/services/competitions';
import { HomepageStudioWorkspace } from '@/components/admin/homepage-studio/HomepageStudioWorkspace';

export const metadata = {
  title: 'Homepage Studio | KAFTAN CMS',
  description: 'Interactive visual homepage editor and editorial curation studio for KAFTAN publication.',
};

export default async function HomepageStudioPage() {
  const [sections, allArticles, allProducts, activeCompetition] = await Promise.all([
    getHomepageSections(),
    getAllPublishedArticles(),
    getFeaturedProducts(20),
    getActiveCompetition(),
  ]);

  return (
    <HomepageStudioWorkspace
      initialSections={sections}
      allArticles={allArticles}
      allProducts={allProducts}
      activeCompetition={activeCompetition}
    />
  );
}


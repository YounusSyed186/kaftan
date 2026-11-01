import type { Metadata } from 'next';
import { getAllPublishedArticles } from '@/services/articles';
import { getAllProducts } from '@/services/products';
import { getHomepageSections } from '@/services/homepage';
import { getActiveCompetition, getAllCompetitions } from '@/services/competitions';
import { getEligibleAdCreative } from '@/services/advertising';
import {
  FALLBACK_ARTICLES,
  FALLBACK_PRODUCTS,
  FALLBACK_COMPETITION,
  FALLBACK_AD_CREATIVE,
} from '@/lib/supabase/fallback-data';
import { AdminDashboardClient } from '@/components/admin/AdminDashboardClient';

export const metadata: Metadata = {
  title: 'KAFTAN CMS — Editorial Publishing & Commerce Administration',
  description: 'Editorial management system for KAFTAN publication, luxury catalog, homepage sequence, and commercial partnerships.',
};

export default async function AdminDashboardPage() {
  const [articles, products, sections, competition, allCompetitions, adCreative] = await Promise.all([
    getAllPublishedArticles(),
    getAllProducts(),
    getHomepageSections(),
    getActiveCompetition(),
    getAllCompetitions(),
    getEligibleAdCreative(),
  ]);

  return (
    <AdminDashboardClient
      initialArticles={articles && articles.length > 0 ? articles : FALLBACK_ARTICLES}
      initialProducts={products && products.length > 0 ? products : FALLBACK_PRODUCTS}
      initialSections={sections}
      initialCompetition={competition || (allCompetitions && allCompetitions[0]) || FALLBACK_COMPETITION}
      initialCompetitions={allCompetitions && allCompetitions.length > 0 ? allCompetitions : [FALLBACK_COMPETITION]}
      initialAdCreative={adCreative || FALLBACK_AD_CREATIVE}
    />
  );
}

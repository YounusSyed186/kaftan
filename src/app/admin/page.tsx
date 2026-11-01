import type { Metadata } from 'next';
import { FALLBACK_ARTICLES, FALLBACK_COMPETITION, FALLBACK_AD_CREATIVE } from '@/lib/supabase/fallback-data';
import { getAllProducts } from '@/services/products';
import { getHomepageSections } from '@/services/homepage';
import { AdminDashboardClient } from '@/components/admin/AdminDashboardClient';

export const metadata: Metadata = {
  title: 'KAFTAN CMS — Editorial Publishing & Commerce Administration',
  description: 'Editorial management system for KAFTAN publication, luxury catalog, homepage sequence, and commercial partnerships.',
};

export default async function AdminDashboardPage() {
  const [products, sections] = await Promise.all([
    getAllProducts(),
    getHomepageSections(),
  ]);

  return (
    <AdminDashboardClient
      initialArticles={FALLBACK_ARTICLES}
      initialProducts={products}
      initialSections={sections}
      initialCompetition={FALLBACK_COMPETITION}
      initialAdCreative={FALLBACK_AD_CREATIVE}
    />
  );
}

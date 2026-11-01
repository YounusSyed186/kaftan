import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getActiveCompetition } from '@/services/competitions';
import { CompetitionPageClient } from '@/components/competitions/CompetitionPageClient';

export const metadata: Metadata = {
  title: 'Competitions & Luxury Giveaways — KAFTAN Australia',
  description:
    'Enter exclusive luxury fashion giveaways from KAFTAN Australia in partnership with leading Australian resortwear designers.',
  openGraph: {
    title: 'Win a Luxury Silk Kaftan — KAFTAN Australia',
    description:
      'Enter the official KAFTAN Australia giveaway for a chance to win an exclusive silk kaftan from Fashion Spectrum.',
  },
};

export default async function CompetitionsPage() {
  const competition = await getActiveCompetition();

  if (!competition) {
    notFound();
  }

  return <CompetitionPageClient competition={competition} />;
}


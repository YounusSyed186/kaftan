import { getHomepageSections } from '@/services/homepage';
import { getAllPublishedArticles } from '@/services/articles';
import { getActiveCompetition } from '@/services/competitions';
import { SectionRenderer } from '@/components/homepage/SectionRenderer';


export default async function HomePage() {
  const [sections, allArticles, activeCompetition] = await Promise.all([
    getHomepageSections(),
    getAllPublishedArticles(),
    getActiveCompetition(),
  ]);

  return (
    <div className="w-full flex flex-col">
      {sections.map((section) => (
        <SectionRenderer
          key={section.id}
          section={section}
          allArticles={allArticles}
          activeCompetition={activeCompetition}
        />
      ))}
    </div>
  );
}

import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getArticleBySlug, getLatestArticles } from '@/services/articles';
import { EditorialImage } from '@/components/media/EditorialImage';

interface StoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const articles = await getLatestArticles(20);
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: StoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return {
      title: 'Story Not Found | KAFTAN',
    };
  }

  return {
    title: `${article.seo_title || article.title} | KAFTAN`,
    description: article.seo_description || article.excerpt || undefined,
    alternates: {
      canonical: article.canonical_url || undefined,
    },
    openGraph: {
      title: article.title,
      description: article.excerpt || undefined,
      type: 'article',
      publishedTime: article.published_at || undefined,
      authors: article.author?.name ? [article.author.name] : undefined,
    },
  };
}

export default async function StoryDetailPage({ params }: StoryPageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const relatedStories = await getLatestArticles(4);

  return (
    <article className="w-full max-w-[1000px] mx-auto px-4 sm:px-6 py-12">
      {/* Category / Type Header */}
      <div className="flex flex-col items-center text-center space-y-4 max-w-2xl mx-auto">
        <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#A94F42]">
          {article.article_type.replace('_', ' ')}
        </span>

        <h1 className="font-serif-editorial text-4xl sm:text-5xl md:text-6xl font-normal leading-[1.08] text-[#25221F]">
          {article.title}
        </h1>

        {article.excerpt && (
          <p className="text-base sm:text-lg text-[#77716A] leading-relaxed pt-2">
            {article.excerpt}
          </p>
        )}

        {/* Attribution Row */}
        <div className="pt-4 flex items-center space-x-4 text-xs text-[#77716A] uppercase tracking-wider border-t border-[#D8D1C5] w-full justify-center">
          {article.author && (
            <span>
              Words by <span className="text-[#25221F] font-semibold">{article.author.name}</span>
            </span>
          )}
          <span>•</span>
          <span>
            {article.published_at
              ? new Date(article.published_at).toLocaleDateString('en-AU', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })
              : 'October 2026'}
          </span>
        </div>

        {/* Sponsor Disclosure if Sponsored */}
        {article.content_type === 'sponsored' && (
          <div className="w-full bg-[#EFEAE0] border border-[#D8D1C5] p-3 text-xs text-[#77716A] text-left">
            <span className="font-semibold text-[#A94F42] uppercase tracking-wider text-[10px] block">
              Sponsored Editorial Disclosure
            </span>
            <span>
              This editorial feature is brought to you in partnership with {article.sponsor?.name || 'our brand partner'}.
            </span>
          </div>
        )}
      </div>

      {/* Featured Lead Image */}
      {article.featured_image && (
        <div className="my-10 w-full aspect-[16/10] overflow-hidden bg-[#EFEAE0]">
          <EditorialImage
            media={article.featured_image}
            src={article.featured_image.storage_key}
            alt={article.title}
            fill
            priority
            caption={article.featured_image.caption || undefined}
            credit={article.featured_image.credit || undefined}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Article Body */}
      <div className="max-w-[720px] mx-auto py-8 text-[#25221F] font-sans space-y-6 text-base sm:text-lg leading-relaxed">
        {Array.isArray(article.body) && article.body.length > 0 ? (
          article.body.map((block: unknown, idx: number) => {
            if (
              typeof block === 'object' &&
              block !== null &&
              'type' in block &&
              (block as { type: string }).type === 'paragraph' &&
              'content' in block
            ) {
              return <p key={idx}>{String((block as { content: string }).content)}</p>;
            }
            return null;
          })
        ) : (
          <>
            <p>
              As seasonal light shifts across the Australian coastline, modern elegance reasserts itself through clean architectural tailoring and tactile natural fibres. What distinguishes this moment is an unwavering commitment to proportion over ornament.
            </p>
            <p>
              From sun-bleached linen trench coats to fluid silk dresses that move effortlessly between beachfront terrace dining and evening galas, designers are leaning into clothes that celebrate ease without sacrificing refinement.
            </p>
          </>
        )}
      </div>

      {/* Related Stories */}
      <div className="mt-20 pt-12 border-t border-[#D8D1C5]">
        <h3 className="text-xs font-bold uppercase tracking-[0.25em] text-[#25221F] mb-8">
          More from KAFTAN —
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {relatedStories.map((story) => (
            <Link
              key={story.id}
              href={`/stories/${story.slug}`}
              className="group flex flex-col space-y-2.5"
            >
              <div className="w-full aspect-[4/3] overflow-hidden bg-[#EFEAE0]">
                <EditorialImage
                  media={story.featured_image}
                  src={story.featured_image?.storage_key}
                  alt={story.title}
                  fill
                  sizes="240px"
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#77716A]">
                {story.article_type.replace('_', ' ')}
              </span>
              <h4 className="font-serif-editorial text-base leading-snug text-[#25221F] group-hover:text-[#A94F42] transition-colors line-clamp-2">
                {story.title}
              </h4>
            </Link>
          ))}
        </div>
      </div>
    </article>
  );
}

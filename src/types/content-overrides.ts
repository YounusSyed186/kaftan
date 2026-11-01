import type { MediaAssetRow, PopulatedArticle } from '@/types/models';

export interface MediaReferenceOverride {
  asset_id?: string;
  storage_key: string;
  alt_text?: string;
  focal_point?: { x: number; y: number };
  credit?: string;
  original_filename?: string;
}

export interface FieldOverride<T = unknown> {
  enabled: boolean;
  value: T;
}

export interface ItemContentOverrides {
  title?: FieldOverride<string>;
  subtitle?: FieldOverride<string>;
  excerpt?: FieldOverride<string>;
  description?: FieldOverride<string>;
  kicker?: FieldOverride<string>;
  cta_label?: FieldOverride<string>;
  cta_url?: FieldOverride<string>;
  image?: FieldOverride<MediaReferenceOverride>;
  mobile_image?: FieldOverride<MediaReferenceOverride>;
}

export interface HeroSectionSettings {
  eyebrow?: string;
  heading_override?: string;
  description_override?: string;
  cta_label?: string;
  cta_url?: string;
  desktop_hero_image?: MediaReferenceOverride;
  mobile_hero_image?: MediaReferenceOverride;
  desktop_focal_point?: { x: number; y: number };
  mobile_focal_point?: { x: number; y: number };
  hero_alt_text?: string;
  show_latest_sidebar?: boolean;
  latest_article_ids?: string[];
  latest_title_overrides?: Record<string, string>;
}

export interface FeaturedGridSettings {
  heading?: string;
  subtitle?: string;
  view_all_label?: string;
  view_all_url?: string;
  layout?: string;
}

export interface SponsoredAdSettings {
  sponsored_badge?: string;
  sponsored_title?: string;
  sponsored_excerpt?: string;
  sponsored_image?: MediaReferenceOverride;
  sponsored_mobile_image?: MediaReferenceOverride;
  sponsored_cta_label?: string;
  sponsored_cta_url?: string;
  ad_sponsor_name?: string;
  ad_headline?: string;
  ad_copy?: string;
  ad_destination_url?: string;
  ad_desktop_image?: MediaReferenceOverride;
  ad_mobile_image?: MediaReferenceOverride;
  ad_cta_label?: string;
}

export interface ClearanceSaleSettings {
  clearance_title?: string;
  clearance_subtitle?: string;
  clearance_view_all_label?: string;
  clearance_view_all_url?: string;
}

export interface CompetitionBannerSettings {
  badge_text?: string;
  competition_title?: string;
  competition_description?: string;
  cta_label?: string;
  cta_url?: string;
  banner_image?: MediaReferenceOverride;
  mobile_banner_image?: MediaReferenceOverride;
}

export interface MoreStoriesSettings {
  more_stories_title?: string;
  more_stories_view_all_label?: string;
  more_stories_view_all_url?: string;
  columns?: number;
}

export type SectionCustomSettings = HeroSectionSettings &
  FeaturedGridSettings &
  SponsoredAdSettings &
  ClearanceSaleSettings &
  CompetitionBannerSettings &
  MoreStoriesSettings & {
    item_overrides?: Record<string, ItemContentOverrides>;
  };

export interface EffectiveValueResult<T> {
  value: T;
  isOverridden: boolean;
  source: 'inherited' | 'override' | 'section';
  originalValue: T;
}

/**
 * Computes effective value following the source-aware model:
 * effectiveValue = (override?.enabled && override?.value !== undefined) ? override.value : sourceRecord.field
 */
export function getEffectiveValue<T>(
  override: FieldOverride<T> | undefined | null,
  inheritedValue: T,
  sectionValueFallback?: T
): EffectiveValueResult<T> {
  if (override && override.enabled && override.value !== undefined && override.value !== null && override.value !== '') {
    return {
      value: override.value,
      isOverridden: true,
      source: 'override',
      originalValue: inheritedValue,
    };
  }

  if (inheritedValue !== undefined && inheritedValue !== null && inheritedValue !== '') {
    return {
      value: inheritedValue,
      isOverridden: false,
      source: 'inherited',
      originalValue: inheritedValue,
    };
  }

  const fallback = sectionValueFallback !== undefined ? sectionValueFallback : inheritedValue;
  return {
    value: fallback,
    isOverridden: false,
    source: 'section',
    originalValue: inheritedValue,
  };
}

/**
 * Resolves effective article item data taking item-level overrides into account
 */
export function resolveItemData(
  article: PopulatedArticle | null | undefined,
  overrides?: ItemContentOverrides | null
) {
  if (!article) {
    const isImageOverridden = Boolean(overrides?.image?.enabled && overrides.image.value.storage_key);
    const isMobileImageOverridden = Boolean(overrides?.mobile_image?.enabled && overrides.mobile_image.value.storage_key);
    const imageStorageKey = isImageOverridden ? overrides!.image!.value.storage_key : '';
    const mobileImageStorageKey = isMobileImageOverridden
      ? overrides!.mobile_image!.value.storage_key
      : imageStorageKey;

    return {
      title: overrides?.title?.enabled ? overrides.title.value : 'Untitled Story',
      excerpt: overrides?.excerpt?.enabled ? overrides.excerpt.value : '',
      kicker: overrides?.kicker?.enabled ? overrides.kicker.value : 'EDITORIAL',
      imageStorageKey,
      imageFocalPoint: isImageOverridden ? overrides!.image!.value.focal_point : undefined,
      imageAlt: isImageOverridden ? overrides!.image!.value.alt_text : undefined,
      mobileImageStorageKey,
      mobileImageFocalPoint: isMobileImageOverridden
        ? overrides!.mobile_image!.value.focal_point
        : isImageOverridden
        ? overrides!.image!.value.focal_point
        : undefined,
      mobileImageAlt: isMobileImageOverridden
        ? overrides!.mobile_image!.value.alt_text
        : isImageOverridden
        ? overrides!.image!.value.alt_text
        : undefined,
      ctaLabel: overrides?.cta_label?.enabled ? overrides.cta_label.value : 'READ STORY',
      ctaUrl: overrides?.cta_url?.enabled ? overrides.cta_url.value : '#',
      isTitleOverridden: Boolean(overrides?.title?.enabled),
      isExcerptOverridden: Boolean(overrides?.excerpt?.enabled),
      isImageOverridden,
      isMobileImageOverridden,
    };
  }

  const defaultKicker = article.article_type.toUpperCase().replace('_', ' ');
  const defaultImage = article.featured_image?.storage_key || '';

  const titleResult = getEffectiveValue(overrides?.title, article.title);
  const excerptResult = getEffectiveValue(overrides?.excerpt, article.excerpt || '');
  const kickerResult = getEffectiveValue(overrides?.kicker, defaultKicker);
  const ctaLabelResult = getEffectiveValue(overrides?.cta_label, 'READ STORY');
  const ctaUrlResult = getEffectiveValue(overrides?.cta_url, `/stories/${article.slug}`);

  const isImageOverridden = Boolean(overrides?.image?.enabled && overrides.image.value.storage_key);
  const imageStorageKey = isImageOverridden
    ? overrides!.image!.value.storage_key
    : defaultImage;
  const imageFocalPoint = isImageOverridden
    ? overrides!.image!.value.focal_point
    : undefined;
  const imageAlt = isImageOverridden
    ? overrides!.image!.value.alt_text || article.title
    : article.featured_image?.alt_text || article.title;

  const isMobileImageOverridden = Boolean(
    overrides?.mobile_image?.enabled && overrides.mobile_image.value.storage_key
  );
  const mobileImageStorageKey = isMobileImageOverridden
    ? overrides!.mobile_image!.value.storage_key
    : imageStorageKey;
  const mobileImageFocalPoint = isMobileImageOverridden
    ? overrides!.mobile_image!.value.focal_point
    : imageFocalPoint;
  const mobileImageAlt = isMobileImageOverridden
    ? overrides!.mobile_image!.value.alt_text || imageAlt
    : imageAlt;

  return {
    title: titleResult.value,
    excerpt: excerptResult.value,
    kicker: kickerResult.value,
    imageStorageKey,
    imageFocalPoint,
    imageAlt,
    mobileImageStorageKey,
    mobileImageFocalPoint,
    mobileImageAlt,
    ctaLabel: ctaLabelResult.value,
    ctaUrl: ctaUrlResult.value,
    isTitleOverridden: titleResult.isOverridden,
    isExcerptOverridden: excerptResult.isOverridden,
    isImageOverridden,
    isMobileImageOverridden,
  };
}


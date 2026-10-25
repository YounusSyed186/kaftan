import React from 'react';
import Image from 'next/image';
import { buildCloudinaryUrl } from '@/lib/cloudinary/url';
import type { MediaAssetRow } from '@/types/models';

interface EditorialImageProps {
  media?: MediaAssetRow | null;
  src?: string;
  alt?: string;
  width?: number;
  height?: number;
  aspectRatio?: 'square' | 'portrait' | 'landscape' | 'wide' | 'auto';
  fill?: boolean;
  priority?: boolean;
  className?: string;
  imageClassName?: string;
  caption?: string;
  credit?: string;
  fitMode?: 'cover' | 'contain';
  focalPoint?: { x: number; y: number };
  sizes?: string;
  disableZoom?: boolean;
  showCaption?: boolean;
}

export function EditorialImage({
  media,
  src,
  alt,
  width,
  height,
  aspectRatio = 'auto',
  fill = false,
  priority = false,
  className = '',
  imageClassName = '',
  caption,
  credit,
  fitMode = 'cover',
  focalPoint,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  disableZoom = false,
  showCaption = false,
}: EditorialImageProps) {
  const imageSrc = src || media?.storage_key || '';
  const imageAlt = alt || media?.alt_text || 'KAFTAN Editorial Photography';
  const imageCaption = caption || media?.caption;
  const imageCredit = credit || media?.credit;

  if (!imageSrc) {
    return (
      <div
        className={`bg-[#EFEAE0] flex items-center justify-center text-[#77716A] text-xs uppercase tracking-wider ${className}`}
        style={{ minHeight: '120px' }}
      >
        <span>Image Unavailable</span>
      </div>
    );
  }

  // Calculate focal point style
  const objectPositionStyle = focalPoint
    ? `${focalPoint.x * 100}% ${focalPoint.y * 100}%`
    : 'center';

  const optimizedSrc = buildCloudinaryUrl(imageSrc, {
    width: width || (fill ? 2400 : 800),
    height: height,
    crop: fitMode === 'cover' ? 'fill' : 'fit',
  });

  const aspectClass =
    aspectRatio === 'square'
      ? 'aspect-square'
      : aspectRatio === 'portrait'
      ? 'aspect-[3/4]'
      : aspectRatio === 'landscape'
      ? 'aspect-[4/3]'
      : aspectRatio === 'wide'
      ? 'aspect-[16/9]'
      : '';

  const imgContent = fill ? (
    <div className={`relative w-full h-full overflow-hidden ${aspectClass}`}>
      <Image
        src={optimizedSrc}
        alt={imageAlt}
        fill
        sizes={sizes}
        priority={priority}
        className={`${disableZoom ? '' : 'transition-transform duration-500 hover:scale-105'} ${
          fitMode === 'contain' ? 'object-contain' : 'object-cover'
        } ${imageClassName}`}
        style={{ objectPosition: objectPositionStyle }}
      />
    </div>
  ) : (
    <div className={`relative overflow-hidden ${aspectClass}`}>
      <Image
        src={optimizedSrc}
        alt={imageAlt}
        width={width || 800}
        height={height || 600}
        sizes={sizes}
        priority={priority}
        className={`w-full h-auto ${disableZoom ? '' : 'transition-transform duration-500 hover:scale-105'} ${
          fitMode === 'contain' ? 'object-contain' : 'object-cover'
        } ${imageClassName}`}
        style={{ objectPosition: objectPositionStyle }}
      />
    </div>
  );

  if (showCaption && (imageCaption || imageCredit)) {
    return (
      <figure className={`flex flex-col ${className}`}>
        {imgContent}
        <figcaption className="mt-2 text-xs text-[#77716A] flex justify-between tracking-wide">
          {imageCaption && <span>{imageCaption}</span>}
          {imageCredit && <span className="italic ml-auto">{imageCredit}</span>}
        </figcaption>
      </figure>
    );
  }

  return <div className={className}>{imgContent}</div>;
}

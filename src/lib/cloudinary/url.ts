export interface CloudinaryTransformOptions {
  width?: number;
  height?: number;
  crop?: 'fill' | 'fit' | 'limit' | 'thumb' | 'scale';
  quality?: string | number;
  format?: 'auto' | 'webp' | 'avif' | 'jpg' | 'png';
  gravity?: 'auto' | 'face' | 'center';
  focalPoint?: { x: number; y: number };
}

/**
 * Client-safe pure function that constructs optimized Cloudinary delivery URLs
 * or safely handles external/Unsplash URLs.
 */
export function buildCloudinaryUrl(
  storageKeyOrUrl: string,
  options: CloudinaryTransformOptions = {}
): string {
  if (!storageKeyOrUrl) return '';

  // If already a full URL (e.g. Unsplash or direct CDN during prototyping/seed), return it
  if (storageKeyOrUrl.startsWith('http://') || storageKeyOrUrl.startsWith('https://')) {
    if (storageKeyOrUrl.includes('images.unsplash.com')) {
      const url = new URL(storageKeyOrUrl);
      if (options.width) url.searchParams.set('w', options.width.toString());
      if (options.height) url.searchParams.set('h', options.height.toString());
      if (options.crop === 'fill' || options.crop === 'thumb') url.searchParams.set('fit', 'crop');
      return url.toString();
    }
    return storageKeyOrUrl;
  }

  // If local static asset in public/
  if (storageKeyOrUrl.startsWith('/')) {
    return storageKeyOrUrl;
  }

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'kaftan-editorial';
  const transformations: string[] = ['f_auto', 'q_auto'];

  if (options.width) transformations.push(`w_${options.width}`);
  if (options.height) transformations.push(`h_${options.height}`);
  if (options.crop) transformations.push(`c_${options.crop}`);
  if (options.gravity) transformations.push(`g_${options.gravity}`);

  const transformString = transformations.join(',');
  const cleanId = storageKeyOrUrl.replace(/^\/+/, '');

  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformString}/${cleanId}`;
}

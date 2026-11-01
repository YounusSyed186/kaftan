import { describe, it, expect } from 'vitest';
import { buildCloudinaryUrl } from '@/lib/cloudinary/url';

describe('Media & Cloudinary Transformations', () => {
  it('handles external and Unsplash URLs with dynamic sizing parameters', () => {
    const unsplashUrl = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format';
    const transformed = buildCloudinaryUrl(unsplashUrl, { width: 800, height: 600, crop: 'fill' });

    expect(transformed).toContain('images.unsplash.com');
    expect(transformed).toContain('w=800');
    expect(transformed).toContain('h=600');
    expect(transformed).toContain('fit=crop');
  });

  it('generates standard Cloudinary transformation URLs for public keys', () => {
    const publicId = 'kaftan/editorial/modern-elegance';
    const url = buildCloudinaryUrl(publicId, {
      width: 1200,
      height: 800,
      crop: 'fill',
      gravity: 'auto',
    });

    expect(url).toContain('res.cloudinary.com');
    expect(url).toContain('f_auto,q_auto,w_1200,h_800,c_fill,g_auto');
    expect(url).toContain('kaftan/editorial/modern-elegance');
  });

  it('handles empty input gracefully without breaking', () => {
    expect(buildCloudinaryUrl('')).toBe('');
  });

  it('normalizes local /images/ paths to dynamic Cloudinary asset delivery URLs', () => {
    const localPath = '/images/editorial/hero-mediterranean-resortwear.jpg';
    const url = buildCloudinaryUrl(localPath, { width: 1400 });

    expect(url).toContain('res.cloudinary.com');
    expect(url).toContain('kaftan/editorial/hero-mediterranean-resortwear');
    expect(url).not.toContain('/images/');
  });
});

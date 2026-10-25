import { describe, it, expect } from 'vitest';

describe('Product Pricing Rules', () => {
  it('validates prices are non-negative', () => {
    const isValidPrice = (price: number | null): boolean => {
      if (price === null || price === undefined) return true;
      return price >= 0;
    };

    expect(isValidPrice(149.0)).toBe(true);
    expect(isValidPrice(0)).toBe(true);
    expect(isValidPrice(-10.5)).toBe(false);
  });

  it('determines discount status without fabricating missing values', () => {
    const getDiscountPercentage = (original: number | null, sale: number | null): number | null => {
      if (!original || !sale || original <= 0 || sale >= original) {
        return null;
      }
      return Math.round(((original - sale) / original) * 100);
    };

    // Azure Resort Kaftan: $249 -> $149 (approx 40% off)
    expect(getDiscountPercentage(249, 149)).toBe(40);

    // No discount if sale price equals original
    expect(getDiscountPercentage(200, 200)).toBeNull();

    // No discount if original is missing
    expect(getDiscountPercentage(null, 150)).toBeNull();

    // No discount if sale price exceeds original
    expect(getDiscountPercentage(100, 150)).toBeNull();
  });

  it('formats currency consistently', () => {
    const formatPrice = (amount: number, currency = 'AUD') => {
      return new Intl.NumberFormat('en-AU', {
        style: 'currency',
        currency,
      }).format(amount);
    };

    expect(formatPrice(149.0)).toBe('$149.00');
    expect(formatPrice(99.5)).toBe('$99.50');
  });
});

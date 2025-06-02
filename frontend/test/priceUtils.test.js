import { describe, it, expect } from 'vitest';
import { formatPrice, convertCurrency } from '../src/utils/priceUtils';

describe('Price Utils Tests', () => {
    it('should format price with currency symbol', () => {
        expect(formatPrice(1000, 'USD')).toBe('$1,000');
        expect(formatPrice(1000, 'INR')).toBe('₹1,000');
    });

    it('should convert currency correctly', () => {
        const rate = 83.5; // USD to INR
        expect(convertCurrency(100, 'USD', 'INR', rate)).toBe(8350);
        expect(convertCurrency(8350, 'INR', 'USD', rate)).toBe(100);
    });

    it('should handle zero and negative values', () => {
        expect(formatPrice(0, 'USD')).toBe('$0');
        expect(formatPrice(-100, 'USD')).toBe('-$100');
    });
});

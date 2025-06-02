import { describe, it, expect } from 'vitest';
import { formatPrice, calculatePriceWithTax, convertUSDtoINR } from '../src/utils/priceUtils';

describe('Price Handling Tests', () => {    // Test price formatting
    it('should format USD prices correctly', () => {
        const price = 1000;
        const formatted = formatPrice(price, 'USD');
        expect(formatted).toBe('$1,000');
    });

    // Test INR conversion
    it('should convert USD to INR correctly', () => {
        const usdPrice = 100;
        const inrPrice = convertUSDtoINR(usdPrice);
        expect(inrPrice).toBe(8350); // Based on rate 83.5
    });

    // Test tax calculation
    it('should calculate price with tax correctly', () => {
        const basePrice = 1000;
        const priceWithTax = calculatePriceWithTax(basePrice, true);
        expect(priceWithTax).toBe(1180); // 18% tax
    });

    // Test zero price handling
    it('should handle zero prices', () => {
        const formatted = formatPrice(0, 'USD');
        expect(formatted).toBe('$0');
    });

    // Test large number formatting
    it('should format large numbers correctly', () => {
        const largePrice = 1000000;
        const formatted = formatPrice(largePrice, 'INR');
        expect(formatted).toBe('₹1,000,000');
    });
});
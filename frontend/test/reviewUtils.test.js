import { describe, it, expect } from 'vitest';
import { calculateAverageRating, calculateRatingDistribution } from '../src/utils/reviewUtils';

describe('Review Utils Tests', () => {
    it('should calculate average rating correctly', () => {
        const reviews = [
            { rating: 5 },
            { rating: 4 },
            { rating: 3 }
        ];
        expect(calculateAverageRating(reviews)).toBe(4);
    });

    it('should return 0 for empty reviews', () => {
        expect(calculateAverageRating([])).toBe(0);
    });

    it('should calculate rating distribution correctly', () => {
        const reviews = [
            { rating: 5 },
            { rating: 5 },
            { rating: 4 },
            { rating: 3 }
        ];
        const distribution = calculateRatingDistribution(reviews);
        expect(distribution.find(d => d.rating === 5).count).toBe(2);
        expect(distribution.find(d => d.rating === 4).count).toBe(1);
        expect(distribution.find(d => d.rating === 3).count).toBe(1);
    });
});

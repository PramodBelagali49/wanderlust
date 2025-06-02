import { describe, it, expect } from 'vitest';
import { calculateAverageRating, calculateRatingDistribution } from '../src/utils/reviewUtils';

describe('Review System Tests', () => {
    // Test average rating calculation
    it('should calculate correct average rating', () => {
        const reviews = [
            { rating: 5 },
            { rating: 4 },
            { rating: 3 }
        ];
        const average = calculateAverageRating(reviews);
        expect(average).toBe(4);
    });

    // Test empty reviews handling
    it('should handle empty reviews', () => {
        const average = calculateAverageRating([]);
        expect(average).toBe(0);
    });

    // Test rating distribution calculation
    it('should calculate rating distribution correctly', () => {
        const reviews = [
            { rating: 5 },
            { rating: 5 },
            { rating: 4 },
            { rating: 3 }
        ];
        const distribution = calculateRatingDistribution(reviews);
        
        // Check counts
        const fiveStars = distribution.find(d => d.rating === 5);
        expect(fiveStars.count).toBe(2);
        expect(fiveStars.percentage).toBe(50);
    });

    // Test invalid ratings handling
    it('should handle invalid ratings', () => {
        const reviews = [
            { rating: 6 }, // Invalid rating
            { rating: 4 },
            { rating: -1 } // Invalid rating
        ];
        const average = calculateAverageRating(reviews.filter(r => r.rating >= 1 && r.rating <= 5));
        expect(average).toBe(4);
    });
});

import { describe, it, expect } from 'vitest';

// Simple math operations test
describe('Basic Frontend Tests', () => {
    it('should add numbers correctly', () => {
        expect(1 + 1).toBe(2);
    });

    it('should handle string concatenation', () => {
        expect('hello ' + 'world').toBe('hello world');
    });

    it('should work with arrays', () => {
        const arr = [1, 2, 3];
        expect(arr.length).toBe(3);
        expect(arr[0]).toBe(1);
    });
});

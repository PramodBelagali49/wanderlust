const assert = require('assert');
const { formatResponse } = require('../utilities/errorHandler');
const Listing = require('../models/listing');

describe('Listing Tests', () => {
    // Test listing model validation
    it('should validate listing fields', () => {
        const listing = new Listing({
            title: 'Test Listing',
            description: 'Test Description',
            image: {
                url: 'https://example.com/image.jpg',
                filename: 'test-image'
            },
            price: 1000,
            location: 'Test Location',
            country: 'Test Country'
        });

        // Check required fields
        assert.strictEqual(listing.title, 'Test Listing');
        assert.strictEqual(listing.price, 1000);
        assert.strictEqual(typeof listing._id, 'object'); // MongoDB ObjectId
    });

    // Test response formatting
    it('should format listing response correctly', () => {
        const mockListing = {
            title: 'Beach House',
            price: 2000
        };
        
        const response = formatResponse(true, 'Listing created', mockListing);
        assert.strictEqual(response.success, true);
        assert.strictEqual(response.message, 'Listing created');
        assert.deepStrictEqual(response.data, mockListing);
    });
});
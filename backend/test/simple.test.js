const assert = require('assert');
const { formatResponse } = require('../utilities/errorHandler');

describe('Basic Backend Tests', () => {
    // Simple success response test
    it('should format success response', () => {
        const response = formatResponse(true, 'Success');
        assert.strictEqual(response.success, true);
        assert.strictEqual(response.message, 'Success');
    });

    // Simple error response test
    it('should format error response', () => {
        const response = formatResponse(false, 'Error occurred');
        assert.strictEqual(response.success, false);
        assert.strictEqual(response.message, 'Error occurred');
    });

    // Simple array test
    it('should handle array data', () => {
        const data = [1, 2, 3];
        const response = formatResponse(true, 'Array data', data);
        assert.deepStrictEqual(response.data, [1, 2, 3]);
    });
});

const assert = require('assert');
const { formatResponse } = require('../utilities/errorHandler');

describe('Utility Function Tests', () => {
    it('should format success response correctly', () => {
        const response = formatResponse(true, 'Success message', { data: 'test' });
        assert.strictEqual(response.success, true);
        assert.strictEqual(response.message, 'Success message');
        assert.deepStrictEqual(response.data, { data: 'test' });
    });

    it('should format error response correctly', () => {
        const response = formatResponse(false, 'Error message', null, 'Error details');
        assert.strictEqual(response.success, false);
        assert.strictEqual(response.message, 'Error message');
        assert.strictEqual(response.error, 'Error details');
    });
});

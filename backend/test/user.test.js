const assert = require('assert');
const { hashPassword, validatePassword } = require('../utilities/passwordUtils');
const { generateToken } = require('../utilities/tokenUtils');

describe('User Authentication Tests', () => {
    it('should hash password correctly', async () => {
        const password = 'testPassword123';
        const hashedPassword = await hashPassword(password);
        assert.strictEqual(typeof hashedPassword, 'string');
        assert.notStrictEqual(hashedPassword, password);
    });

    it('should validate password correctly', async () => {
        const password = 'testPassword123';
        const hashedPassword = await hashPassword(password);
        const isValid = await validatePassword(password, hashedPassword);
        assert.strictEqual(isValid, true);
    });

    it('should generate valid JWT token', () => {
        const user = {
            _id: '123',
            email: 'test@example.com'
        };
        const token = generateToken(user);
        assert.strictEqual(typeof token, 'string');
        assert.ok(token.split('.').length === 3); // JWT has 3 parts
    });
});

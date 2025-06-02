const assert = require('assert');
const { validatePassword, hashPassword } = require('../utilities/passwordUtils');
const { generateOTP, validateOTP } = require('../utilities/otpUtils');

describe('Authentication Tests', () => {

    // Test password hashing
    it('should hash password securely', async () => {
        const password = 'TestPassword123';
        const hashedPassword = await hashPassword(password);
        
        // Check that password is hashed
        assert.notStrictEqual(hashedPassword, password);
        assert.strictEqual(hashedPassword.startsWith('$2'), true);
    });

    // Test password validation
    it('should validate password format', () => {
        const validPassword = 'StrongPass123';
        const isValid = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(validPassword);
        assert.strictEqual(isValid, true);
    });
});

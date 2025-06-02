const jwt = require('jsonwebtoken');

// Generate JWT token
module.exports.generateToken = (user) => {
    try {
        const payload = {
            userId: user._id,
            email: user.email,
            timestamp: Date.now()
        };
        
        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET is not configured');
        }
        
        return jwt.sign(
            payload, 
            process.env.JWT_SECRET, 
            { 
                expiresIn: '24h',
                algorithm: 'HS256'
            }
        );
    } catch (error) {
        console.error('Error generating token:', error);
        throw error;
    }
};

// Verify JWT token
module.exports.verifyToken = (token) => {
    try {
        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET is not configured');
        }

        return jwt.verify(token, process.env.JWT_SECRET, {
            algorithms: ['HS256']
        });
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            console.error('Token expired:', token.substring(0, 10) + '...');
        } else if (error.name === 'JsonWebTokenError') {
            console.error('Invalid token:', error.message);
        } else {
            console.error('Token verification error:', error);
        }
        return null;
    }
};
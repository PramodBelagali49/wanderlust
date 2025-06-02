const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const User = require("../models/user.js");
const jwt = require('jsonwebtoken');
const { verifyToken } = require('./tokenUtils.js');
const {
    listingsSchema
} = require("./schema.js");

module.exports.verifyToken = async (req, res, next) => {
    try {
        // Check for Authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            console.error('No token provided in Authorization header');
            return res.status(401).json({
                message: "No token provided",
                details: "Authorization header is missing or invalid"
            });
        }

        // Check JWT_SECRET configuration
        if (!process.env.JWT_SECRET) {
            console.error('JWT_SECRET is not configured');
            return res.status(500).json({
                message: "Server configuration error",
                details: "JWT_SECRET is not properly configured"
            });
        }

        // Extract and verify token
        const token = authHeader.split(' ')[1];
        const decoded = verifyToken(token);
        
        if (!decoded) {
            console.error('Token verification failed for token:', token.substring(0, 10) + '...');
            return res.status(401).json({
                message: "Token verification failed",
                details: "The provided token is invalid or has expired"
            });
        }

        try {
            // Find user in database
            const user = await User.findById(decoded.userId);
            if (!user) {
                console.error('Token valid but user not found:', decoded.userId);
                return res.status(401).json({
                    message: "Invalid token: User not found",
                    details: "The user associated with this token was not found"
                });
            }

            // Set user info in request
            req.user = {
                userId: user._id,
                email: user.email,
                name: user.name,
                profilePhoto: user.profilePhoto || '',
                isValidatedEmail: user.isValidatedEmail
            };
            next();
        } catch (dbError) {
            console.error('Database error finding user:', dbError);
            return res.status(500).json({
                message: "Server error",
                details: "Failed to validate user"
            });
        }
    } catch (error) {
        console.error('Token verification error:', error);
        return res.status(401).json({
            message: "Invalid token",
            details: error.message
        });
    }
};

// This function is no longer needed since client-side will check for token
// We'll keep it during transition period, but it can be replaced with verifyToken
module.exports.isLoggedIn = module.exports.verifyToken;

module.exports.isListingOwner = (req, res, next) => {
    // First check if admin user
    if (req.user?.userId === "66a343a50ff99cdefc1a4657") {
        next();
        return;
    }
    
    const { id } = req.params;
    Listing.findById(id)
        .populate("owner")
        .then((listing) => {
            if (listing && listing.owner._id.equals(req.user.userId))
                next();
            else {
                throw {
                    status: 403,
                    message: "You are not the owner of this listing",
                };
            }
        })
        .catch((error) => {
            res.status(error.status || 500).json({
                message: error.message,
            });
        });
};

module.exports.validateListing = (req, res, next) => {
    const {
        error
    } = listingsSchema.validate(req.body);
    if (error) {
        return res.status(400).json({
            message: error.details.map((el) => el.message).join(","),
        });
    }
    next();
};

module.exports.isReviewOwner = (req, res, next) => {
    const { reviewId } = req.params;

    if (req.user?.userId?.toString() === "66a343a50ff99cdefc1a4657") {
        next();
        return;
    }

    Review.findById(reviewId)
        .populate("owner")
        .then((review) => {
            if (review && review.owner._id.equals(req.user.userId)) {
                next();
            } else {
                res.status(403).json({
                    message: "You are not the owner of this review",
                });
            }
        })
        .catch((err) => {
            res.status(500).json({
                message: err.message,
            });
        });
};
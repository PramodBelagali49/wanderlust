const Review = require("../models/review.js")
const Listing = require("../models/listing.js")

// Create a new review
module.exports.createReview = (req, res) => {
    const {
        id
    } = req.params;
    const {
        rating,
        content
    } = req.body;    Listing.findById(id)
        .then((listing) => {
            if (!content) {
                throw new Error('Review content is required');
            }
            if (!rating || rating < 1 || rating > 5) {
                throw new Error('Rating must be between 1 and 5');
            }
            const newReview = new Review({
                content,
                rating: parseInt(rating),
                owner: req.user.userId,
            });

            listing.reviews.push(newReview);
            return Promise.all([newReview.save(), listing.save()]);
        })
        .then(([review]) => {
            res.status(201).json({
                success: true,
                message: "New Review Added!",
                review
            });
        })
        .catch((error) => {
            console.error("Error creating review:", error);
            res.status(500).json({
                success: false,
                message: "Error creating review",
                error: error.message,
            });
        });
};

// Delete a review
module.exports.destroyReview = (req, res) => {
    const {
        id,
        reviewId
    } = req.params;

    Listing.findById(id)
        .then((listing) => {
            return Promise.all([
                Review.findByIdAndDelete(reviewId),
                listing.reviews.pull(reviewId),
                listing.save(),
            ]);
        })
        .then(() => {
            res.json({
                success: true,
                message: "Review Deleted"
            });
        })
        .catch((error) => {
            console.error("Error deleting review:", error);
            res.status(500).json({
                success: false,
                message: "Error deleting review",
                error: error.message,
            });
        });
};
const reviewService = require('../services/reviewService');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Create a new review
// @route   POST /api/v1/reviews
// @access  Private
const createReview = asyncHandler(async (req, res) => {
  const review = await reviewService.createReview(req.user._id, req.body);
  res.status(201).json(review);
});

// @desc    Get reviews for a user
// @route   GET /api/v1/reviews/user/:id
// @access  Public
const getUserReviews = asyncHandler(async (req, res) => {
  const reviews = await reviewService.getReviewsForUser(req.params.id);
  res.json(reviews);
});

module.exports = {
  createReview,
  getUserReviews
};

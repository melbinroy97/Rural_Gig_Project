const Review = require('../models/Review');
const User = require('../models/User');

// @desc    Create new review
// @route   POST /api/reviews
// @access  Private
const createReview = async (req, res) => {
  try {
    const { reviewee, order, rating, comment } = req.body;

    const review = new Review({
      reviewer: req.user._id,
      reviewee,
      order,
      rating,
      comment
    });

    const createdReview = await review.save();

    // Update user's rating and totalReviews
    const reviews = await Review.find({ reviewee });
    const totalReviews = reviews.length;
    const avgRating = reviews.reduce((acc, item) => item.rating + acc, 0) / totalReviews;

    await User.findByIdAndUpdate(reviewee, {
      rating: avgRating,
      totalReviews
    });

    res.status(201).json(createdReview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get reviews for a user
// @route   GET /api/reviews/user/:id
// @access  Public
const getUserReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ reviewee: req.params.id })
      .populate('reviewer', 'name avatar location');
    
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createReview,
  getUserReviews
};

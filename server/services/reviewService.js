const reviewRepository = require('../repositories/reviewRepository');
const userRepository = require('../repositories/userRepository');
const orderRepository = require('../repositories/orderRepository');
const ApiError = require('../utils/ApiError');

class ReviewService {
  async createReview(reviewerId, reviewData) {
    const { reviewee, order, rating, comment } = reviewData;

    // Check order involvement
    const orderObj = await orderRepository.findById(order);
    if (!orderObj) {
      throw new ApiError(404, "Associated order not found");
    }

    if (orderObj.reviewer && orderObj.reviewer.toString() === reviewerId.toString()) {
      throw new ApiError(400, "Review already created for this order");
    }

    const review = await reviewRepository.create({
      reviewer: reviewerId,
      reviewee,
      order,
      rating,
      comment
    });

    // Update worker rating and totalReviews
    const stats = await reviewRepository.aggregateWorkerRating(reviewee);
    if (stats && stats.length > 0) {
      const avgRating = Math.round(stats[0].rating * 10) / 10;
      await userRepository.update(reviewee, {
        rating: avgRating,
        totalReviews: stats[0].totalReviews
      });
    }

    return review;
  }

  async getReviewsForUser(userId) {
    return await reviewRepository.findByRevieweeId(userId);
  }
}

module.exports = new ReviewService();

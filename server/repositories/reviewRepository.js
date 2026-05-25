const Review = require('../models/Review');

class ReviewRepository {
  async findById(id) {
    return await Review.findById(id).populate('reviewer reviewee');
  }

  async findByRevieweeId(revieweeId) {
    return await Review.find({ reviewee: revieweeId })
      .populate('reviewer', 'name avatar location')
      .populate('order', 'price');
  }

  async create(reviewData) {
    return await Review.create(reviewData);
  }

  async aggregateWorkerRating(workerId) {
    const stats = await Review.aggregate([
      { $match: { reviewee: workerId } },
      {
        $group: {
          _id: '$reviewee',
          rating: { $avg: '$rating' },
          totalReviews: { $sum: 1 }
        }
      }
    ]);
    return stats;
  }
}

module.exports = new ReviewRepository();

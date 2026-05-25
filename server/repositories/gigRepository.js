const Gig = require('../models/Gig');

class GigRepository {
  async findById(id) {
    return await Gig.findById(id).populate('seller', 'name avatar location bio');
  }

  async find(filters, page, pageSize) {
    return await Gig.find(filters)
      .populate('seller', 'name avatar location')
      .limit(pageSize)
      .skip(pageSize * (page - 1));
  }

  async count(filters) {
    return await Gig.countDocuments(filters);
  }

  async create(gigData) {
    return await Gig.create(gigData);
  }

  async update(id, gigData) {
    return await Gig.findByIdAndUpdate(id, gigData, { new: true, runValidators: true });
  }

  async delete(id) {
    return await Gig.findByIdAndDelete(id);
  }

  async findBySellerId(sellerId) {
    return await Gig.find({ seller: sellerId });
  }
}

module.exports = new GigRepository();

const Order = require('../models/Order');

class OrderRepository {
  async findById(id) {
    return await Order.findById(id).populate('worker employer gig job');
  }

  async findUserOrders(userId) {
    return await Order.find({
      $or: [{ worker: userId }, { employer: userId }]
    })
    .populate('worker', 'name avatar')
    .populate('employer', 'name avatar')
    .populate('gig', 'title')
    .populate('job', 'title');
  }

  async create(orderData) {
    return await Order.create(orderData);
  }

  async update(id, updateData) {
    return await Order.findByIdAndUpdate(id, updateData, { new: true });
  }

  async findAll(filters = {}) {
    return await Order.find(filters).populate('worker employer gig job');
  }
}

module.exports = new OrderRepository();

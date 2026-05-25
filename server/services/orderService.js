const orderRepository = require('../repositories/orderRepository');
const ApiError = require('../utils/ApiError');

class OrderService {
  async createOrder(orderData) {
    const { gig, job, worker, employer, package: selectedPackage, price, requirements } = orderData;

    const order = await orderRepository.create({
      gig,
      job,
      worker,
      employer,
      package: selectedPackage,
      price,
      requirements,
      status: 'active' // Orders starts as active immediately for simplicity
    });

    return order;
  }

  async getMyOrders(userId) {
    return await orderRepository.findUserOrders(userId);
  }

  async updateOrderStatus(orderId, userId, status) {
    const order = await orderRepository.findById(orderId);
    if (!order) {
      throw new ApiError(404, "Order not found");
    }

    // Ensure user is involved in the order
    if (order.worker.toString() !== userId.toString() && 
        order.employer.toString() !== userId.toString()) {
      throw new ApiError(403, "Not authorized to update this order");
    }

    order.status = status;
    if (status === 'completed') {
      order.deliveryDate = Date.now();
    }

    await order.save();
    return order;
  }

  async getAllOrders() {
    return await orderRepository.findAll();
  }
}

module.exports = new OrderService();

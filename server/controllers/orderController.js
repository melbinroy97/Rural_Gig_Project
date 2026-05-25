const orderService = require('../services/orderService');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Create new order
// @route   POST /api/v1/orders/create
// @access  Private
const createOrder = asyncHandler(async (req, res) => {
  const orderData = { ...req.body, employer: req.user._id };
  const createdOrder = await orderService.createOrder(orderData);
  res.status(201).json(createdOrder);
});

// @desc    Get logged in user orders
// @route   GET /api/v1/orders/my-orders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await orderService.getMyOrders(req.user._id);
  res.json(orders);
});

// @desc    Update order status
// @route   PUT /api/v1/orders/:id/status
// @access  Private
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const updatedOrder = await orderService.updateOrderStatus(req.params.id, req.user._id, status);
  res.json(updatedOrder);
});

// @desc    Get all orders (Admin dashboard)
// @route   GET /api/v1/orders
// @access  Private/Admin
const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await orderService.getAllOrders();
  res.json(orders);
});

module.exports = {
  createOrder,
  getMyOrders,
  updateOrderStatus,
  getAllOrders
};

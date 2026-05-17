const Order = require('../models/Order');

// @desc    Create new order
// @route   POST /api/orders/create
// @access  Private
const createOrder = async (req, res) => {
  try {
    const { gig, job, worker, employer, package, price, requirements } = req.body;

    const order = new Order({
      gig,
      job,
      worker,
      employer,
      package,
      price,
      requirements
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/my-orders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    // Find orders where user is either worker or employer
    const orders = await Order.find({
      $or: [{ worker: req.user._id }, { employer: req.user._id }]
    })
    .populate('worker', 'name avatar')
    .populate('employer', 'name avatar')
    .populate('gig', 'title')
    .populate('job', 'title');
    
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (order) {
      // Ensure user is involved in the order
      if (order.worker.toString() !== req.user._id.toString() && 
          order.employer.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Not authorized to update this order' });
      }

      order.status = status;
      if (status === 'completed') {
          order.deliveryDate = Date.now();
      }

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  updateOrderStatus
};

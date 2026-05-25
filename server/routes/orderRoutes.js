const express = require('express');
const router = express.Router();
const { createOrder, getMyOrders, updateOrderStatus, getAllOrders } = require('../controllers/orderController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

router.post('/create', protect, createOrder);
router.get('/my-orders', protect, getMyOrders);
router.put('/:id/status', protect, updateOrderStatus);

// Admin-only operations
router.get('/', protect, authorizeRoles('admin'), getAllOrders);

module.exports = router;

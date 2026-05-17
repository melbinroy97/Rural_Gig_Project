const express = require('express');
const router = express.Router();
const { createOrder, getMyOrders, updateOrderStatus } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

router.post('/create', protect, createOrder);
router.get('/my-orders', protect, getMyOrders);
router.put('/:id/status', protect, updateOrderStatus);

module.exports = router;

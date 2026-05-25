const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile, getWorkers, getAllUsers, suspendUser } = require('../controllers/userController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

router.get('/workers', getWorkers);
router.get('/profile/:id', getUserProfile);
router.put('/profile/update', protect, updateUserProfile);

// Admin-only operations
router.get('/', protect, authorizeRoles('admin'), getAllUsers);
router.put('/:id/suspend', protect, authorizeRoles('admin'), suspendUser);

module.exports = router;

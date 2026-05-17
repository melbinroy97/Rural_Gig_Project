const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile, getWorkers } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.get('/workers', getWorkers);
router.get('/profile/:id', getUserProfile);
router.put('/profile/update', protect, updateUserProfile);

module.exports = router;

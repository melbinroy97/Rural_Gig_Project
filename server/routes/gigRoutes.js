const express = require('express');
const router = express.Router();
const { getGigs, getGigById, createGig, updateGig, deleteGig } = require('../controllers/gigController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

router.get('/', getGigs);
router.get('/:id', getGigById);
router.post('/create', protect, authorizeRoles('worker', 'admin'), createGig);
router.put('/:id/update', protect, authorizeRoles('worker', 'admin'), updateGig);
router.delete('/:id', protect, authorizeRoles('worker', 'admin'), deleteGig);

module.exports = router;

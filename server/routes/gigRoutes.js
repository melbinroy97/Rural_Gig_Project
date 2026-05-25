const express = require('express');
const router = express.Router();
const { getGigs, getGigById, createGig, updateGig, deleteGig } = require('../controllers/gigController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const { gigValidator } = require('../validations/gigValidation');
const validate = require('../middleware/validationMiddleware');

router.get('/', getGigs);
router.get('/:id', getGigById);

// Protected routes
router.post('/create', protect, authorizeRoles('worker'), gigValidator, validate, createGig);
router.put('/:id/update', protect, authorizeRoles('worker', 'admin'), gigValidator, validate, updateGig);
router.delete('/:id', protect, authorizeRoles('worker', 'admin'), deleteGig);

module.exports = router;

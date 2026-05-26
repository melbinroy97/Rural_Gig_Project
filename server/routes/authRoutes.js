const express = require('express');
const router = express.Router();
const { registerUser, loginUser, logoutUser, getMe, refreshToken, resolvePincode } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { registerValidator, loginValidator } = require('../validations/authValidation');
const validate = require('../middleware/validationMiddleware');

router.post('/register', registerValidator, validate, registerUser);
router.post('/login', loginValidator, validate, loginUser);
router.post('/logout', logoutUser);
router.post('/refresh-token', refreshToken);
router.get('/me', protect, getMe);
router.get('/pincode/:pincode', resolvePincode);

module.exports = router;

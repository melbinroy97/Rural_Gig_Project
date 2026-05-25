const express = require('express');
const router = express.Router();
const { getJobs, getJobById, createJob, applyForJob, getMyJobs } = require('../controllers/jobController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const { jobValidator } = require('../validations/jobValidation');
const validate = require('../middleware/validationMiddleware');

router.get('/', getJobs);
router.get('/my-jobs', protect, authorizeRoles('employer'), getMyJobs);
router.get('/:id', getJobById);

// Protected routes
router.post('/create', protect, authorizeRoles('employer'), jobValidator, validate, createJob);
router.post('/:id/apply', protect, authorizeRoles('worker'), applyForJob);

module.exports = router;

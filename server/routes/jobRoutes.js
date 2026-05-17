const express = require('express');
const router = express.Router();
const { getJobs, getJobById, createJob, applyForJob } = require('../controllers/jobController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

router.get('/', getJobs);
router.get('/:id', getJobById);
router.post('/create', protect, authorizeRoles('employer', 'admin'), createJob);
router.post('/:id/apply', protect, authorizeRoles('worker'), applyForJob);

module.exports = router;

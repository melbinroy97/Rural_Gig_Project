const jobService = require('../services/jobService');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get all jobs
// @route   GET /api/v1/jobs
// @access  Public
const getJobs = asyncHandler(async (req, res) => {
  const jobs = await jobService.getJobs(req.query);
  res.json(jobs);
});

// @desc    Get single job
// @route   GET /api/v1/jobs/:id
// @access  Public
const getJobById = asyncHandler(async (req, res) => {
  const job = await jobService.getJobById(req.params.id);
  res.json(job);
});

// @desc    Create a job
// @route   POST /api/v1/jobs/create
// @access  Private/Employer
const createJob = asyncHandler(async (req, res) => {
  const createdJob = await jobService.createJob(req.user._id, req.body);
  res.status(201).json(createdJob);
});

// @desc    Apply for a job (Submit Proposal)
// @route   POST /api/v1/jobs/:id/apply
// @access  Private/Worker
const applyForJob = asyncHandler(async (req, res) => {
  const response = await jobService.applyForJob(req.params.id, req.user._id, req.body);
  res.status(201).json(response);
});

// @desc    Get employer's posted jobs
// @route   GET /api/v1/jobs/my-jobs
// @access  Private/Employer
const getMyJobs = asyncHandler(async (req, res) => {
  const jobs = await jobService.getEmployerJobs(req.user._id);
  res.json(jobs);
});

module.exports = {
  getJobs,
  getJobById,
  createJob,
  applyForJob,
  getMyJobs
};

const Job = require('../models/Job');

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Public
const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ status: 'open' }).populate('employer', 'name avatar location');
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single job
// @route   GET /api/jobs/:id
// @access  Public
const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('employer', 'name avatar location');
    if (job) {
      res.json(job);
    } else {
      res.status(404).json({ message: 'Job not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a job
// @route   POST /api/jobs/create
// @access  Private/Employer
const createJob = async (req, res) => {
  try {
    const { title, description, category, budget, duration, locationRequired, skills, experienceLevel } = req.body;

    const job = new Job({
      employer: req.user._id,
      title,
      description,
      category,
      budget,
      duration,
      locationRequired,
      skills,
      experienceLevel
    });

    const createdJob = await job.save();
    res.status(201).json(createdJob);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Apply for a job
// @route   POST /api/jobs/:id/apply
// @access  Private/Worker
const applyForJob = async (req, res) => {
  try {
    const { bidAmount, coverLetter, estimatedDays } = req.body;

    const job = await Job.findById(req.params.id);

    if (job) {
      const alreadyApplied = job.proposals.find(
        (p) => p.worker.toString() === req.user._id.toString()
      );

      if (alreadyApplied) {
        return res.status(400).json({ message: 'You have already applied for this job' });
      }

      const proposal = {
        worker: req.user._id,
        bidAmount,
        coverLetter,
        estimatedDays
      };

      job.proposals.push(proposal);
      await job.save();

      res.status(201).json({ message: 'Proposal submitted successfully' });
    } else {
      res.status(404).json({ message: 'Job not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getJobs,
  getJobById,
  createJob,
  applyForJob
};

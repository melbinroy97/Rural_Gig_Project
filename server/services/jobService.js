const jobRepository = require('../repositories/jobRepository');
const ApiError = require('../utils/ApiError');

class JobService {
  async getJobs(filters = {}) {
    const query = { status: 'open' };
    if (filters.category) {
      query.category = filters.category;
    }
    return await jobRepository.find(query);
  }

  async getJobById(jobId) {
    const job = await jobRepository.findById(jobId);
    if (!job) {
      throw new ApiError(404, "Job not found");
    }
    return job;
  }

  async createJob(employerId, jobData) {
    const { title, description, category, budget, duration, locationRequired, skills, experienceLevel } = jobData;

    const job = await jobRepository.create({
      employer: employerId,
      title,
      description,
      category,
      budget,
      duration,
      locationRequired,
      skills: skills || [],
      experienceLevel
    });

    return job;
  }

  async applyForJob(jobId, workerId, proposalData) {
    const { bidAmount, coverLetter, estimatedDays } = proposalData;

    const job = await jobRepository.findById(jobId);
    if (!job) {
      throw new ApiError(404, "Job not found");
    }

    const alreadyApplied = job.proposals.find(
      (p) => p.worker.toString() === workerId.toString()
    );

    if (alreadyApplied) {
      throw new ApiError(400, "You have already applied for this job");
    }

    const proposal = {
      worker: workerId,
      bidAmount,
      coverLetter,
      estimatedDays,
      status: 'pending'
    };

    job.proposals.push(proposal);
    await job.save();

    return { message: "Proposal submitted successfully" };
  }

  async getEmployerJobs(employerId) {
    return await jobRepository.findByEmployerId(employerId);
  }
}

module.exports = new JobService();

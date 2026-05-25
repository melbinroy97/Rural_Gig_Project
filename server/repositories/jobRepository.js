const Job = require('../models/Job');

class JobRepository {
  async findById(id) {
    return await Job.findById(id).populate('employer', 'name avatar location');
  }

  async find(filters = {}) {
    return await Job.find(filters).populate('employer', 'name avatar location');
  }

  async create(jobData) {
    return await Job.create(jobData);
  }

  async update(id, updateData) {
    return await Job.findByIdAndUpdate(id, updateData, { new: true });
  }

  async delete(id) {
    return await Job.findByIdAndDelete(id);
  }

  async findByEmployerId(employerId) {
    return await Job.find({ employer: employerId }).populate('proposals.worker', 'name avatar skills location');
  }
}

module.exports = new JobRepository();

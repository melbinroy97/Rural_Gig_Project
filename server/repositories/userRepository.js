const User = require('../models/User');

class UserRepository {
  async findById(id) {
    return await User.findById(id);
  }

  async findByEmail(email) {
    return await User.findOne({ email });
  }

  async findWorkers(filters) {
    return await User.find({ role: 'worker', ...filters }).select('-password');
  }

  async create(userData) {
    return await User.create(userData);
  }

  async update(id, updateData) {
    return await User.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
  }

  async delete(id) {
    return await User.findByIdAndDelete(id);
  }

  async count(filters) {
    return await User.countDocuments(filters);
  }

  async findAll(filters = {}) {
    return await User.find(filters).select('-password');
  }
}

module.exports = new UserRepository();

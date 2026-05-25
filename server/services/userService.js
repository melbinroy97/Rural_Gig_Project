const userRepository = require('../repositories/userRepository');
const ApiError = require('../utils/ApiError');

class UserService {
  async getProfile(userId) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    // Remove password field
    user.password = undefined;
    return user;
  }

  async updateProfile(userId, updateData) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const { name, phone, avatar, coverPhoto, bio, skills, village, district, state } = updateData;

    const fieldsToUpdate = {};
    if (name) fieldsToUpdate.name = name;
    if (phone) fieldsToUpdate.phone = phone;
    if (avatar) fieldsToUpdate.avatar = avatar;
    if (coverPhoto) fieldsToUpdate.coverPhoto = coverPhoto;
    if (bio) fieldsToUpdate.bio = bio;
    if (skills) fieldsToUpdate.skills = skills;

    if (village || district || state) {
      fieldsToUpdate.location = {
        village: village || user.location?.village,
        district: district || user.location?.district,
        state: state || user.location?.state
      };
    }

    const updatedUser = await userRepository.update(userId, fieldsToUpdate);
    updatedUser.password = undefined;
    return updatedUser;
  }

  async getWorkers(filters) {
    const query = {};
    if (filters.category) {
      // Filter by skills matching category
      query.skills = { $in: [filters.category] };
    }
    return await userRepository.findWorkers(query);
  }

  async getAllUsers() {
    return await userRepository.findAll();
  }

  async suspendUser(userId) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    // Simple toggle suspension (or verification state)
    // For demonstration, let's mark rating as -1 or simple active state.
    // Let's toggle verification/verification badge.
    user.isVerified = !user.isVerified;
    await user.save();
    return user;
  }
}

module.exports = new UserService();

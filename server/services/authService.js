const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/userRepository');
const ApiError = require('../utils/ApiError');

class AuthService {
  generateTokens(userId) {
    const accessToken = jwt.sign(
      { userId },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { userId },
      process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return { accessToken, refreshToken };
  }

  async register(userData) {
    const { name, email, phone, password, role, village, district, state, skills } = userData;

    const userExists = await userRepository.findByEmail(email);
    if (userExists) {
      throw new ApiError(400, "User with this email already exists");
    }

    const user = await userRepository.create({
      name,
      email,
      phone,
      password,
      role,
      location: { village, district, state },
      skills: skills || [],
    });

    const tokens = this.generateTokens(user._id);
    return { user, tokens };
  }

  async login(email, password) {
    const user = await userRepository.findByEmail(email);
    if (!user || !(await user.matchPassword(password))) {
      throw new ApiError(401, "Invalid email or password");
    }

    const tokens = this.generateTokens(user._id);
    return { user, tokens };
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw new ApiError(401, "Refresh token is missing");
    }

    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET);
      const user = await userRepository.findById(decoded.userId);
      if (!user) {
        throw new ApiError(401, "User no longer exists");
      }

      const tokens = this.generateTokens(user._id);
      return tokens;
    } catch (error) {
      throw new ApiError(401, "Invalid refresh token");
    }
  }
}

module.exports = new AuthService();

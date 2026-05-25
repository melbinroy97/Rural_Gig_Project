const userService = require('../services/userService');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get user profile by ID
// @route   GET /api/v1/users/profile/:id
// @access  Public
const getUserProfile = asyncHandler(async (req, res) => {
  const profile = await userService.getProfile(req.params.id);
  res.json(profile);
});

// @desc    Update user profile
// @route   PUT /api/v1/users/profile/update
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const updatedUser = await userService.updateProfile(req.user._id, req.body);
  res.json(updatedUser);
});

// @desc    Get all workers
// @route   GET /api/v1/users/workers
// @access  Public
const getWorkers = asyncHandler(async (req, res) => {
  const workers = await userService.getWorkers(req.query);
  res.json(workers);
});

// @desc    Get all users (Admin dashboard)
// @route   GET /api/v1/users
// @access  Private/Admin
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await userService.getAllUsers();
  res.json(users);
});

// @desc    Suspend/verify user (Admin dashboard)
// @route   PUT /api/v1/users/:id/suspend
// @access  Private/Admin
const suspendUser = asyncHandler(async (req, res) => {
  const suspended = await userService.suspendUser(req.params.id);
  res.json(suspended);
});

module.exports = {
  getUserProfile,
  updateUserProfile,
  getWorkers,
  getAllUsers,
  suspendUser
};

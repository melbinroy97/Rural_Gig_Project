const gigService = require('../services/gigService');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get all gigs
// @route   GET /api/v1/gigs
// @access  Public
const getGigs = asyncHandler(async (req, res) => {
  const result = await gigService.getGigs(req.query);
  res.json(result);
});

// @desc    Get single gig
// @route   GET /api/v1/gigs/:id
// @access  Public
const getGigById = asyncHandler(async (req, res) => {
  const gig = await gigService.getGigById(req.params.id);
  res.json(gig);
});

// @desc    Create a gig
// @route   POST /api/v1/gigs/create
// @access  Private/Worker
const createGig = asyncHandler(async (req, res) => {
  const createdGig = await gigService.createGig(req.user._id, req.body);
  res.status(201).json(createdGig);
});

// @desc    Update a gig
// @route   PUT /api/v1/gigs/:id/update
// @access  Private/Worker
const updateGig = asyncHandler(async (req, res) => {
  const isAdmin = req.user.role === 'admin';
  const updatedGig = await gigService.updateGig(req.params.id, req.user._id, req.body, isAdmin);
  res.json(updatedGig);
});

// @desc    Delete a gig
// @route   DELETE /api/v1/gigs/:id
// @access  Private/Worker
const deleteGig = asyncHandler(async (req, res) => {
  const isAdmin = req.user.role === 'admin';
  const response = await gigService.deleteGig(req.params.id, req.user._id, isAdmin);
  res.json(response);
});

module.exports = {
  getGigs,
  getGigById,
  createGig,
  updateGig,
  deleteGig
};

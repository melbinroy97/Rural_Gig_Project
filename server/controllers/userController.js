const User = require('../models/User');

// @desc    Get user profile by ID
// @route   GET /api/users/profile/:id
// @access  Public
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile/update
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.phone = req.body.phone || user.phone;
      user.avatar = req.body.avatar || user.avatar;
      user.coverPhoto = req.body.coverPhoto || user.coverPhoto;
      user.bio = req.body.bio || user.bio;
      
      if (req.body.skills) {
        user.skills = req.body.skills;
      }
      
      if (req.body.village || req.body.district || req.body.state) {
        user.location.village = req.body.village || user.location.village;
        user.location.district = req.body.district || user.location.district;
        user.location.state = req.body.state || user.location.state;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        avatar: updatedUser.avatar,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all workers
// @route   GET /api/users/workers
// @access  Public
const getWorkers = async (req, res) => {
  try {
    const filters = { role: 'worker' };
    
    // Add filters logic if query params provided
    if (req.query.category) {
        // We could search skills
        filters.skills = { $in: [req.query.category] };
    }

    const workers = await User.find(filters).select('-password');
    res.json(workers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  getWorkers
};

const Gig = require('../models/Gig');

// @desc    Get all gigs
// @route   GET /api/gigs
// @access  Public
const getGigs = async (req, res) => {
  try {
    const pageSize = 10;
    const page = Number(req.query.pageNumber) || 1;

    const keyword = req.query.keyword
      ? {
          title: {
            $regex: req.query.keyword,
            $options: 'i',
          },
        }
      : {};
      
    const categoryFilter = req.query.category ? { category: req.query.category } : {};

    const count = await Gig.countDocuments({ ...keyword, ...categoryFilter });
    const gigs = await Gig.find({ ...keyword, ...categoryFilter })
      .populate('seller', 'name avatar location')
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({ gigs, page, pages: Math.ceil(count / pageSize) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single gig
// @route   GET /api/gigs/:id
// @access  Public
const getGigById = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id).populate('seller', 'name avatar location bio memberSince');
    if (gig) {
      res.json(gig);
    } else {
      res.status(404).json({ message: 'Gig not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a gig
// @route   POST /api/gigs/create
// @access  Private/Worker
const createGig = async (req, res) => {
  try {
    const { title, description, category, images, packages, tags } = req.body;

    const gig = new Gig({
      seller: req.user._id,
      title,
      description,
      category,
      images,
      packages,
      tags
    });

    const createdGig = await gig.save();
    res.status(201).json(createdGig);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a gig
// @route   PUT /api/gigs/:id/update
// @access  Private/Worker
const updateGig = async (req, res) => {
  try {
    const { title, description, category, images, packages, tags, isActive } = req.body;

    const gig = await Gig.findById(req.params.id);

    if (gig) {
      // Ensure only the seller can update
      if (gig.seller.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Not authorized to update this gig' });
      }

      gig.title = title || gig.title;
      gig.description = description || gig.description;
      gig.category = category || gig.category;
      gig.images = images || gig.images;
      gig.packages = packages || gig.packages;
      gig.tags = tags || gig.tags;
      gig.isActive = isActive !== undefined ? isActive : gig.isActive;

      const updatedGig = await gig.save();
      res.json(updatedGig);
    } else {
      res.status(404).json({ message: 'Gig not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a gig
// @route   DELETE /api/gigs/:id
// @access  Private/Worker
const deleteGig = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id);

    if (gig) {
      if (gig.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(401).json({ message: 'Not authorized to delete this gig' });
      }

      await gig.deleteOne();
      res.json({ message: 'Gig removed' });
    } else {
      res.status(404).json({ message: 'Gig not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getGigs,
  getGigById,
  createGig,
  updateGig,
  deleteGig
};

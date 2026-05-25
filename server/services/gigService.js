const gigRepository = require('../repositories/gigRepository');
const ApiError = require('../utils/ApiError');

class GigService {
  async getGigs(filters) {
    const pageSize = 12;
    const page = Number(filters.pageNumber) || 1;

    const query = {};
    if (filters.keyword) {
      query.title = { $regex: filters.keyword, $options: 'i' };
    }
    if (filters.category) {
      query.category = filters.category;
    }
    if (filters.isActive !== undefined) {
      query.isActive = filters.isActive;
    }

    const count = await gigRepository.count(query);
    const gigs = await gigRepository.find(query, page, pageSize);

    return { gigs, page, pages: Math.ceil(count / pageSize), totalGigs: count };
  }

  async getGigById(gigId) {
    const gig = await gigRepository.findById(gigId);
    if (!gig) {
      throw new ApiError(404, "Gig not found");
    }
    return gig;
  }

  async createGig(sellerId, gigData) {
    const { title, description, category, images, packages, tags } = gigData;

    const gig = await gigRepository.create({
      seller: sellerId,
      title,
      description,
      category,
      images: images || [],
      packages,
      tags: tags || []
    });

    return gig;
  }

  async updateGig(gigId, sellerId, gigData, isAdmin = false) {
    const gig = await gigRepository.findById(gigId);
    if (!gig) {
      throw new ApiError(404, "Gig not found");
    }

    if (gig.seller._id.toString() !== sellerId.toString() && !isAdmin) {
      throw new ApiError(403, "Not authorized to update this gig");
    }

    const { title, description, category, images, packages, tags, isActive } = gigData;

    const fieldsToUpdate = {};
    if (title) fieldsToUpdate.title = title;
    if (description) fieldsToUpdate.description = description;
    if (category) fieldsToUpdate.category = category;
    if (images) fieldsToUpdate.images = images;
    if (packages) fieldsToUpdate.packages = packages;
    if (tags) fieldsToUpdate.tags = tags;
    if (isActive !== undefined) fieldsToUpdate.isActive = isActive;

    return await gigRepository.update(gigId, fieldsToUpdate);
  }

  async deleteGig(gigId, sellerId, isAdmin = false) {
    const gig = await gigRepository.findById(gigId);
    if (!gig) {
      throw new ApiError(404, "Gig not found");
    }

    if (gig.seller._id.toString() !== sellerId.toString() && !isAdmin) {
      throw new ApiError(403, "Not authorized to delete this gig");
    }

    await gigRepository.delete(gigId);
    return { message: "Gig successfully deleted" };
  }
}

module.exports = new GigService();

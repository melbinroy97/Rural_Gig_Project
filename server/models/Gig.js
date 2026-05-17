const mongoose = require('mongoose');

const packageSchema = mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  deliveryDays: { type: Number, required: true },
  features: [{ type: String }]
});

const gigSchema = mongoose.Schema({
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  images: [{ type: String }],
  packages: [packageSchema],
  tags: [{ type: String }],
  rating: { type: Number, default: 0 },
  totalOrders: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

const Gig = mongoose.model('Gig', gigSchema);
module.exports = Gig;

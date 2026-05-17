const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
  gig: { type: mongoose.Schema.Types.ObjectId, ref: 'Gig' },
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' }, // Order can be from a Gig or a Job
  worker: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  employer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  package: { 
    name: { type: String },
    price: { type: Number },
    deliveryDays: { type: Number },
    features: [{ type: String }]
  }, // if from a gig
  price: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'active', 'completed', 'cancelled'], 
    default: 'pending' 
  },
  deliveryDate: { type: Date },
  requirements: { type: String }
}, {
  timestamps: true
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;

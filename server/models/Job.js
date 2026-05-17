const mongoose = require('mongoose');

const proposalSchema = mongoose.Schema({
  worker: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bidAmount: { type: Number, required: true },
  coverLetter: { type: String, required: true },
  estimatedDays: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

const jobSchema = mongoose.Schema({
  employer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  budget: {
    type: { type: String, enum: ['fixed', 'hourly'], required: true },
    min: { type: Number },
    max: { type: Number }
  },
  duration: { type: String }, // e.g. "1-3 months", "less than 1 month"
  locationRequired: { type: String }, // e.g. "Anywhere", "Specific Village"
  skills: [{ type: String }],
  experienceLevel: { type: String, enum: ['entry', 'intermediate', 'expert'], default: 'intermediate' },
  status: { type: String, enum: ['open', 'in-progress', 'completed', 'cancelled'], default: 'open' },
  proposals: [proposalSchema]
}, {
  timestamps: true
});

const Job = mongoose.model('Job', jobSchema);
module.exports = Job;

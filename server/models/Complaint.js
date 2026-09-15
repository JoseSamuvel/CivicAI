const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  complaintId: { type: String, unique: true, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userEmail: { type: String },
  userName: { type: String },
  issueType: {
    type: String,
    required: true,
    enum: [
      'Potholes / Road damage',
      'Streetlight failure',
      'Power outage',
      'Poor public transport',
      'Garbage / Waste accumulation',
      'Water pipe leakage',
      'Drinking water shortage',
      'Sewage overflow',
      'Illegal waste dumping',
      'Traffic / Signal issue',
      'Broken public infrastructure',
      'Flooding / Drainage issue',
      'Stray animal problem'
    ]
  },
  description: { type: String, default: '' },
  location: {
    address: { type: String },
    city: { type: String, default: 'Tirunelveli' },
    pincode: { type: String },
    lat: { type: Number },
    lng: { type: Number }
  },
  imageUrl: { type: String, default: '' },
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'resolved', 'rejected'],
    default: 'pending'
  },
  priorityLevel: {
    type: String,
    enum: ['High', 'Medium', 'Low'],
    default: 'Medium'
  },
  authorityName: { type: String, default: '' },
  authorityEmail: { type: String, default: '' },
  aiGeneratedComplaint: { type: String, default: '' },
  referenceNumber: { type: String, default: '' },
  actionTimeline: { type: String, default: '' },
  adminNotes: { type: String, default: '' },
  assignedOfficer: { type: String, default: '' },
  resolvedAt: { type: Date },
  emailSent: { type: Boolean, default: false },
  emailSentAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Pre-save hook: update updatedAt on every save
complaintSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Complaint', complaintSchema);

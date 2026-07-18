const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  driveId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Drive',
    required: true,
  },
  status: {
    type: String,
    enum: ['Registered', 'Shortlisted', 'Rejected', 'Selected'],
    default: 'Registered',
  },
  registeredAt: {
    type: Date,
    default: Date.now,
  }
}, {
  timestamps: true
});

// Composite unique index to prevent duplicate registrations
registrationSchema.index({ userId: 1, driveId: 1 }, { unique: true });

module.exports = mongoose.model('Registration', registrationSchema);

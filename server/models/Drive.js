const mongoose = require('mongoose');

const driveSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true,
  },
  role: {
    type: String,
    required: [true, 'Role name is required'],
    trim: true,
  },
  packageLPA: {
    type: Number,
    required: [true, 'Package in LPA is required'],
    min: [0, 'Package cannot be negative'],
  },
  eligibleBranches: {
    type: [String],
    required: [true, 'Eligible branches list is required'],
  },
  minCGPA: {
    type: Number,
    required: [true, 'Minimum CGPA requirement is required'],
    min: [0, 'CGPA requirement cannot be negative'],
    max: [10, 'CGPA requirement cannot exceed 10.0'],
  },
  maxBacklogs: {
    type: Number,
    required: [true, 'Maximum allowed backlogs is required'],
    min: [0, 'Maximum backlogs cannot be negative'],
  },
  driveDate: {
    type: Date,
    required: [true, 'Drive date is required'],
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
  },
  seatsAvailable: {
    type: Number,
    required: [true, 'Seats available count is required'],
    min: [0, 'Seats available cannot be negative'],
    default: 30,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Drive', driveSchema);

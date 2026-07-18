const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
  role: {
    type: String,
    enum: ['student', 'admin'],
    default: 'student',
  },
  branch: {
    type: String,
    required: function() { return this.role === 'student'; },
    trim: true,
  },
  cgpa: {
    type: Number,
    required: function() { return this.role === 'student'; },
    min: [0, 'CGPA cannot be negative'],
    max: [10, 'CGPA cannot exceed 10.0'],
  },
  backlogs: {
    type: Number,
    required: function() { return this.role === 'student'; },
    min: [0, 'Backlogs cannot be negative'],
  }
}, {
  timestamps: true
});

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);

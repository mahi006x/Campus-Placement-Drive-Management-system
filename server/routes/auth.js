const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// Helper to sign JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

/**
 * @route   POST /api/auth/register
 * @desc    Register a new student
 * @access  Public
 */
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, branch, cgpa, backlogs } = req.body;

    // Standard input validation
    if (!name || !email || !password || !branch || cgpa === undefined || backlogs === undefined) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // CGPA validation
    const cgpaVal = parseFloat(cgpa);
    if (isNaN(cgpaVal) || cgpaVal < 0 || cgpaVal > 10) {
      return res.status(400).json({ message: 'CGPA must be a valid number between 0.0 and 10.0' });
    }

    // Backlog validation
    const backlogsVal = parseInt(backlogs, 10);
    if (isNaN(backlogsVal) || backlogsVal < 0) {
      return res.status(400).json({ message: 'Backlogs cannot be negative' });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email address' });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: 'student', // Registration endpoint is for students only
      branch,
      cgpa: cgpaVal,
      backlogs: backlogsVal
    });

    return res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      branch: user.branch,
      cgpa: user.cgpa,
      backlogs: user.backlogs,
      token: generateToken(user._id)
    });
  } catch (error) {
    console.error('Registration error:', error.message);
    return res.status(500).json({ message: error.message || 'Server error during registration' });
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user & get token
 * @access  Public
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please enter all fields' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    return res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      branch: user.branch,
      cgpa: user.cgpa,
      backlogs: user.backlogs,
      token: generateToken(user._id)
    });
  } catch (error) {
    console.error('Login error:', error.message);
    return res.status(500).json({ message: 'Server error during authentication' });
  }
});

/**
 * @route   GET /api/auth/me
 * @desc    Get current user profile details
 * @access  Private
 */
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.json(user);
  } catch (error) {
    console.error('Profile fetch error:', error.message);
    return res.status(500).json({ message: 'Server error retrieving profile' });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const Registration = require('../models/Registration');
const Drive = require('../models/Drive');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');
const { checkEligibility } = require('../utils/eligibility');

/**
 * @route   POST /api/registrations
 * @desc    Register current student for a placement drive
 * @access  Private (Student only)
 */
router.post('/', protect, async (req, res) => {
  try {
    const { driveId } = req.body;

    if (!driveId) {
      return res.status(400).json({ message: 'Drive ID is required' });
    }

    // Admins cannot register for drives
    if (req.user.role === 'admin') {
      return res.status(403).json({ message: 'Admins cannot register for placement drives' });
    }

    const drive = await Drive.findById(driveId);
    if (!drive) {
      return res.status(404).json({ message: 'Placement drive not found' });
    }

    // 1. Check duplicate registration (friendly error message)
    const alreadyRegistered = await Registration.findOne({
      userId: req.user._id,
      driveId,
    });
    if (alreadyRegistered) {
      return res.status(409).json({ message: "You have already registered for this drive" });
    }

    // 2. Check eligibility (CGPA, Branch, Backlogs)
    const eligibility = checkEligibility(req.user, drive);
    if (!eligibility.eligible) {
      return res.status(400).json({ message: eligibility.reason });
    }

    // 3. Check seat availability
    if (drive.seatsAvailable <= 0) {
      return res.status(400).json({ message: 'No seats available for this drive registration' });
    }

    // 4. Atomically decrement seats available
    const updatedDrive = await Drive.findOneAndUpdate(
      { _id: driveId, seatsAvailable: { $gt: 0 } },
      { $inc: { seatsAvailable: -1 } },
      { new: true }
    );

    if (!updatedDrive) {
      return res.status(400).json({ message: 'No seats available for this drive registration (fully booked)' });
    }

    // 5. Create Registration
    try {
      const registration = await Registration.create({
        userId: req.user._id,
        driveId,
        status: 'Registered',
      });
      return res.status(201).json(registration);
    } catch (dbError) {
      // Revert the seats decrement if database insertion fails
      await Drive.updateOne({ _id: driveId }, { $inc: { seatsAvailable: 1 } });
      
      // Check for duplicate key error (code 11000)
      if (dbError.code === 11000) {
        return res.status(409).json({ message: "You have already registered for this drive" });
      }
      throw dbError;
    }
  } catch (error) {
    console.error('Registration processing error:', error.message);
    return res.status(500).json({ message: 'Server error registering for placement drive' });
  }
});

/**
 * @route   GET /api/registrations/my-registrations
 * @desc    Get all registrations of the current student
 * @access  Private
 */
router.get('/my-registrations', protect, async (req, res) => {
  try {
    const registrations = await Registration.find({ userId: req.user._id })
      .populate('driveId')
      .sort({ registeredAt: -1 });

    return res.json(registrations);
  } catch (error) {
    console.error('My registrations fetch error:', error.message);
    return res.status(500).json({ message: 'Server error retrieving your registrations' });
  }
});

/**
 * @route   GET /api/registrations/drive/:driveId
 * @desc    Get all student registrations for a drive (Admin only, with filters)
 * @access  Private/Admin
 */
router.get('/drive/:driveId', protect, adminOnly, async (req, res) => {
  try {
    const { driveId } = req.params;
    const { branch, minCGPA } = req.query;

    // Validate drive exists
    const drive = await Drive.findById(driveId);
    if (!drive) {
      return res.status(404).json({ message: 'Placement drive not found' });
    }

    // Set up student user filters
    const studentFilter = { role: 'student' };
    if (branch) {
      studentFilter.branch = branch;
    }
    if (minCGPA) {
      const parsedMinCGPA = parseFloat(minCGPA);
      if (!isNaN(parsedMinCGPA)) {
        studentFilter.cgpa = { $gte: parsedMinCGPA };
      }
    }

    // Get matching student IDs
    const students = await User.find(studentFilter).select('_id');
    const studentIds = students.map((s) => s._id);

    // Get registrations matching student IDs and drive
    const registrations = await Registration.find({
      driveId,
      userId: { $in: studentIds },
    })
      .populate('userId', 'name email branch cgpa backlogs')
      .sort({ registeredAt: -1 });

    return res.json(registrations);
  } catch (error) {
    console.error('Drive registrations fetch error:', error.message);
    return res.status(500).json({ message: 'Server error retrieving drive registrations' });
  }
});

/**
 * @route   PUT /api/registrations/:id/status
 * @desc    Update status of a student's registration (Admin only)
 * @access  Private/Admin
 */
router.put('/:id/status', protect, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;

    if (!status || !['Registered', 'Shortlisted', 'Rejected', 'Selected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid or missing registration status value' });
    }

    const registration = await Registration.findById(req.params.id);
    if (!registration) {
      return res.status(404).json({ message: 'Registration record not found' });
    }

    registration.status = status;
    const updatedReg = await registration.save();
    
    // Return registration populated with user details so admin table matches updated state
    const populatedReg = await Registration.findById(updatedReg._id).populate('userId', 'name email branch cgpa backlogs');
    return res.json(populatedReg);
  } catch (error) {
    console.error('Update registration status error:', error.message);
    return res.status(500).json({ message: 'Server error updating registration status' });
  }
});

/**
 * @route   GET /api/registrations/stats
 * @desc    Get dashboard metrics for administrative view
 * @access  Private/Admin
 */
router.get('/stats', protect, adminOnly, async (req, res) => {
  try {
    const totalDrives = await Drive.countDocuments();
    const totalRegistrations = await Registration.countDocuments();

    // Aggregate registration counts per drive
    const regPerDrive = await Registration.aggregate([
      {
        $group: {
          _id: '$driveId',
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'drives',
          localField: '_id',
          foreignField: '_id',
          as: 'driveInfo',
        },
      },
      {
        $unwind: '$driveInfo',
      },
      {
        $project: {
          _id: 1,
          companyName: '$driveInfo.companyName',
          role: '$driveInfo.role',
          count: 1,
        },
      },
    ]);

    return res.json({
      totalDrives,
      totalRegistrations,
      regPerDrive,
    });
  } catch (error) {
    console.error('Stats aggregation error:', error.message);
    return res.status(500).json({ message: 'Server error aggregating metrics' });
  }
});

module.exports = router;
